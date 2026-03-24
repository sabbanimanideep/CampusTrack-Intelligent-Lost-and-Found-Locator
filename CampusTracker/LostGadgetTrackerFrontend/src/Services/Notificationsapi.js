import axios from "./axiosInstance";

const NOTIF_BASE = "/api/notifications";

// ── Notifications ─────────────────────────────────────────────────────────────

export const getNotifications = async (email) => {
  try {
    const res = await axios.get(NOTIF_BASE, { params: { email } });
    return res.data.map((n, i) => ({
      id:       i,           // DTO has no id — use index as stable key
      type:     n.type,      // "LOST" / "FOUND"
      title:    n.title,     // item name
      location: n.location,  // place
      date:     n.date,      // date
    }));
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch notifications");
  }
};

export const markAllNotificationsRead = async (email) => {
  try {
    const res = await axios.put(`${NOTIF_BASE}/mark-all-read`, null, { params: { email } });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to mark notifications as read");
  }
};