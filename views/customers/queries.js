import Axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const RegisterClientQuery = async (data) => {
  const res = await Axios.post(`${API_URL}/client/`, data, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const GetClientByID = async (id) => {
  const res = await Axios.get(`${API_URL}/client/${id}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const ModifyClientQuery = async (data) => {
 
  const res = await Axios.patch(`${API_URL}/client/${data.id}`, data, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};
