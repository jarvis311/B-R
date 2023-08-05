import axiosInstance from "./apiInstance";

export const AuthLogin = async (data) => {
  const path = `/api/auth/login`;
  const res = await axiosInstance.post(`${path}`, data);
  return res && res.data ? res.data : null;
};
export const GetUserData = async () => {
  const path = `/api/users`;
  const res = await axiosInstance.get(`${path}`);
  return res && res.data ? res.data : null;
};

export const AddUsersData = async (data) => {
  const path = `/api/users`;
  const res = await axiosInstance.post(`${path}`, data, {
    headers: {
      "content-type": "mutipart/from-data",
    },
  });
  return res && res.data ? res.data : null;
};
export const updateUsersData = async (id, data) => {
  const path = `/api/users/${id}`;
  const res = await axiosInstance.put(`${path}`, data, {
    headers: {
      "content-type": "mutipart/from-data",
    },
  });
  return res && res.data ? res.data : null;
};
export const getSingleUserData = async (id) => {
  const path = `/api/users/${id}`;
  const res = await axiosInstance.get(`${path}`);

  return res && res.data ? res.data : null;
};
export const DeleteUserData = async (id) => {
  const path = `/api/users/${id}`;
  const res = await axiosInstance.delete(`${path}`);
  return res && res.data ? res.data : null;
};

export const getUserProfile = async () => {
  const path = `/api/users/profile`;
  const res = await axiosInstance.get(`${path}`);
  return res && res.data ? res.data : null;
};
export const GetRoleData = async () => {
  const path = `/api/admin/roles`;
  const res = await axiosInstance.get(`${path}`);
  return res && res.data ? res.data : null;
};
