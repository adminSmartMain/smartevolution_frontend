import Axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const dashboardInfo = async (params = {}) => {
  const res = await Axios.get(
    `${API_URL}/dashboard`,
    {
      headers: {
        authorization: "Bearer " + localStorage.getItem("access-token"),
      },
    }
  );
  return res.data;
};