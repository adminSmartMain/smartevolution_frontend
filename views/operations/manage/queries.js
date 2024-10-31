import Axios from "axios";


const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Get last operation Id
export const GetLastOperationId = async (id) => {
  const res = await Axios.get(`${API_URL}/preOperation/last`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

// Create new operation
export const CreateOperation = async (values, op) => {
  
  let results = [];
  if (values.length === 1) {
    if (values[0].opDate === undefined)
      values[0].opDate = new Date().toISOString().substring(0, 10);
    // round payed amount to 2 decimals
    values[0].payedAmount = Math.round(values[0].payedAmount * 100) / 100;
    const res = await Axios.post(
      `${API_URL}/preOperation/`,
      {
        ...values[0],
      },
      {
        headers: {
          authorization: "Bearer " + localStorage.getItem("access-token"),
        },
      }
    );
    return res.data;
  } else {
    values.forEach(async (item) => {
      if (item.opDate === undefined)
        item.opDate = new Date().toISOString().substring(0, 10);
      const res = await Axios.post(
        `${API_URL}/preOperation/`,
        {
          ...item,
        },
        {
          headers: {
            authorization: "Bearer " + localStorage.getItem("access-token"),
          },
        }
      );
      results.push(res.data);
    });
    return results;
  }
};

export const UpdateOperation = async (data, previousValues, previousDeleted) => {
  let results = [];
  if (data.length > 1) {
    data.forEach(async (item) => {
      if (item.billCode === undefined) {
        item.billCode = "";
        if (previousDeleted === "true" && item.status !== 2) {
          // add previousDeleted attribute to the item
          item.previousDeleted = "true";
        }
        const res = await Axios.patch(
          `${API_URL}/preOperation/${item.id}`,
          { ...item },
          {
            headers: {
              authorization: "Bearer " + localStorage.getItem("access-token"),
            },
          }
        );
        results.push(res.data);
      } else {
        if (previousDeleted === "true" && item.status !== 2) {
          // add previousDeleted attribute to the item
          item.previousDeleted = 'true';
        }
        const res = await Axios.post(
          `${API_URL}/preOperation/`,
          {
            ...item,
          },
          {
            headers: {
              authorization: "Bearer " + localStorage.getItem("access-token"),
            },
          }
        );
      }
    });
    return results;
  } else {
    if (data[0].billCode === undefined) data[0].billCode = "";
    if (data[0].DateBill === undefined || data[0].DateBill === null) data[0].DateBill = previousValues?.data.DateBill;
    if (data[0].DateExpiration === undefined || data[0].DateExpiration === null) data[0].DateExpiration = previousValues?.data.DateExpiration;
    if (data[0].investorProfit === undefined || data[0].investorProfit === null || isNaN(data[0].investorProfit) === true) data[0].investorProfit = previousValues?.data.investorProfit;
    if (previousDeleted === "true") {
      // add previousDeleted attribute to the item
      data[0].previousDeleted = 'true';      
    }
    const res = await Axios.patch(
      `${API_URL}/preOperation/${data[0].id}`,
      { ...data[0] },
      {
        headers: {
          authorization: "Bearer " + localStorage.getItem("access-token"),
        },
      }
    );
    return res.data;
  }
};

export const GetOperationById = async (data) => {
  const res = await Axios.get(`${API_URL}/preOperation/${data}?id=${data}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const GetBillFraction = async (id) => {
  const res = await Axios.get(`${API_URL}/preOperation/billFraction/${id}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const DeleteOperation = async (id) => {
  const res = await Axios.delete(`${API_URL}/preOperation/${id}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
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