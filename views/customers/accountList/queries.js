import Axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const GetAccountList = async (params) => {
  
  const res = await Axios.get(`${API_URL}/account/`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
    params,
  });
  
  return res.data;
};

export const GetAccountListByQuery = async (page) => {
  const res = await Axios.get(`${API_URL}/account/?page=${page}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const DeleteAccountById = async (id) => {
  const res = await Axios.delete(`${API_URL}/account/${id}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const GetFinancialProfileById = async (id) => {
  const res = await Axios.get(`${API_URL}/financial_profile/${id}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};
