import { getAccessToken } from "@lib/auth/session";
import Axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const headers = () => ({
  authorization: "Bearer " + getAccessToken(),
});

export const GetPendingBillyBills = async () => {
  const res = await Axios.get(`${API_URL}/bill/billy-pending`, { headers: headers() });
  return res.data;
};

export const RetryPendingBillyBills = async (billIds) => {
  const res = await Axios.post(`${API_URL}/bill/billy-pending`, { billIds }, { headers: headers() });
  return res.data;
};
