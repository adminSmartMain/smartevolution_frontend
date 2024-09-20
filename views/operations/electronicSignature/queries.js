import Axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getBuyOrders = async (params = {}) => {
  if (params.opId === undefined || params.opId === "")
    params.opId = "undefined";
  const res = await Axios.get(`${API_URL}/buyOrder`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
    params,
  });
  return res.data;
};

export const getNotifications = async (params) => {
  const res = await Axios.get(
    `${API_URL}/preOperation?opId=undefined&opIdV=undefined&notifications=electronicSignature&nOpId=undefined`,
    {
      headers: {
        authorization: "Bearer " + localStorage.getItem("access-token"),
      },
      params,
    }
  );
  return res.data;
};

export const getOperationById = async (opId, investorId) => {
  const res = await Axios.get(
    `${API_URL}/preOperation?opId=undefined&opIdV=${opId}&investor=${investorId}`,
    {
      headers: {
        authorization: "Bearer " + localStorage.getItem("access-token"),
      },
    }
  );
  return res.data;
};

export const sendBuyOrder = async (data) => {
  const res = await Axios.post(`${API_URL}/buyOrder`, data, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};
