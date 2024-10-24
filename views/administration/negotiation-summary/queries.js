import Axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Get Negotiation Summary by ID
export const GetNegotiationSummary = async (id) => {
  const res = await Axios.get(`${API_URL}/report/negotiationSummary?id=${id}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

// Create Negotiation Summary

export const CreateNegotiationSummary = async (data) => {
  const res = await Axios.post(`${API_URL}/report/negotiationSummary/`, data, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const ModifyNegotiationSummary = async (data, id) => {
  const res = await Axios.patch(
    `${API_URL}/report/negotiationSummary/${id}`,
    data,
    {
      headers: {
        authorization: "Bearer " + localStorage.getItem("access-token"),
      },
    }
  );
  return res.data;
};

export const GetRiskProfile = async (data) => {
  const res = await Axios.get(`${API_URL}/riskProfile/client/${data}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const RegisterDepositQuery = async (data) => {
  const res = await Axios.post(`${API_URL}/emitter-deposit/`, data, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const DeleteDepositById = async (id) => {
  console.log("id a eliminar",id)
  const res = await Axios.delete(`${API_URL}/emitter-deposit/${id}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const ModifyDepositQuery = async (data) => {
  //If observation is empty, put an empty string
  if (!data.observations) {
    data.observations = "";
  }

  const res = await Axios.patch(`${API_URL}/emitter-deposit/${data.id}`, data, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const GetPurchaseOrderPDF = async (data) => {
  const res = await Axios.get(
    `${API_URL}/report/purchaseOrder/${data}?type=emitter`,
    {
      headers: {
        authorization: "Bearer " + localStorage.getItem("access-token"),
      },
    }
  );
  return res.data;
};

export const GetSummaryByID = async (id) => {
  const res = await Axios.get(
    `${API_URL}/report/negotiationSummary?pdf=undefined&id=undefined&opId=${id}`,
    {
      headers: {
        authorization: "Bearer " + localStorage.getItem("access-token"),
      },
    }
  );
  return res.data;
};

export const GetDepositsOnly = async (id) => {
  const res = await Axios.get(`${API_URL}/emitter-deposit?opId=${id}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};
