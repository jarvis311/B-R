import axiosInstance from "./apiInstance";

export const getModules = async () => {
  const path = `/api/admin/modules`;
  const res = await axiosInstance.get(`${path}`);
  return res && res.data ? res.data : null;
};
export const getModulesList = async () => {
  const path = `/api/modules`;
  const res = await axiosInstance.get(`${path}`);
  return res && res.data ? res.data : null;
};

export const addModule = async (data) => {
  const path = `/api/admin/modules`;
  const res = await axiosInstance.post(`${path}`, data,{
    headers:{
    'Content-Type': 'multipart/form-data'}
  });
  return res && res.data ? res.data : null;
};

export const updateModule = async (id,data) => {
  const path = `/api/admin/modules/${id}`;
  const res = await axiosInstance.put(`${path}`,data,{
    headers:{
    'Content-Type': 'multipart/form-data'}
  });
  return res && res.data ? res.data : null;
};

export const deleteModule = async (id) => {
  const path = `/api/admin/modules/${id}`;
  const res = await axiosInstance.delete(`${path}`);
  return res && res.data ? res.data : null;
};
