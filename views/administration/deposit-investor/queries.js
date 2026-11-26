import { getAccessToken } from "@lib/auth/session";
import Axios from "axios";


const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const RegisterDepositQuery = async (data) => {
  const res = await Axios.post(`${API_URL}/deposit/`, data, {
    headers: {
      authorization: "Bearer " + getAccessToken(),
    },
  });
  return res.data;
};

export const GetDepositByID = async (id) => {
  const res = await Axios.get(`${API_URL}/deposit/${id}`, {
    headers: {
      authorization: "Bearer " + getAccessToken(),
    },
  });
  return res.data;
};

export const ModifyDepositQuery = async (data) => {
  const res = await Axios.patch(`${API_URL}/deposit/${data.id}`, data, {
    headers: {
      authorization: "Bearer " + getAccessToken(),
    },
  });
  return res.data;
};
