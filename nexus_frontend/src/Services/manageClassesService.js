import axiosInstance from "./apiInstance";

export const getAllClasses = async () => {
  const path = `/api/admin/classes`;
  const res = await axiosInstance.get(`${path}`);
  return res && res.data ? res.data : null;
};

export const getClasses = async (id) => {
  const path = `/api/admin/classes/${id}`;
  const res = await axiosInstance.get(`${path}`);
  return res && res.data ? res.data : null;
};

export const createClasses = async (data) => {
  const path = `/api/admin/classes`;
  const res = await axiosInstance.post(`${path}`, data);
  // console.log("res>>>", res.data);
  return res && res.data ? res.data : null;
};

export const updateClasses = async (id, data) => {
  const path = `/api/admin/classes/${id}`;
  const res = await axiosInstance.put(`${path}`, data);
  return res && res.data ? res.data : null;
};

export const deleteClasses = async (id) => {
  const path = `/api/admin/classes/${id}`;
  const res = await axiosInstance.delete(`${path}`);
  return res && res.data ? res.data : null;
};
