/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useEffect, useState } from "react";

import { useRouter } from "next/router";

import jwt_decode from "jwt-decode";

const authContext = createContext();

export default authContext;

const pathsToRedirectDashboard = ["/auth/login", "/auth/register"];
const pathIsUserIsLogged = "/dashboard";
const pathsExcluded = ["/self-management","/auth/forgotPassword","/auth/resetPassword"];

export const AuthProvider = (child) => {
  const router = useRouter();

  const [authToken, setAuthToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [user, setUser] = useState({ id: 0, name: "" });
  const [admin, setAdmin] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const shouldRedirect = pathsToRedirectDashboard.includes(router.pathname);
    const isExcluded = pathsExcluded.includes(router.pathname);

    try {
      const access_token = localStorage.getItem("access-token");

      const token = jwt_decode(access_token);

      const isExpired = token.exp * 1000 < Date.now();

      // set the user data if the user is logged
      if (token && pathIsUserIsLogged === "/dashboard") {
        setUser({ id: token.user_id, name: token.name });
        setAdmin(token.is_superuser);
        setRoles(token.roles);
      }
      // redirect the user to the dashboard if the user is logged or if user logged in
      if (shouldRedirect && token) {
        setAuthToken(localStorage.getItem("access-token"));
        setRefreshToken(localStorage.getItem("refresh-token"));
        router.push("/dashboard");
      }
      // redirect to login is the token is expired
      if (isExpired && !isExcluded) {
        localStorage.removeItem("access-token");
        localStorage.removeItem("refresh-token");
        setAuthToken("");
        setRefreshToken("");
        router.push("/auth/login");
      }
    } catch (error) {
      console.error(error.message);
      if (!isExcluded) router.push("/auth/login");
    }
  }, [router.pathname]);

  const logout = () => {
    localStorage.removeItem("access-token");
    localStorage.removeItem("refresh-token");
    router.replace("/auth/login");
  };

  return (
    <authContext.Provider
      value={{ authToken, refreshToken, user, admin, roles, logout }}
    >
      {child.children}
    </authContext.Provider>
  );
};
