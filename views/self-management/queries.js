import Axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const CreateClientSelfManagement = async (data) => {
  const res = await Axios.post(`${API_URL}/selfManagement/legalClient`, data);
  return res.data;
};

export const CreateNaturalClientSelfManagement = async (data) => {
  const res = await Axios.post(`${API_URL}/selfManagement/naturalClient`, data);
  return res.data;
};
