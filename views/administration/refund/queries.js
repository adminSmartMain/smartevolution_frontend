import Axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const SaveRefund = async (data) => {
  const res = await Axios.post(`${API_URL}/refund/`, data, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const UpdateRefund = async (data) => {
  const res = await Axios.patch(`${API_URL}/refund/${data.id}`, data, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const GetRefundByID = async (id) => {
  const res = await Axios.get(`${API_URL}/refund/${id}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const GetRiskProfile = async (data) => {
  const res = await Axios.get(`${API_URL}/riskProfile/client/${data}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};
