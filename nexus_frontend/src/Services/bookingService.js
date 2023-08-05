import axiosInstance from "./apiInstance";

export const getAllBookings = async () => {
  const path = `/api/admin/booking`;
  const res = await axiosInstance.get(`${path}`);
  return res && res.data ? res.data : null;
};

export const getBookings = async (id) => {
  const path = `/api/admin/booking/${id}`;
  const res = await axiosInstance.get(`${path}`);
  return res && res.data ? res.data : null;
};

export const createBooking = async (data) => {
  const path = `/api/admin/booking`;
  const res = await axiosInstance.post(`${path}`, data);
  // console.log("res>>>", res.data);
  return res && res.data ? res.data : null;
};

export const updateBookings = async (id, data) => {
  const path = `/api/admin/booking/${id}`;
  const res = await axiosInstance.put(`${path}`, data);
  return res && res.data ? res.data : null;
};

export const deleteBookings = async (id) => {
  const path = `/api/admin/booking/${id}`;
  const res = await axiosInstance.delete(`${path}`);
  return res && res.data ? res.data : null;
};