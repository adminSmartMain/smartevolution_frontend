import Axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getOperationById = async (data) => {
  const res = await Axios.get(`${API_URL}/preOperation/${data}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const RegisterReceipt = async (data) => {
  const res = await Axios.post(`${API_URL}/receipt/`, data, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};
export const typeReceipt = async (data) => {
  const res = await Axios.get(`${API_URL}/type_receipt`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};


export const GetReceiptList = async (params) => {
  // Limpiar parámetros undefined o null
  const cleanParams = {};
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      cleanParams[key] = params[key];
    }
  });
console.log(cleanParams)
  const res = await Axios.get(`${API_URL}/receipt/`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
    params: cleanParams,
  });
  return res.data;
};

export const Clients = async (data) => {
  const res = await Axios.get(`${API_URL}/client/all`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};


export const Users = async (data) => {
  const res = await Axios.get(`${API_URL}/user`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};
