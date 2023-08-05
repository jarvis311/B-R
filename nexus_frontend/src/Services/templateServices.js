import axiosInstance from "./apiInstance";

export const getTemplates = async () => {
  const path = `/api/admin/templates`;
  const res = await axiosInstance.get(`${path}`);
  return res && res.data ? res.data : null;
};

export const getTemplateDetail = async (id) => {
    const path = `/api/admin/templates/${id}`;
    const res = await axiosInstance.get(`${path}`);
    return res && res.data ? res.data : null;
  };

export const addTemplate = async (data) => {
  const path = `/api/admin/templates`;
  const res = await axiosInstance.post(`${path}`, data);
  return res && res.data ? res.data : null;
};

export const updateTemplate = async (id,data) => {
  const path = `/api/admin/templates/${id}`;
  const res = await axiosInstance.put(`${path}`,data);
  return res && res.data ? res.data : null;
};

export const deleteTemplate = async (id) => {
  const path = `/api/admin/templates/${id}`;
  const res = await axiosInstance.delete(`${path}`);
  return res && res.data ? res.data : null;
};