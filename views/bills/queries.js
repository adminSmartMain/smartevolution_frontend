import Axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const ReadBills = async (data) => {
  const res = await Axios.post(`${API_URL}/bill/read`, data, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const ReadCreditNotes = async (data) => {
  const res = await Axios.post(`${API_URL}/bill/read/credit-note`, data, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};

export const SaveBills = async (data) => {
  const res = await Axios.post(`${API_URL}/bill/`, data, {
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