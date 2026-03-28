import axiosInstance from "./axiosinstance";

const LOST_API  = "/api/lost-items";
const FOUND_API = "/api/found-items";

// ─── LOST ITEMS ───────────────────────────────────────────

// 🔹 Get all lost posts (ADMIN)
export const getAllLostItems = async () => {
  const res = await axiosInstance.get(`${LOST_API}/admin/all`);
  return res.data;
};

// 🔹 Approve lost post
export const approveLostItem = async (id) => {
  const res = await axiosInstance.put(`${LOST_API}/admin/approve/${id}`);
  return res.data;
};

// 🔹 Edit lost post
export const editLostItem = async (id, data) => {
  const res = await axiosInstance.put(`${LOST_API}/admin/edit/${id}`, data);
  return res.data;
};

// 🔹 Delete lost post
export const deleteLostItem = async (id) => {
  const res = await axiosInstance.delete(`${LOST_API}/admin/delete/${id}`);
  return res.data;
};

// 🔹 Get lost counts
export const getLostCounts = async () => {
  const res = await axiosInstance.get(`${LOST_API}/admin/count`);
  return res.data;
};

// ─── FOUND ITEMS ──────────────────────────────────────────

// 🔹 Get all found posts (ADMIN)
export const getAllFoundItems = async () => {
  const res = await axiosInstance.get(`${FOUND_API}/admin/all`);
  return res.data;
};

// 🔹 Approve found post
export const approveFoundItem = async (id) => {
  const res = await axiosInstance.put(`${FOUND_API}/admin/approve/${id}`);
  return res.data;
};

// 🔹 Reject (delete) found post
// Change .delete() → .put()
export const rejectFoundItem = async (id) => {
  const res = await axiosInstance.put(`${FOUND_API}/admin/reject/${id}`);
  return res.data;
};

// 🔹 Get found counts
export const getFoundCounts = async () => {
  const res = await axiosInstance.get(`${FOUND_API}/admin/count`);
  return res.data;
};