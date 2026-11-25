import { getAccessToken } from "@lib/auth/session";
import Axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const ReadBills = async (data) => {
  const res = await Axios.post(`${API_URL}/bill/read`, data, {
    headers: {
      authorization: "Bearer " + getAccessToken(),
    },
  });
  return res.data;
};

export const ReadCreditNotes = async (data) => {
  const res = await Axios.post(`${API_URL}/bill/read/credit-note`, data, {
    headers: {
      authorization: "Bearer " + getAccessToken(),
    },
  });
  return res.data;
};

export const SaveBills = async (data) => {
  const res = await Axios.post(`${API_URL}/bill/`, data, {
    headers: {
      authorization: "Bearer " + getAccessToken(),
    },
  });
  return res.data;
};
export const GetBillEvents = async (cufe) => {
  try {
    // Billy credentials must remain on the backend.  This endpoint performs
    // the lookup with the server-side integration rather than exposing a
    // provider token in browser code.
    const res = await Axios.get(`${API_URL}/bill/?billEvent=${encodeURIComponent(cufe)}`, {
      headers: {
        authorization: "Bearer " + getAccessToken(),
      },
    });
    
    // Log para ver la respuesta del servidor
    return res.data;

  } catch (error) {
    console.error("Error during GetBillEvents request:", error);  // Log para ver si hay algún error en la petición
    throw error;  // Re-lanzar el error para que sea manejado por el código llamante si es necesario
  }
};
