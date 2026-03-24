import axios from "./axiosInstance";

const API_BASE = "/api/items";

// ✅ Get Found Items — backend filters by reporter_email
export const getFoundItems = async (email) => {
  try {
    const res = await axios.get(`${API_BASE}/found`, {
      params: { email },
    });
    return res.data.map(normalizeFound);
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch found items");
  }
};

// ✅ Get Lost Items — backend filters by user_email
export const getLostItems = async (email) => {
  try {
    const res = await axios.get(`${API_BASE}/lost`, {
      params: { email },
    });
    return res.data.map(normalizeLost);
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch lost items");
  }
};

// ✅ Delete Item
export const deleteItem = async (id, type) => {
  try {
    await axios.delete(`${API_BASE}/${type}/${id}`);
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to delete item");
  }
};

// ✅ Normalize Found — matches found_items DB schema exactly
const normalizeFound = (item) => ({
  id:          item.id,
  name:        item.item_name       || item.itemName,
  category:    item.category,
  location:    item.found_location  || item.foundLocation,
  date:        item.date_found      || item.dateFound,
  contact:     item.contact_number  || item.contactNumber,
  description: item.description,
  email:       item.reporter_email  || item.reporterEmail,
  image:       item.image           || null,
  imageType:   item.image_type      || item.imageType || null,
});

// ✅ Normalize Lost — matches lost_items DB schema exactly
const normalizeLost = (item) => ({
  id:          item.id,
  name:        item.item_name          || item.itemName,
  category:    item.category,
  location:    item.last_seen_location || item.lastSeenLocation,
  date:        item.date_lost          || item.dateLost,
  contact:     item.contact_number     || item.contactNumber,
  reward:      item.reward,
  description: item.description,
  email:       item.user_email         || item.userEmail,
  image:       item.image              || null,
});