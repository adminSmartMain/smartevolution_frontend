import { getAccessToken } from "@lib/auth/session";
import Axios from "axios";


const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Get Financial Profile by ID
export const GetFinancialProfileById = async (id) => {
  const res = await Axios.get(`${API_URL}/financial_profile/${id}`, {
    headers: {
      authorization: "Bearer " + getAccessToken(),
    },
  });
  return res.data;
};

// Get Customer By ID
export const GetCustomerById = async (id) => {
  const res = await Axios.get(`${API_URL}/client/${id}`, {
    headers: {
      authorization: "Bearer " + getAccessToken(),
    },
  });
  return res.data;
};
