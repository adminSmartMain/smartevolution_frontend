import Axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const login = async (data) => {
  // Login is the endpoint that establishes the HttpOnly refresh cookie. It
  // must opt into credentials even before the global auth transport mounts.
  const res = await Axios.post(`${API_URL}/auth/login`, data, { withCredentials: true });
  return res.data;
};
