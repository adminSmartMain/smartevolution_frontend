import Axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getOperationById = async (data) => {
  const res = await Axios.get(
    `${API_URL}/preOperation?opId=undefined&opIdV=${data.opId}&investor=${data.investor}`,
    {
      headers: {
        authorization: "Bearer " + localStorage.getItem("access-token"),
      },
    }
  );
  return res.data;
};

export const sendBuyOrder = async (data) => {
  const res = await Axios.post(`${API_URL}/buyOrder/`, data, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const GetSellOrder = async (id) => {
  const res = await Axios.get(`${API_URL}/report/sellOrder/${id}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const GetBuyOrderPDF = async (NoOP, investor) => {
  const res = await Axios.post(
    `${API_URL}/report/sellOrder/`,
    {
      opId: NoOP,
      investorId: investor,
    },
    {
      headers: {
        authorization: "Bearer " + localStorage.getItem("access-token"),
      },
    }
  );
  return res.data;
};
