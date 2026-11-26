import { getAccessToken } from "@lib/auth/session";
import Axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getNotifications = async (params) => {
  const res = await Axios.get(
    `${API_URL}/${params}`,
    {
      headers: {
        authorization: "Bearer " + getAccessToken(),
      },
      params,
    }
  );
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
        authorization: "Bearer " + getAccessToken(),
      },
    }
  );
  return res.data;
};
