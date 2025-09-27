import Axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const GetSummaryList = async (params) => {
  console.log(params)
  const res = await Axios.get(
    `${API_URL}/report/negotiationSummary?pdf=undefined&id=undefined&opId=undefined`,
    {
      headers: {
        authorization: "Bearer " + localStorage.getItem("access-token"),
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
        authorization: "Bearer " + localStorage.getItem("access-token"),
      },
    }
  );
  return res.data;
};
