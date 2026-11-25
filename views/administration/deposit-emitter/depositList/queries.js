import { getAccessToken } from "@lib/auth/session";
import Axios from "axios";


const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const GetDepositList = async (params) => {
  const res = await Axios.get(`${API_URL}/emitter-deposit/`, {
    headers: {
      authorization: "Bearer " + getAccessToken(),
    },
    params,
  });
  return res.data;
};

export const GetDepositListByQuery = async (page) => {
  const res = await Axios.get(`${API_URL}/emitter-deposit/?page=${page}`, {
    headers: {
      authorization: "Bearer " + getAccessToken(),
    },
  });
  return res.data;
};

export const DeleteDepositById = async (id) => {
  const res = await Axios.delete(`${API_URL}/emitter-deposit/${id}`, {
    headers: {
      authorization: "Bearer " + getAccessToken(),
    },
  });
  return res.data;
};

export const GetFinancialProfileById = async (id) => {
  const res = await Axios.get(`${API_URL}/financial_profile/${id}`, {
    headers: {
      authorization: "Bearer " + getAccessToken(),
    },
  });
  return res.data;
};
