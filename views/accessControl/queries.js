import Axios from "axios";
const API = `${process.env.NEXT_PUBLIC_API_URL}/access-control`;
const config = () => ({ headers: { authorization: `Bearer ${localStorage.getItem("access-token")}` } });
const userPayload = (data) => {
  if (typeof data?.profile_photo !== "string" || !data.profile_photo.startsWith("data:")) return data;
  const [metadata, encoded] = data.profile_photo.split(",");
  const mimeType = metadata.match(/data:(.*?);/)?.[1] || "image/jpeg";
  const extension = mimeType.split("/")[1]?.replace("jpeg", "jpg") || "jpg";
  const bytes = Uint8Array.from(atob(encoded), character => character.charCodeAt(0));
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === "profile_photo") {
      formData.append(key, new Blob([bytes], { type: mimeType }), `profile.${extension}`);
    } else if (key === "roles") {
      formData.append(key, JSON.stringify(value));
    } else if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });
  return formData;
};
export const getRoles = () => Axios.get(`${API}/roles/`,config()).then(r=>r.data.data);
export const getPermissions = () => Axios.get(`${API}/permissions/`,config()).then(r=>r.data.data);
export const getUsers = () => Axios.get(`${API}/users/`,config()).then(r=>r.data.data);
export const getUserMetrics = () => Axios.get(`${API}/users/metrics/`,config()).then(r=>r.data.data);
export const getUser = (id) => Axios.get(`${API}/users/${id}/`,config()).then(r=>r.data.data);
export const createUser = (data) => Axios.post(`${API}/users/`,userPayload(data),config()).then(r=>r.data);
export const getClientAccess = () => Axios.get(`${API}/client-access/`,config()).then(r=>r.data.data);
export const getAccessOptions = () => Axios.get(`${API}/client-access/options/`,config()).then(r=>r.data.data);
export const getAudit = () => Axios.get(`${API}/audit/`,config()).then(r=>r.data.data);
export const saveRole = (role) => role.id ? Axios.patch(`${API}/roles/${role.id}/`,role,config()) : Axios.post(`${API}/roles/`,role,config());
export const updateUser = (id,data) => Axios.patch(`${API}/users/${id}/`,userPayload(data),config());
export const deleteUser = (id) => Axios.delete(`${API}/users/${id}/`,config()).then(r=>r.data);
export const changeUserPassword = (id,data) => Axios.post(`${API}/users/${id}/password/`,data,config()).then(r=>r.data);
export const archiveUser = (id) => Axios.post(`${API}/users/${id}/archive/`,{},config()).then(r=>r.data);
export const restoreUser = (id) => Axios.post(`${API}/users/${id}/restore/`,{},config()).then(r=>r.data);
export const getUserOperations = (id,status="pending",page=1,pageSize=5) => Axios.get(
  `${API}/users/${id}/operations/`,
  {...config(),params:{status,page,page_size:pageSize}}
).then(r=>r.data.data);
export const updateClientAccess = (id,data) => Axios.patch(`${API}/client-access/${id}/`,data,config());
export const createClientAccess = (data) => Axios.post(`${API}/client-access/`,data,config());


const NOTIFICATION_API = `${process.env.NEXT_PUBLIC_API_URL}/notifications/admin`;

export const getNotificationRules = () =>
  Axios.get(`${NOTIFICATION_API}/rules/`, config()).then((r) => r.data.data);

export const getNotificationRuleOptions = () =>
  Axios.get(`${NOTIFICATION_API}/rules/options/`, config()).then((r) => r.data.data);

export const updateNotificationRule = (id, data) =>
  Axios.patch(`${NOTIFICATION_API}/rules/${id}/`, data, config()).then((r) => r.data.data);


export const previewNotificationRule = (data) =>
  Axios.post(`${NOTIFICATION_API}/rules/preview/`, data, config()).then((r) => r.data.data);
