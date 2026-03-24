import axios from "../Services/axiosinstance";

const API = "/api/found-items";

export const reportFoundItem = async (data) => {
  const formData = new FormData();

  formData.append("itemName", data.itemName);
  formData.append("category", data.category);
  formData.append("description", data.description);

  // 🔥 FIX: convert date to yyyy-MM-dd
  const formattedDate = new Date(data.dateFound)
    .toISOString()
    .split("T")[0];

  formData.append("dateFound", formattedDate);
  formData.append("foundLocation", data.foundLocation);

  if (data.contactNumber) {
    formData.append("contactNumber", data.contactNumber);
  }

  formData.append("reporterEmail", data.reporterEmail);

  if (data.file) {
    formData.append("image", data.file);
  } else {
    throw new Error("Image is required");
  }

  // Debug
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  const res = await axios.post(`${API}/report`, formData);

  return res.data;
};

export const getFoundItemImage = (id) =>
  `${API}/${id}`;

export const getAllFoundItems = async () => {
  const res = await axios.get("/api/found-items/all");
  return res.data;
};