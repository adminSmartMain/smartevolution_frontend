import Axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const resetPassword = async (data) => {
  const res = await Axios.post(`${API_URL}/auth/reset-password`, data);
  return res.data;
};
