import axiosInstance from "./apiInstance";

export const getCustomers = async () => {
  const path = `/api/customer`;
  const res = await axiosInstance.get(`${path}`);
  return res && res.data ? res.data : null;
};
export const getCustomer = async (id) => {
  const path = `/api/customer/${id}`;
  const res = await axiosInstance.get(`${path}`);
  return res && res.data ? res.data : null;
};

export const addCustomer = async (data) => {
  const path = `/api/customer`;
  const res = await axiosInstance.post(`${path}`, data);
  return res && res.data ? res.data : null;
};

export const updateCustomer = async (id, data) => {
  const path = `/api/customer/${id}`;
  const res = await axiosInstance.put(`${path}`, data);
  return res && res.data ? res.data : null;
};
export const updateBlockCustomer = async ({ id: id, data: data }) => {

  const path = `/api/customer/block-customer/${id}`;
  const res = await axiosInstance.put(`${path}`, data);
  console.log("res", res);
  return res && res.data ? res.data : null;
};

export const deleteCustomer = async (id) => {
  const path = `/api/customer/${id}`;
  const res = await axiosInstance.delete(`${path}`);
  return res && res.data ? res.data : null;
};
