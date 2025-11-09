import Axios from "axios";

import { toast } from 'react-toastify'; // Asegúrate de tener instalada la librería


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

export const CreateOperation = async (values, op) => {
  try {
    const res = await Axios.post(
      `${API_URL}/preOperation/`,
      {
        values,
        opId: op,
      },
      {
        headers: {
          authorization: "Bearer " + localStorage.getItem("access-token"),
        },
      }
    );


    return res.data;

  } catch (error) {
    // Manejo de errores con toast de error
    const errorMessage = error.response?.data?.message 
      || error.message 
      || 'Error al crear la operación';
    
    toast.error(errorMessage);
    
    // Opcional: puedes lanzar el error nuevamente si necesitas manejarlo en el componente
    throw error;
  }
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



export const getOperationsByInvestor = async (params = {}) => {
  const res = await Axios.get(
    `${API_URL}/preOperation?status=0&investor=${params.investor || ""}`,
    {
      headers: {
        authorization: "Bearer " + localStorage.getItem("access-token"),
      },
    }
  );
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


export const TypeOperation = async (data) => {
  const res = await Axios.get(`${API_URL}/type_operation`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};



export const GetSummaryList = async (params) => {
  console.log(params)
  const res = await Axios.get(
    `${API_URL}/report/negotiationSummary?pdf=undefined&id=undefined&opId=undefined`,
    {
      headers: {
        authorization: "Bearer " + localStorage.getItem("access-token"),
      },
      params,
    }
  );
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