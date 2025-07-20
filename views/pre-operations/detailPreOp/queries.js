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

// Función para resetear la contraseña
export const GetAllUsers = async (data) => {
  try {
    const res = await Axios.get(`${API_URL}/user/`, {
      headers: {
        authorization: "Bearer " + localStorage.getItem("access-token"),
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error al resetear la contraseña:", error);
    throw error;
  }
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

export const Clients = async (data) => {
  const res = await Axios.get(`${API_URL}/client/all`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};


export const Bills = async (data) => {
  if (data) {
    const res = await Axios.get(`${API_URL}/bill/${data}`, {
      headers: {
        authorization: "Bearer " + localStorage.getItem("access-token"),
      },
    });
    return res.data;
  }
};

export const BillsByOperation = async (data) => {
  const res = await Axios.get(`${API_URL}/bill?opId=${data}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const BrokerByClient = async (data) => {
  const res = await Axios.get(`${API_URL}/broker/client/${data}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const payerByBill = async (data) => {
  const res = await Axios.get(`${API_URL}/bill?payerId=${data}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const billById = async (data) => {
  const res = await Axios.get(`${API_URL}/bill?reBuy=${data}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};
export const AccountsFromClient = async (data) => {
  const res = await Axios.get(`${API_URL}/account/client/${data}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};