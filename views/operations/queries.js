import Axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getOperationsVersionTwo = async (params = {}) => {
  const res = await Axios.get(
    `${API_URL}/preOperation/params?opId=${params.opId || ""}&billId=${
      params.billId || ""
    }&investor=${params.investor || ""}&page=${params.page || 1}&mode=operations`,
    {
      headers: {
        authorization: "Bearer " + localStorage.getItem("access-token"),
      },
    }
  );
  return res.data;
};
