import axiosInstance from "./axiosinstance";

const FLAG_API = "/api/flags";

// ── Student ───────────────────────────────────────────────────────────────

// 🔹 Flag a post (student only)
// itemType: "LOST" | "FOUND"


// ── Admin ─────────────────────────────────────────────────────────────────

// 🔹 Flag a post (admin) — uses /report with system values to satisfy NOT NULL DB constraints
export const adminFlagItem = async (itemId, itemType) => {
  const res = await axiosInstance.post(`${FLAG_API}/report`, {
    itemId: String(itemId),
    itemType,
    studentEmail: "admin@system.com",
    reason: "Flagged by admin for review",
  });
  return res.data;
};

// 🔹 Get all flagged items
export const getAllFlaggedItems = async () => {
  const res = await axiosInstance.get(`${FLAG_API}/admin/all`);
  return res.data;
};

// 🔹 Dismiss flags — keeps the post, just clears the flags
export const dismissFlag = async (itemId, itemType) => {
  const res = await axiosInstance.put(
    `${FLAG_API}/admin/dismiss/${itemId}`,
    null,
    { params: { itemType } }
  );
  return res.data;
};

// 🔹 Remove the flagged post entirely
export const removeFlaggedPost = async (itemId, itemType) => {
  const res = await axiosInstance.delete(
    `${FLAG_API}/admin/remove/${itemId}`,
    { params: { itemType } }
  );
  return res.data;
};