import Axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Función para verificar el token
export const verifyToken = async (uidb64, token, data) => {
    console.log(uidb64.token)
  try {
    const res = await Axios.get(
      `${API_URL}/auth/token/verify/${uidb64.uidb64}/${uidb64.token}`,
      data
    );
    return res.data;
  } catch (error) {
    console.error("Error al verificar el token:", error);
    throw error;
  }
};

// Función para resetear la contraseña
export const resetPassword = async (data) => {
  try {
    const res = await Axios.patch(`${API_URL}/auth/reset-password-complete`, data);
    return res.data;
  } catch (error) {
    console.error("Error al resetear la contraseña:", error);
    throw error;
  }
};