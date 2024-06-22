import Axios from "axios";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxOTQyMjk1OTkyLCJpYXQiOjE2Nzk0OTU5OTIsImp0aSI6IjU4OTc5YzVmYTgxODRlN2M4Y2NkNWJkNmYyNTc2ZTBlIiwidXNlcl9pZCI6ImU3OTkxZTQwLTE2ODQtNGZlOC05ZDcyLTU0NjMzMTM0MzEzZiIsIm5hbWUiOiJzbWFydCAgYWRtaW4iLCJyb2xlcyI6WyJzdXBlcnVzZXIiXSwiaXNfc3VwZXJ1c2VyIjp0cnVlfQ.eU3R88ps423NGzPieEX36OMPyvLVjqNq7IZz-SuOmOs";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const GetDepositList = async (params) => {
  const res = await Axios.get(`${API_URL}/deposit/`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
    params,
  });
  return res.data;
};

export const GetDepositListByQuery = async (page) => {
  const res = await Axios.get(`${API_URL}/deposit/?page=${page}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const DeleteDepositById = async (id) => {
  const res = await Axios.delete(`${API_URL}/deposit/${id}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const GetFinancialProfileById = async (id) => {
  const res = await Axios.get(`${API_URL}/financial_profile/${id}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const GetRefundReceipt = async (id) => {
  const res = await Axios.post(`${API_URL}/report/egressReceipt/${id}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};
