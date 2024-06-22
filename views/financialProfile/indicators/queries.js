import Axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Get Financial Profile by ID
export const GetFinancialProfileById = async (id) => {
  const res = await Axios.get(`${API_URL}/financial_profile/${id}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

// Get Customer By ID
export const GetCustomerById = async (id) => {
  const res = await Axios.get(`${API_URL}/client/${id}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

//Get Financial Profile Indicators by ID
export const GetFinancialProfileIndicatorsById = async (id) => {
  const res = await Axios.get(`${API_URL}/financialProfile/indicators/${id}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const GetFinancialProfileIndicatorsPDF = async (id) => {
  const res = await Axios.get(
    `${API_URL}/financialProfile/indicators/${id}?pdf=true`,
    {
      headers: {
        authorization: "Bearer " + localStorage.getItem("access-token"),
      },
    }
  );
  return res.data;
};
