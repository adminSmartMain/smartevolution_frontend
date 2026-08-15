import Axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const GetReceiptHistory = async (params = {}) => {
  const res = await Axios.get(`${API_URL}/receipt/history/`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
    params,
  });
  return res.data;
};
