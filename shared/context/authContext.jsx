/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useEffect, useState } from "react";

import { useRouter } from "next/router";

import jwt_decode from "jwt-decode";
import { landingRouteForPermissions } from "@lib/routePermissions";

const authContext = createContext();

export default authContext;

const pathsToRedirectDashboard = ["/auth/login", "/auth/register"];
const clientWaitingPath = "/403";
const pathsExcluded = ["/self-management", "/auth/forgotPassword", "/auth/resetPassword", clientWaitingPath];

export const AuthProvider = (child) => {
  const router = useRouter();

  const [authToken, setAuthToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [user, setUser] = useState({ id: 0, name: "" });
  const [admin, setAdmin] = useState(false);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [client, setClient] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const clearSession = () => {
    localStorage.removeItem("access-token");
    localStorage.removeItem("refresh-token");
    setAuthToken("");
    setRefreshToken("");
    setRoles([]);
    setPermissions([]);
    setClient(null);
    setAuthReady(true);
  };

  useEffect(() => {
    let cancelled = false;
    const shouldRedirect = pathsToRedirectDashboard.includes(router.pathname);
    const isExcluded = pathsExcluded.includes(router.pathname);

    const loadSession = async () => {
      try {
        setAuthReady(false);
        const accessToken = localStorage.getItem("access-token");
        if (!accessToken) throw new Error("Sesion no encontrada");

        const token = jwt_decode(accessToken);
        const isExpired = token.exp * 1000 < Date.now();

        if (isExpired) {
          clearSession();
          if (!isExcluded) router.push("/auth/login");
          return;
        }

        if (token.account_scope === "CLIENT_PORTAL") {
          setUser({ id: token.user_id, name: token.name });
          setClient(token.client || null);
          setRoles(token.roles || []);
          setPermissions([]);
          setAuthReady(true);
          if (router.pathname !== clientWaitingPath) router.replace(clientWaitingPath);
          return;
        }

        setUser({ id: token.user_id, name: token.name });
        setAdmin(token.is_superuser);
        setRoles(token.roles || []);
        setPermissions(token.permissions || []);
        setClient(token.client || null);

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
              setRoles(result.data.roles || []);
              setPermissions(result.data.permissions || []);
              setClient(result.data.client || null);
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
        setAuthReady(true);

        // redirect the user to the dashboard if the user is logged or if user logged in
        if (shouldRedirect) {
          setAuthToken(localStorage.getItem("access-token"));
          setRefreshToken(localStorage.getItem("refresh-token"));
          router.push(landingRouteForPermissions(token.permissions || [], token.is_superuser));
        }
      } catch (error) {
        console.error(error.message);
        clearSession();
        if (!isExcluded) router.push("/auth/login");
      }
    };

    loadSession();

    return () => {
      cancelled = true;
    };
  }, [router.pathname]);

  const logout = () => {
    clearSession();
    router.replace("/auth/login");
  };

  const can = (permission) => admin || permissions.includes(permission);
  return (
    <authContext.Provider
      value={{ authToken, refreshToken, user, admin, roles, permissions, client, authReady, can, logout }}
    >
      {child.children}
    </authContext.Provider>
  );
};
