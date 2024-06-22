import Axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const ReadBills = async (data) => {
  const res = await Axios.post(`${API_URL}/bill/read`, data, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const ReadCreditNotes = async (data) => {
  const res = await Axios.post(`${API_URL}/bill/read/credit-note`, data, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const SaveBills = async (data) => {
  const res = await Axios.post(`${API_URL}/bill/`, data, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};
