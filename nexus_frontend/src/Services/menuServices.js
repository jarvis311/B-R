import axiosInstance from "./apiInstance";

export const getMenus = async () => {
  const path = `/api/admin/menus`;
  const res = await axiosInstance.get(`${path}`);
  return res && res.data ? res.data : null;
};

export const addMenu = async (data) => {
  const path = `/api/admin/menus`;
  const res = await axiosInstance.post(`${path}`, data);
  return res && res.data ? res.data : null;
};

export const updateMenu = async (id,data) => {
  const path = `/api/admin/menus/${id}`;
  const res = await axiosInstance.put(`${path}`,data);
  return res && res.data ? res.data : null;
};

export const deleteMenu = async (id) => {
  const path = `/api/admin/menus/${id}`;
  const res = await axiosInstance.delete(`${path}`);
  return res && res.data ? res.data : null;
};

export const deleteBanner = async (id) => {
  const path = `/api/admin/pages/banner/${id}`;
  const res = await axiosInstance.delete(`${path}`);
  return res && res.data ? res.data : null;
};
