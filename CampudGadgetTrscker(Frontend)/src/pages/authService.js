import axios from "axios";

const API_URL = "http://localhost:8089/api/auth";

export const loginUser = async ({ emailOrRollNo, password }) => {
  const res = await axios.post(`${API_URL}/login`, { emailOrRollNo, password });
  return res.data;
};

export const registerUser = async ({ name, email, rollNoOrEmpId, password, role }) => {
  const res = await axios.post(`${API_URL}/register`, { name, email, rollNoOrEmpId, password, role });
  return res.data;
};

export const storeToken = (token) => localStorage.setItem("token", token);

export const redirectByRole = (role, navigate) => {
  if (role === "STAFF") navigate("/staff-dashboard");
  else navigate("/student-dashboard");
};