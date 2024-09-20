import Axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const RegisterAccountQuery = async (data) => {
  const res = await Axios.post(`${API_URL}/account/`, data, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const GetAccountByID = async (id) => {
  const res = await Axios.get(`${API_URL}/account/${id}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const ModifyAccountQuery = async (data) => {
  const res = await Axios.patch(`${API_URL}/account/${data.id}`, data, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};
