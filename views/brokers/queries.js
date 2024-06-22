import Axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const RegisterBrokerQuery = async (data) => {
  const res = await Axios.post(`${API_URL}/broker/`, data, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const GetBrokerByID = async (id) => {
  const res = await Axios.get(`${API_URL}/broker/${id}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const ModifyBrokerQuery = async (data) => {
  const res = await Axios.patch(`${API_URL}/broker/${data.id}`, data, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};
