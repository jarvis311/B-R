import axiosInstance from "./apiInstance";

export const getRoles = async () => {
  const path = `/api/admin/roles`;
  const res = await axiosInstance.get(`${path}`);
  return res && res.data ? res.data : null;
};
export const getRoleDetail = async (id) => {
  const path = `/api/admin/roles/${id}`;
  const res = await axiosInstance.get(`${path}`);
  return res && res.data ? res.data : null;
};


export const addRole = async (data) => {
  const path = `/api/admin/roles`;
  const res = await axiosInstance.post(`${path}`, data);
  return res && res.data ? res.data : null;
};

export const updateRole = async (id,data) => {
  const path = `/api/admin/roles/${id}`;
  const res = await axiosInstance.put(`${path}`,data);
  return res && res.data ? res.data : null;
};

export const deleteRole = async (id) => {
  const path = `/api/admin/roles/${id}`;
  const res = await axiosInstance.delete(`${path}`);
  return res && res.data ? res.data : null;
};

export const getModuleRoles = async (id) => {
    const path = `/api/admin/modules/roles`;
    const res = await axiosInstance.get(`${path}`);
    return res && res.data ? res.data : null;
  };
  