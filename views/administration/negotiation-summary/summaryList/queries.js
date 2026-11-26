import { getAccessToken } from "@lib/auth/session";
import Axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const GetSummaryList = async (params) => {
  console.log(params)
  const res = await Axios.get(
    `${API_URL}/report/negotiationSummary?pdf=undefined&id=undefined&opId=undefined`,
    {
      headers: {
        authorization: "Bearer " + getAccessToken(),
      },
      params,
    }
  );
  return res.data;
};

export const GetNegotiationSummaryPDF = async (id) => {
  const res = await Axios.get(
    `${API_URL}/report/negotiationSummary?pdf=${id}`,
    {
      headers: {
        authorization: "Bearer " + getAccessToken(),
      },
    }
  );
  return res.data;
};
