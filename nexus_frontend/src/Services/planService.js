import axiosInstance from "./apiInstance";

export const getPlans = async () => {
  const path = `/api/admin/plan`;
  const res = await axiosInstance.get(`${path}`);
  return res && res.data ? res.data : null;
};

export const getPlan = async (id) => {
  const path = `/api/admin/plan/${id}`;
  const res = await axiosInstance.get(`${path}`);
  return res && res.data ? res.data : null;
};

export const createPlan = async (data) => {
  const path = `/api/admin/plan`;
  const res = await axiosInstance.post(`${path}`, data);
  // console.log("res>>>", res.data);
  return res && res.data ? res.data : null;
};

export const updatePlan = async (id, data) => {
  const path = `/api/admin/plan/${id}`;
  const res = await axiosInstance.put(`${path}`, data);
  return res && res.data ? res.data : null;
};

export const deletePlan = async (id) => {
  const path = `/api/admin/plan/${id}`;
  const res = await axiosInstance.delete(`${path}`);
  return res && res.data ? res.data : null;
};

export const checkRemainingCredits = async (data) => {
  const path = `/api/admin/plan/plan-option`;
  const res = await axiosInstance.post(`${path}`, data);
  return res && res.data ? res.data : null;
};
