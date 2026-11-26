import { getAccessToken } from "@lib/auth/session";
import Axios from "axios";

const API = `${process.env.NEXT_PUBLIC_API_URL}/access-control/profile`;
const config = () => ({ headers: { authorization: `Bearer ${getAccessToken()}` } });

export const getProfile = () => Axios.get(`${API}/`, config()).then((res) => res.data.data);
export const updateProfile = (data) => Axios.patch(`${API}/`, data, config()).then((res) => res.data.data);
