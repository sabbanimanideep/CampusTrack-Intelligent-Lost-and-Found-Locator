import axios from "./axiosinstance";

const API = "/api/found-items";

// Fetch all items
export const getAllFoundItems = async () => {
  const res = await axios.get(`${API}/all`);

  // Normalize each item so the component always reads consistent field names
  return (res.data || []).map((item) => ({
    ...item,
    // Backend may return foundLocation / locationFound / place — normalize to "location"
    location:
      item.location ||
      item.foundLocation ||
      item.locationFound ||
      item.place ||
      null,
  }));
};

// Fetch image URL from DB (backend endpoint)
export const getFoundItemImage = (id) => {
  return `http://localhost:8089/api/found-items/${id}`;
};

// Claim a found item by ID
export const claimFoundItem = async (id) => {
  const res = await axios.patch(`${API}/${id}/claim`);
  return res.data;
};