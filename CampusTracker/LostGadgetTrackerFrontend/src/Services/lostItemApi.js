import axios from "../Services/axiosinstance";

const API = "/api/lost-items";

export const reportLostItem = async (data) => {
  const formData = new FormData();

  formData.append("itemName", data.itemName);
  formData.append("category", data.category);
  formData.append("description", data.description);

  // ✅ convert date
  const formattedDate = new Date(data.dateLost)
    .toISOString()
    .split("T")[0];

  formData.append("dateLost", formattedDate);
  formData.append("lastSeenLocation", data.lastSeenLocation);

  if (data.contactNumber) {
    formData.append("contactNumber", data.contactNumber);
  }

  if (data.reward) {
    formData.append("reward", data.reward);
  }

  formData.append("userEmail", data.userEmail);

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

export const getLostItemImage = (id) =>
  `${API}/${id}`;