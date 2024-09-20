import Axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const GetClientList = async (params = {}) => {
  const res = await Axios.get(`${API_URL}/client/`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
    params,
  });
  return res.data;
};

export const GetClientListByQuery = async (page) => {
  const res = await Axios.get(`${API_URL}/client/?page=${page}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const DeleteClientById = async (id) => {
  const res = await Axios.delete(`${API_URL}/client/${id}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const GetFinancialProfileById = async (id) => {
  const res = await Axios.get(`${API_URL}/financialProfile/${id}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};
