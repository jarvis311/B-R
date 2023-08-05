import React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";

import axios from "axios";

const API_URL = 'http://localhost:5000';
const user = JSON.parse(localStorage.getItem("user"));
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: user?.token,
    "Content-Type": "application/json",
    timeout: 1000,
  },
});
axiosInstance.interceptors.request.use(
  function (config) {
    const user = localStorage.getItem("user");
    if (user) {
      // config.headers["Authorization"] = `${JSON.parse(user).token}`;
      config.headers["Authorization"] = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3RfbmFtZSI6ImFkbWluIiwibGFzdF9uYW1lIjpudWxsLCJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJHFVcnRUT1J6NVRYZGRqNFNVZmpndXVaWXY1M21JT0RTb0VkMEdqay41ZHVQdERKZng1QzVpIiwiYWN0aXZlIjoxLCJwcm9maWxlX2ltZyI6bnVsbCwicm9sZV9pZCI6MSwicmVzZXRfZXhwaXJlX3RpbWUiOm51bGwsInJlc2V0X3Rva2VuIjpudWxsLCJpc19kZWxldGVkIjowLCJkZWxldGVkX2F0IjpudWxsLCJjcmVhdGVkQXQiOiIyMDIzLTAxLTEyVDA4OjMxOjA5LjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDIzLTAxLTEyVDA4OjMxOjA5LjAwMFoiLCJpYXQiOjE2NzM1OTE2MTF9.ncBiD0kSN4QvTQFUhtL6M091Mq96Gg29xd2VNDoO9Z4`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (axios.isCancel(error)) {
      return;
    }

    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 400:
          <Stack sx={{ width: "100%" }} spacing={2}>
            <Alert severity='error'>
              <AlertTitle>Error</AlertTitle>
              {error.response.data.message}
            </Alert>
          </Stack>;

          return error.response.data;
        case 401:
          <Stack sx={{ width: "100%" }} spacing={2}>
              <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              "Your session has been expired. Please login again."
            </Alert>
          </Stack>;
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/";
          return error.response;
        case 403:
          <Stack sx={{ width: "100%" }} spacing={2}>
            <Alert severity='error'>
              <AlertTitle>Error</AlertTitle>
              "You are not authorized to access this page"
            </Alert>
          </Stack>;

          return error.response;
        case 404:
        default:
          <Stack sx={{ width: "100%" }} spacing={2}>
            <Alert severity='error'>
              <AlertTitle>Error</AlertTitle>
              "Something went wrong. Please try again later."
            </Alert>
          </Stack>;

          return error.response;
      }
    } else if (error.request) {
    } else {
      <Stack sx={{ width: "100%" }} spacing={2}>
        <Alert severity='error'>
          <AlertTitle>Error</AlertTitle>
          {error.message}
        </Alert>
      </Stack>;
    }
  }
);

export default axiosInstance;
