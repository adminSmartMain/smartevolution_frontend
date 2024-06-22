import Axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const login = async (data) => {
  const res = await Axios.post(`${API_URL}/auth/login`, data);
  return res.data;
};
