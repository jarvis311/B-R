import axiosInstance from "./apiInstance";

export const getPages = async () => {
  const path = `/api/admin/pages`;
  const res = await axiosInstance.get(`${path}`);
  return res && res.data ? res.data : null;
};

export const createPage = async (data) => {
    const path = `/api/admin/pages`;
    const res = await axiosInstance.post(`${path}`,data,{
      headers:{
      'Content-Type': 'multipart/form-data'}
    });
    return res && res.data ? res.data : null;
  };

export const updatePage = async (id,data) => {
  const path = `/api/admin/pages/${id}`;
  const res = await axiosInstance.put(`${path}`,data,{
    headers:{
    'Content-Type': 'multipart/form-data'}
  });
  return res && res.data ? res.data : null;
};

export const deletePage = async (id) => {
  const path = `/api/admin/pages/${id}`;
  const res = await axiosInstance.delete(`${path}`);
  return res && res.data ? res.data : null;
};
