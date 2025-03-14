import Axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getOperationsVersionTwo = async (params = {}) => {
  const res = await Axios.get(
    `${API_URL}/preOperation/params?opId=${params.opId || ""}&billId=${
      params.billId || ""
    }&investor=${params.investor || ""}&page=${params.page || 1}`,
    {
      headers: {
        authorization: "Bearer " + localStorage.getItem("access-token"),
      },
    }
  );
  return res.data;
};

export const UpdateOperation = async (item) => {
  const res = await Axios.patch(
    `${API_URL}/preOperation/${item.id}`,
    { ...item },
    {
      headers: {
        authorization: "Bearer " + localStorage.getItem("access-token"),
      },
    }
  );
  return res.data;
};
export const MassiveUpdateOperation = async (item) => {
  const res = await Axios.patch(
    `${API_URL}/preOperation/${item.id}`,
    { ...item },
    {
      headers: {
        authorization: "Bearer " + localStorage.getItem("access-token"),
      },
    }
  );
  return res.data;
};

export const DeleteOperation = async (item) => {
  const res = await Axios.delete(`${API_URL}/preOperation/${item}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};
