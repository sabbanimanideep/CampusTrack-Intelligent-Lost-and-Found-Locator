import axios from "axios";

const API_URL = "http://localhost:8089/api";

// ── Helpers ───────────────────────────────────────────────────────────────────
const authHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ── Lost Items ────────────────────────────────────────────────────────────────
export const reportLostItem = async (formData) => {
  const res = await axios.post(`${API_URL}/lost-items`, formData, authHeaders());
  return res.data;
};

export const fetchLostItems = async (params = {}) => {
  const res = await axios.get(`${API_URL}/lost-items`, { ...authHeaders(), params });
  return res.data;
};

export const fetchLostItemById = async (id) => {
  const res = await axios.get(`${API_URL}/lost-items/${id}`, authHeaders());
  return res.data;
};

export const updateLostItemStatus = async (id, status) => {
  const res = await axios.patch(`${API_URL}/lost-items/${id}/status`, { status }, authHeaders());
  return res.data;
};

export const deleteLostItem = async (id) => {
  const res = await axios.delete(`${API_URL}/lost-items/${id}`, authHeaders());
  return res.data;
};

// ── Found Items ───────────────────────────────────────────────────────────────
export const reportFoundItem = async (formData) => {
  const res = await axios.post(`${API_URL}/found-items`, formData, {
    ...authHeaders(),
    headers: {
      ...authHeaders().headers,
      "Content-Type": "multipart/form-data"
    }
  });

  return res.data;
};

export const fetchFoundItems = async (params = {}) => {
  const res = await axios.get(`${API_URL}/found-items`, { ...authHeaders(), params });
  return res.data;
};

export const fetchFoundItemById = async (id) => {
  const res = await axios.get(`${API_URL}/found-items/${id}`, authHeaders());
  return res.data;
};

export const updateFoundItem = async (id, formData) => {
  const res = await axios.put(`${API_URL}/found-items/${id}`, formData, authHeaders());
  return res.data;
};

export const deleteFoundItem = async (id) => {
  const res = await axios.delete(`${API_URL}/found-items/${id}`, authHeaders());
  return res.data;
};

// ── Match / Claim ─────────────────────────────────────────────────────────────
// FIX #3: Was POST /found-items/:id/claim — no such endpoint exists in FoundItemController.
// Controller only has PATCH /found-items/:id/status, corrected accordingly.
export const claimFoundItem = async (id) => {
  const res = await axios.patch(
    `${API_URL}/found-items/${id}/status`,
    { status: "CLAIMED" },
    authHeaders()
  );
  return res.data;
};

export const matchItems = async (lostItemId) => {
  const res = await axios.get(`${API_URL}/lost-items/${lostItemId}/matches`, authHeaders());
  return res.data;
};

// ── My Reports ────────────────────────────────────────────────────────────────
export const fetchMyLostReports = async () => {
  const res = await axios.get(`${API_URL}/lost-items/my`, authHeaders());
  return res.data;
};

export const fetchMyFoundReports = async () => {
  const res = await axios.get(`${API_URL}/found-items/my`, authHeaders());
  return res.data;
};