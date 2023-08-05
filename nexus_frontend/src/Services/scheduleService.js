import axiosInstance from "./apiInstance";

export const getSchedules = async () => {
  const path = `/api/admin/schedule`;
  const res = await axiosInstance.get(`${path}`);
  return res && res.data ? res.data : null;
};
export const getRepeatSchedules = async () => {
  const path = `/api/admin/schedule/reapet`;
  const res = await axiosInstance.get(`${path}`);
  return res && res.data ? res.data : null;
};

export const getSchedule = async (id) => {
  const path = `/api/admin/schedule/${id}`;
  const res = await axiosInstance.get(`${path}`);
  return res && res.data ? res.data : null;
};

export const createSchedule = async (data) => {
  console.log('data >>>', data)
  const path = `/api/admin/schedule`;
  const res = await axiosInstance.post(`${path}`, data);
  return res && res.data ? res.data : null;
};

export const EditSchedule = async (id, data) => {
  const path = `/api/admin/schedule/${id}`;
  const res = await axiosInstance.put(`${path}`, data);
  return res && res.data ? res.data : null;
};

export const deleteSchedule = async (id) => {
  const path = `/api/admin/schedule/${id}`;
  const res = await axiosInstance.delete(`${path}`);
  return res && res.data ? res.data : null;
};
export const deleteFollowingSchedule = async (id) => {
  const path = `/api/admin/schedule/events/${id}`;
  const res = await axiosInstance.delete(`${path}`);
  return res && res.data ? res.data : null;
};
