import Axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const GetRefund = async (params) => {
  const res = await Axios.get(`${API_URL}/refund`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
    params,
  });
  return res.data;
};

export const GetRefundReceiptPDF = async (id) => {
  const res = await Axios.post(
    `${API_URL}/report/refundReceipt/${id}`,
    {},
    {
      headers: {
        authorization: "Bearer " + localStorage.getItem("access-token"),
      },
    }
  );
  return res.data;
};

export const DeleteRefund = async (id) => {
  const res = await Axios.delete(`${API_URL}/refund/${id}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};
