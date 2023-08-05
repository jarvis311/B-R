import axiosInstance from "./apiInstance";

export const getSettings = async () => {
  const path = `/api/admin/settings`;
  const res = await axiosInstance.get(`${path}`);
  return res && res.data ? res.data : null;
};

export const getSetting = async (id) => {
  const path = `/api/admin/settings/${id}`;
  const res = await axiosInstance.get(`${path}`);
  return res && res.data ? res.data : null;
};

export const createSetting = async (data) => {
  const path = `/api/admin/settings`;
  const res = await axiosInstance.post(`${path}`, data);
  // console.log("res>>>", res.data);
  return res && res.data ? res.data : null;
};

export const updateSetting = async (id, data) => {
  const path = `/api/admin/settings/${id}`;
  const res = await axiosInstance.put(`${path}`, data);
  return res && res.data ? res.data : null;
};

export const deleteSetting = async (id) => {
  const path = `/api/admin/settings/${id}`;
  const res = await axiosInstance.delete(`${path}`);
  return res && res.data ? res.data : null;
};
export const getEmailSettings = async () => {
  const path = `/api/admin/settings/email`;
  const res = await axiosInstance.get(`${path}`);
  return res && res.data ? res.data : null;
};

export const getEmailSetting = async (id) => {
  const path = `/api/admin/settings/email/${id}`;
  const res = await axiosInstance.get(`${path}`);
  return res && res.data ? res.data : null;
};
export const updateEmailSetting = async (id, data) => {
  const path = `/api/admin/settings/email/${id}`;
  const res = await axiosInstance.put(`${path}`, data);
  return res && res.data ? res.data : null;
};

export const getSocialLinks = async () => {
  const path = `/api/admin/settings/social-links`;
  const res = await axiosInstance.get(`${path}`);
  return res && res.data ? res.data : null;
};

export const createSocialLinks = async (data) => {
  const path = `/api/admin/settings/social-links`;
  const res = await axiosInstance.post(`${path}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res && res.data ? res.data : null;
};

export const updateSocialLinks = async (id, data) => {
  const path = `/api/admin/settings/social-links/${id}`;
  const res = await axiosInstance.post(`${path}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res && res.data ? res.data : null;
};

export const deleteSocialLink = async (id, data) => {
  const path = `/api/admin/settings/social-links/${id}`;
  const res = await axiosInstance.delete(`${path}`, data);
  return res && res.data ? res.data : null;
};