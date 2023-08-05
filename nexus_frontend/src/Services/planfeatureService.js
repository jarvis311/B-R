import axiosInstance from "./apiInstance";

export const getPlanfeatures = async () => {
  const path = `/api/admin/planfeature`;
  const res = await axiosInstance.get(`${path}`);
  return res && res.data ? res.data : null;
};

export const getPlanfeature = async (id) => {
  const path = `/api/admin/planfeature/${id}`;
  const res = await axiosInstance.get(`${path}`);
  return res && res.data ? res.data : null;
};

export const createPlanfeature = async (data) => {
  const path = `/api/admin/planfeature`;
  const res = await axiosInstance.post(`${path}`, data);
  // console.log("res>>>", res.data);
  return res && res.data ? res.data : null;
};

export const updatePlanfeature = async (id, data) => {
  const path = `/api/admin/planfeature/${id}`;
  const res = await axiosInstance.put(`${path}`, data);
  return res && res.data ? res.data : null;
};

export const deletePlanfeature = async (id) => {
  const path = `/api/admin/planfeature/${id}`;
  const res = await axiosInstance.delete(`${path}`);
  return res && res.data ? res.data : null;
};
