import Axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Get Customer By ID
export const GetCustomerById = async (id) => {
    const res = await Axios.get(`${API_URL}/client/${id}`, {
    headers: {
        authorization: "Bearer " + localStorage.getItem("access-token"),
    },
    });
    return res.data;
};


export const saveRiskProfile = async (data) => {
  const res = await Axios.post(`${API_URL}/riskProfile/`, data, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const getRiskProfile = async (data) => {
    const res = await Axios.get(`${API_URL}/riskProfile/client/${data}`, {
        headers: {
          authorization: "Bearer " + localStorage.getItem("access-token"),
        },
      });
      return res.data;
}

export const updateRiskProfile = async (data) => {
  if (data.discount_rate === "") data.discount_rate = 0;
  if (data.discount_rate_investor === "") data.discount_rate_investor = 0;
  const res = await Axios.patch(`${API_URL}/riskProfile/${data.id}`, data, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
}