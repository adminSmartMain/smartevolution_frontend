import Axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const GetBillList = async (params) => {
  const res = await Axios.get(`${API_URL}/bill/`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
    params,
  });
  return res.data;
};

export const GetBillListByQuery = async (page) => {
  const res = await Axios.get(`${API_URL}/bill/?page=${page}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const DeleteBillById = async (id) => {
  const res = await Axios.delete(`${API_URL}/bill/${id}`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const GetBillEvents = async (cufe) => {
  

  try {
    const res = await Axios.get(`https://api.billy.com.co/v2/invoices?cufe=${cufe}`, {
      headers: {
        authorization: "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpaWQiOiItTkJ0MnktbG8yaENyeFNEUFdZOSIsInNjcCI6eyJpbnYiOjB9LCJpYXQiOjE3NjI3ODQxODAsImV4cCI6MTc5NDMyMDE4MCwic3ViIjoiR0JXdWZHcWZSc1ZFNUp3ZmxiTXdtNTVKeWZIMyIsImp0aSI6Ii1PZGk2emJ3YjFSZU1hQ05oSlNSIn0.Io2W8NumwKrTosCq9S_RnzqyMYX8IOJF89VhAiihhts",
      },
    });
    
    // Log para ver la respuesta del servidor
    return res.data;

  } catch (error) {
    console.error("Error during GetBillEvents request:", error);  // Log para ver si hay algún error en la petición
    throw error;  // Re-lanzar el error para que sea manejado por el código llamante si es necesario
  }
};
// Get last operation Id
export const GetLastOperationId = async (id) => {
  const res = await Axios.get(`${API_URL}/preOperation/last`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};


export const getTypeBill = async () => {
  const res = await Axios.get(`${API_URL}/type_bill/`, {
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

export const CreateBillManually = async (values) => {
  const res = await Axios.post(
    `${API_URL}/bill/save_bill/`,
    {
      ...values,
      
    },
    {
      headers: {
        authorization: "Bearer " + localStorage.getItem("access-token"),
      },
    }
  );
  return res.data;
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

export const EditBill = async (data) => {
  if (!data) throw new Error("Datos requeridos");
  
  const res = await Axios.patch(
    `${API_URL}/bill/${data.bill}`, // Asumo que billId es el identificador
    data, // Envía todos los datos en el cuerpo
    {
      headers: {
        authorization: "Bearer " + localStorage.getItem("access-token"),
      },
    }
  );
  return res.data;
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
  const res = await Axios.get(`${API_URL}/bill?billEvent=${data}`, {
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


export const TypeOperation = async (data) => {
  const res = await Axios.get(`${API_URL}/type_operation`, {
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