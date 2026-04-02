// src/Services/axiosInstance.js
// Central Axios instance for CampusTracker
// All API calls go through here for JWT auth and error handling

import axios from "axios";


const axiosInstance = axios.create({
  baseURL: "http://localhost:8089"
});

axiosInstance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

// Handle global errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong.";

    return Promise.reject(new Error(message));
  }
);

// Send chat request
export const sendChatRequest = (sender, receiver, itemId) =>
  API.post(`/chat-request/send?sender=${sender}&receiver=${receiver}&itemId=${itemId}`);

// Get pending requests
export const getPendingRequests = (receiver) =>
  API.get(`/chat-request/pending?receiver=${receiver}`);

// Accept
export const acceptRequest = (id) =>
  API.put(`/chat-request/accept/${id}`);

// Reject
export const rejectRequest = (id) =>
  API.put(`/chat-request/reject/${id}`);


export default axiosInstance;