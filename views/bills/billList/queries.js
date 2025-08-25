import Axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const GetBillList = async (params={}) => {
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

export const GetBillEvents = async (id) => {
  

  try {
    const res = await Axios.get(`${API_URL}/bill/?billEvent=${id}`, {
      headers: {
        authorization: "Bearer " + localStorage.getItem("access-token"),
      },
    });
    
    // Log para ver la respuesta del servidor
    return res.data;

  } catch (error) {
    console.error("Error during GetBillEvents request:", error);  // Log para ver si hay algún error en la petición
    throw error;  // Re-lanzar el error para que sea manejado por el código llamante si es necesario
  }
};
export const getTypeBill = async () => {
  const res = await Axios.get(`${API_URL}/type_bill/`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};