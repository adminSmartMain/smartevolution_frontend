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