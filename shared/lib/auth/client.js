import Axios from "axios";
import { clearAccessToken, getAccessToken, getCookie, setAccessToken } from "./session";

const apiUrl = () => process.env.NEXT_PUBLIC_API_URL || "";
const csrfCookieName = () => process.env.NEXT_PUBLIC_AUTH_CSRF_COOKIE_NAME || "se_csrf";
const isApiRequest = (url = "") => {
  const baseUrl = apiUrl();
  // Never attach the application's bearer token to an arbitrary origin when
  // NEXT_PUBLIC_API_URL is absent or malformed.
  return Boolean(baseUrl) && String(url).startsWith(baseUrl);
};
let refreshPromise = null;
let installed = false;

const applyAuthorization = (headers, token) => {
  // Axios accepts differently-cased object keys, while HTTP does not.  Always
  // remove legacy lower-case values (including `Bearer null`) before writing
  // the single canonical header used by the authenticated transport.
  delete headers.Authorization;
  delete headers.authorization;
  if (token) headers.Authorization = `Bearer ${token}`;
};

// The refresh cookie is intentionally HttpOnly. Its paired CSRF cookie is
// readable and exists only while the browser has a session worth refreshing.
export const hasRefreshSession = () => Boolean(getCookie(csrfCookieName()));

export const clearRefreshCsrfCookie = () => {
  if (typeof document === "undefined") return;
  document.cookie = `${csrfCookieName()}=; Max-Age=0; Path=/; SameSite=Strict`;
};

export const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = Axios.post(`${apiUrl()}/auth/token/refresh`, {}, {
      withCredentials: true,
      headers: { "X-CSRF-Token": getCookie(csrfCookieName()) || "" },
      _authRefresh: true,
    }).then((response) => {
      setAccessToken(response.data.access);
      return response.data.access;
    }).catch((error) => {
      clearAccessToken();
      // Redis may be cleared or a refresh family may be revoked while the
      // browser still has its readable CSRF companion. Remove that stale hint
      // so the login page does not keep issuing expected 401 refresh calls.
      clearRefreshCsrfCookie();
      throw error;
    }).finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

export const logoutSession = async () => {
  try {
    await Axios.post(`${apiUrl()}/auth/logout`, {}, {
      withCredentials: true,
      headers: { "X-CSRF-Token": getCookie(csrfCookieName()) || "" },
      _authLogout: true,
    });
  } finally {
    clearAccessToken();
  }
};

export const installAuthTransport = () => {
  if (installed || typeof window === "undefined") return;
  installed = true;
  Axios.defaults.withCredentials = true;

  Axios.interceptors.request.use(async (config) => {
    if (isApiRequest(config.url) && !config._authRefresh && !config._authLogout) {
      let token = getAccessToken();
      // On a full reload the access token is intentionally absent from disk.
      // Recreate it from the HttpOnly refresh cookie before child effects can
      // send a protected API request without credentials.
      if (!token && hasRefreshSession()) {
        try {
          token = await refreshAccessToken();
        } catch (_) {
          token = null;
        }
      }
      config.headers = config.headers || {};
      applyAuthorization(config.headers, token);
    }
    return config;
  });

  Axios.interceptors.response.use(undefined, async (error) => {
    const config = error.config || {};
    if (
      error.response?.status === 401
      && isApiRequest(config.url)
      && !config._authRetried
      && !config._authRefresh
      && !config._authLogout
      && !String(config.url).includes("/auth/login")
    ) {
      config._authRetried = true;
      const token = await refreshAccessToken();
      config.headers = config.headers || {};
      applyAuthorization(config.headers, token);
      return Axios(config);
    }
    return Promise.reject(error);
  });

  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input, init = {}) => {
    const url = typeof input === "string" ? input : input?.url;
    if (!isApiRequest(url)) return originalFetch(input, init);
    const headers = new Headers(init.headers || (typeof input === "object" ? input.headers : undefined));
    let token = getAccessToken();
    if (!token && hasRefreshSession()) {
      try {
        token = await refreshAccessToken();
      } catch (_) {
        token = null;
      }
    }
    if (token) headers.set("Authorization", `Bearer ${token}`);
    else if (headers.get("Authorization") === "Bearer null") headers.delete("Authorization");
    return originalFetch(input, { ...init, headers, credentials: "include" });
  };
};
