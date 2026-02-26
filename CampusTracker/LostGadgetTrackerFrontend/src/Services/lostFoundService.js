import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8089/api",
  timeout: 10000,
});

// ── Request interceptor: attach JWT token ──────────────────────────────────
API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 globally ─────────────────────────────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ── Lost Items ─────────────────────────────────────────────────────────────
export const reportLostItem = (data) =>
  API.post("/lost", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const fetchLostItems = (params = {}) =>
  API.get("/lost", { params });

export const fetchLostItemById = (id) => API.get(`/lost/${id}`);

export const deleteLostItem = (id) => API.delete(`/lost/${id}`);

export const updateLostItem = (id, data) =>
  API.put(`/lost/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ── Found Items ────────────────────────────────────────────────────────────
export const reportFoundItem = (data) =>
  API.post("/found", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const fetchFoundItems = (params = {}) =>
  API.get("/found", { params });

export const fetchFoundItemById = (id) => API.get(`/found/${id}`);

export const deleteFoundItem = (id) => API.delete(`/found/${id}`);

export const updateFoundItem = (id, data) =>
  API.put(`/found/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ── Match / Claim ──────────────────────────────────────────────────────────
export const claimFoundItem = (id) => API.post(`/found/${id}/claim`);

export const matchItems = (lostItemId) =>
  API.get(`/lost/${id}/matches`);

// ── My Reports (authenticated) ─────────────────────────────────────────────
export const fetchMyLostReports = () => API.get("/lost/my");
export const fetchMyFoundReports = () => API.get("/found/my");

export default API;