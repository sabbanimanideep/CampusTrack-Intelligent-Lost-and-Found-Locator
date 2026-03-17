// src/Services/profileService.js
// All API calls used in src/pages/Student/Profile.jsx

import axiosInstance from "./axiosinstance";

// ─────────────────────────────────────────
// PROFILE
// ─────────────────────────────────────────

// GET /api/users/profile
export const getProfile = async () => {
  const { data } = await axiosInstance.get("/api/users/profile");
  return data;
};

// PUT /api/users/update-profile
export const updateProfile = async (profileData) => {
  const { data } = await axiosInstance.put("/api/users/update-profile", profileData);
  return data;
};

// POST /api/users/upload-avatar  (multipart)
export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);
  const { data } = await axiosInstance.post("/api/users/upload-avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data; // expects { avatarUrl: "..." }
};

// ─────────────────────────────────────────
// PASSWORD
// ─────────────────────────────────────────

// PUT /api/users/change-password
export const changePassword = async (passwordData) => {
  // passwordData = { currentPassword, newPassword, confirmPassword }
  const { data } = await axiosInstance.put("/api/users/change-password", passwordData);
  return data;
};

// ─────────────────────────────────────────
// MY REPORTS  (lost & found items)
// ─────────────────────────────────────────

// GET /api/items/my-lost
export const getMyLostItems = async () => {
  const { data } = await axiosInstance.get("/api/items/my-lost");
  return data;
};

// GET /api/items/my-found
export const getMyFoundItems = async () => {
  const { data } = await axiosInstance.get("/api/items/my-found");
  return data;
};

// PUT /api/items/:id
export const updateItem = async (itemId, itemData) => {
  const { data } = await axiosInstance.put(`/api/items/${itemId}`, itemData);
  return data;
};

// DELETE /api/items/:id
export const deleteItem = async (itemId) => {
  await axiosInstance.delete(`/api/items/${itemId}`);
};

// ─────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────

// GET /api/notifications
export const getNotifications = async () => {
  const { data } = await axiosInstance.get("/api/notifications");
  return data;
};

// PUT /api/notifications/read-all
export const markAllNotificationsRead = async () => {
  const { data } = await axiosInstance.put("/api/notifications/read-all");
  return data;
};

// PUT /api/notifications/:id/read
export const markNotificationRead = async (id) => {
  const { data } = await axiosInstance.put(`/api/notifications/${id}/read`);
  return data;
};

// ─────────────────────────────────────────
// MY CLAIMS
// ─────────────────────────────────────────

// GET /api/claims/my
export const getMyClaims = async () => {
  const { data } = await axiosInstance.get("/api/claims/my");
  return data;
};