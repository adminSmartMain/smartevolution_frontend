/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useEffect, useState } from "react";

import { useRouter } from "next/router";

import jwt_decode from "jwt-decode";
import { landingRouteForPermissions } from "@lib/routePermissions";
import { clearAccessToken, getAccessToken, setAccessToken } from "@lib/auth/session";
import { clearRefreshCsrfCookie, hasRefreshSession, installAuthTransport, logoutSession, refreshAccessToken } from "@lib/auth/client";

const authContext = createContext();

export default authContext;

const pathsToRedirectDashboard = ["/auth/login", "/auth/register"];
const clientWaitingPath = "/403";
const pathsExcluded = ["/self-management", "/auth/forgotPassword", "/auth/resetPassword", clientWaitingPath];

export const AuthProvider = (child) => {
  const router = useRouter();

  // This must happen during the provider render, before child effects such as
  // the notification bell can start a protected request.  The installer is
  // idempotent and remains guarded for SSR.
  installAuthTransport();

  const [authToken, setAuthToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [user, setUser] = useState({ id: 0, name: "", profile_photo: "" });
  const [admin, setAdmin] = useState(false);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [client, setClient] = useState(null);
  const [accountScope, setAccountScope] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const clearSession = () => {
    clearAccessToken();
    clearRefreshCsrfCookie();
    setAuthToken("");
    setRefreshToken("");
    setUser({ id: 0, name: "", profile_photo: "" });
    setRoles([]);
    setPermissions([]);
    setClient(null);
    setAccountScope(null);
    setAuthReady(true);
  };

  useEffect(() => {
    let cancelled = false;
    const shouldRedirect = pathsToRedirectDashboard.includes(router.pathname);
    const isExcluded = pathsExcluded.includes(router.pathname) || pathsToRedirectDashboard.includes(router.pathname);

    const loadSession = async () => {
      try {
        setAuthReady(false);
        let accessToken = getAccessToken();
        if (!accessToken && !hasRefreshSession()) {
          // A visitor arriving at the login page has no HttpOnly refresh
          // cookie. Do not manufacture a visible 401 just to discover that.
          if (isExcluded) {
            setAuthReady(true);
            return;
          }
          throw new Error("Sesion no encontrada");
        }
        if (!accessToken) accessToken = await refreshAccessToken();
        if (!accessToken) throw new Error("Sesion no encontrada");

        const token = jwt_decode(accessToken);
        const isExpired = token.exp * 1000 < Date.now();

        if (isExpired) {
          clearSession();
          if (!isExcluded) router.push("/auth/login");
          return;
        }

        setAuthToken(accessToken);
        let accessProfile = null;

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/access-control/me/`, {
            headers: { authorization: `Bearer ${accessToken}` },
          });

          if (response.status === 401 || response.status === 403) {
            throw new Error("Sesion invalida");
          }

          if (response.ok) {
            const result = await response.json();
            if (!cancelled) {
              accessProfile = result.data;
              setRoles(accessProfile.roles || []);
              setPermissions(accessProfile.permissions || []);
              setClient(accessProfile.client || null);
              setAccountScope(accessProfile.account_scope || "INTERNAL");
              setAdmin(Boolean(accessProfile.is_superuser));
              setUser({
                id: accessProfile.id || token.sub,
                name: accessProfile.name || "",
                profile_photo: accessProfile.profile_photo || "",
              });
            }
          } else {
            console.warn("No se pudo cargar el perfil de acceso; se usaran los permisos del token.");
          }
        } catch (error) {
          if (error.message === "Sesion invalida") {
            clearSession();
            if (!isExcluded) router.push("/auth/login");
            return;
          }
          console.warn("No se pudo cargar el perfil de acceso; se usaran los permisos del token.", error);
        }

        if (cancelled) return;
        if (accessProfile?.account_scope === "CLIENT_PORTAL") {
          setAuthReady(true);
          if (router.pathname !== clientWaitingPath) router.replace(clientWaitingPath);
          return;
        }
        setAuthReady(true);

        // redirect the user to the dashboard if the user is logged or if user logged in
        if (shouldRedirect) {
          setAuthToken(accessToken);
          setRefreshToken("");
          router.push(landingRouteForPermissions(accessProfile?.permissions || [], accessProfile?.is_superuser));
        }
      } catch (error) {
        console.error(error.message);
        // A refresh started while the login page mounted may finish after a
        // successful interactive login. Never erase that newer in-memory
        // session with the stale refresh failure.
        if (isExcluded && getAccessToken()) {
          setAuthReady(true);
          return;
        }
        clearSession();
        if (!isExcluded) router.push("/auth/login");
      }
    };

    loadSession();

    return () => {
      cancelled = true;
    };
  }, [router.pathname]);

  const logout = async () => {
    try {
      await logoutSession();
    } finally {
      clearSession();
      router.replace("/auth/login");
    }
  };

  const setSessionUser = (nextUser) => setUser((current) => ({ ...current, ...nextUser }));
  const can = (permission) => admin || permissions.includes(permission);
  return (
    <authContext.Provider
      value={{ authToken, refreshToken, user, admin, roles, permissions, client, accountScope, authReady, can, logout, setSessionUser }}
    >
      {child.children}
    </authContext.Provider>
  );
};
