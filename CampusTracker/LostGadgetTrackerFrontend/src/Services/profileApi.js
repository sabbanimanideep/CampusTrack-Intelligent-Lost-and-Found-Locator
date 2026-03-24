import axios from "./axiosInstance";

const API_BASE = "/api/users";

// ✅ Get Profile
export const getProfile = async (email) => {
  try {
    const res = await axios.get(`${API_BASE}/profile`, {
      params: { email },
    });
    return normalizeUser(res.data);
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch profile");
  }
};

// ✅ Update Profile
export const updateProfile = async (data) => {
  try {
    const res = await axios.put(`${API_BASE}/update`, data);
    return normalizeUser(res.data);
  } catch (err) {
    throw new Error(err.response?.data?.message || "Update failed");
  }
};

// ✅ FIX 3: uploadAvatar was used in EditProfileModal but missing from this file
export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await axios.post(`${API_BASE}/upload-avatar`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data; // expects { avatarUrl: "..." } from backend
  } catch (err) {
    throw new Error(err.response?.data?.message || "Avatar upload failed");
  }
};

// ✅ Normalize response
const normalizeUser = (data) => {
  return {
    id:         data.id,
    name:       data.name,
    email:      data.email,
    role:       data.role,
    rollNumber: data.rollNoOrEmpId,
    status:     data.enabled ? "ACTIVE" : "DISABLED",
    phone:      data.phone      || "",
    department: data.department || "",
    avatarUrl:  data.avatarUrl  || "",
  };
};