import axios from "axios";

const API_URL = "http://localhost:8089/api/auth";

// ── Login ─────────────────────────────────────────────────────────────────────
export const loginUser = async ({ emailOrRollNo, password }) => {
  const res = await axios.post(`${API_URL}/login`, { emailOrRollNo, password });

  localStorage.setItem("token", res.data.token);
  localStorage.setItem("email", res.data.email);   // IMPORTANT

  return res.data;
};

// ── Register ──────────────────────────────────────────────────────────────────
export const registerUser = async ({ name, email, rollNoOrEmpId, password, role }) => {
  const res = await axios.post(`${API_URL}/register`, { name, email, rollNoOrEmpId, password, role });
  return res.data;
};

// ── Forgot Password: Step 1 — Request OTP ────────────────────────────────────
// Backend: POST /api/auth/forgot-password
export const requestPasswordResetOtp = async ({ email }) => {
  const res = await axios.post(`${API_URL}/forgot-password`, { email });
  return res.data;
};

// ── Forgot Password: Step 2 — Verify OTP ─────────────────────────────────────
// Backend: POST /api/auth/verify-otp
export const verifyPasswordResetOtp = async ({ email, otp }) => {
  const res = await axios.post(`${API_URL}/verify-otp`, { email, otp });
  return res.data;
};

// ── Forgot Password: Step 3 — Reset Password ─────────────────────────────────
// Backend: POST /api/auth/reset-password
export const resetPasswordWithOtp = async ({ email, otp, newPassword }) => {
  const res = await axios.post(`${API_URL}/reset-password`, { email, otp, newPassword });
  return res.data;
};

// ── Helpers ───────────────────────────────────────────────────────────────────
export const storeToken = (token) => localStorage.setItem("token", token);

export const redirectByRole = (role, navigate) => {
  if (role === "ADMIN") navigate("/admin-dashboard");
  else navigate("/student-dashboard");
};