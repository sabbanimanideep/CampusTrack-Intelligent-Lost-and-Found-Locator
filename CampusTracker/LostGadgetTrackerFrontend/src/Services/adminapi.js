import axiosInstance from "./axiosinstance";

const API = "/api/lost-items";

// 🔹 Get all posts (ADMIN)
export const getAllLostItems = async () => {
  const res = await axiosInstance.get(`${API}/admin/all`);
  return res.data;
};

// 🔹 Approve post
export const approveLostItem = async (id) => {
  const res = await axiosInstance.put(`${API}/admin/approve/${id}`);
  return res.data;
};

// 🔹 Edit post
export const editLostItem = async (id, data) => {
  const res = await axiosInstance.put(`${API}/admin/edit/${id}`, data);
  return res.data;
};

// 🔹 Get counts
export const getCounts = async () => {
  const res = await axiosInstance.get(`${API}/admin/count`);
  return res.data;
};

// 🔹 Delete post
export const deleteLostItem = async (id) => {
  const res = await axiosInstance.delete(`${API}/admin/delete/${id}`);
  return res.data;
};