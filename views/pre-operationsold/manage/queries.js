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
  const res = await Axios.post(
    `${API_URL}/preOperation/`,
    {
      ...values,
      opId: op,
    },
    {
      headers: {
        authorization: "Bearer " + localStorage.getItem("access-token"),
      },
    }
  );
  return res.data;
};

export const UpdateOperation = async (data) => {
  let results = [];
  if (data.length > 1) {
  console.log('entre', data);

    data.forEach(async (item) => {
      if (item.opId > 0) {
        console.log(item.opId)
        const res = await Axios.patch(
          `${API_URL}/preOperation/${item.id}`,
          item,
          {
            headers: {
              authorization: "Bearer " + localStorage.getItem("access-token"),
            },
          }
        );
        results.push(res.data);
      }
    });
    return results;
  } else {
    console.log('entre a else', data);
    if (data[0].opId > 0) {
      console.log(data.opId)
      const res = await Axios.patch(
        `${API_URL}/preOperation/${data[0].id}`,
        data[0],
        {
          headers: {
            authorization: "Bearer " + localStorage.getItem("access-token"),
          },
        }
      );
      return res.data;
    }
  }
};

export const GetOperationById = async (data) => {
  const res = await Axios.get(`${API_URL}/preOperation/${data}`, {
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
