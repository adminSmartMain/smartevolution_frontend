let accessToken = null;

export const getAccessToken = () => accessToken;
export const setAccessToken = (token) => { accessToken = token || null; };
export const clearAccessToken = () => { accessToken = null; };

export const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  const value = document.cookie.split("; ").find((item) => item.startsWith(prefix));
  return value ? decodeURIComponent(value.slice(prefix.length)) : null;
};
