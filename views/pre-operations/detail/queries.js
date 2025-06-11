import Axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getOperationById = async (data) => {
  const res = await Axios.get(`${API_URL}/preOperation?opId=${data}`,{
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};


export const sendBuyOrder = async (data) => {
  const res = await Axios.post(`${API_URL}/buyOrder/${data}`,{} ,{
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};