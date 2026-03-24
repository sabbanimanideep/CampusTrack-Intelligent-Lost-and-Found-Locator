import axios from "./axiosInstance";

const API_BASE = "/api/match";

// ✅ Get matches
export const getMatches = async (email) => {
  try {
    const res = await axios.get(API_BASE, {
      params: { email },
    });

    return res.data.map((item) => ({
      lostId: item.lostId,
      lostName: item.lostItemName,
      foundId: item.foundId,
      foundName: item.foundItemName,
      score: item.score,
    }));
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to fetch matches"
    );
  }
};