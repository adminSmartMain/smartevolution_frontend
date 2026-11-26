import { getAccessToken } from "@lib/auth/session";
import Axios from "axios";

const readToken = () => getAccessToken();

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const receiptStatus = async (data) => {
  const res = await Axios.get(`${API_URL}/receipt_status`, {
    headers: {
      authorization: "Bearer " + getAccessToken(),
    },
  });
  return res.data;
};
