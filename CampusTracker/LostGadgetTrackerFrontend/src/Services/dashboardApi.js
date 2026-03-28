import api from "./axiosinstance"; // or your existing axios instance path

// 📊 Get Dashboard Overview
export const getOverviewCounts = async () => {
  try {
    const response = await api.get("/admin/dashboard/overview");
    return response.data;
  } catch (error) {
    console.error("Dashboard Overview API Error:", error);
    throw error;
  }
};