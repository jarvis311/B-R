import axiosInstance from "./apiInstance";

export const getAllContacts = async () => {
  const path = `/api/admin/contacts`;
  const res = await axiosInstance.get(`${path}`);
  return res && res.data ? res.data : null;
};

export const getAllNewsLetters = async () => {
  const path = `/api/admin/newsletters`;
  const res = await axiosInstance.get(`${path}`);
  return res && res.data ? res.data : null;
};

export const sendNewsLetters = async (data) => {
  const path = `/api/admin/newsletters`;
  const res = await axiosInstance.post(`${path}`, data);
  return res && res.data ? res.data : null;
};