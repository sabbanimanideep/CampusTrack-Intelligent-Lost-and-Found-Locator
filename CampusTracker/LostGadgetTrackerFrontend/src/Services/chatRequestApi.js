// src/api/chatRequestApi.js

import API from "./axiosinstance";


// ✅ 1. Send chat request (when user clicks "Chat")
export const sendChatRequest = (sender, receiver, itemId) => {
  return API.post(
    `/chat-request/send?sender=${sender}&receiver=${receiver}&itemId=${itemId}`
  );
};


// ✅ 2. Get pending requests (for item owner)
export const getPendingRequests = (receiver) => {
  return API.get(`/chat-request/pending?receiver=${receiver}`);
};


// ✅ 3. Accept request
export const acceptChatRequest = (requestId) => {
  return API.put(`/chat-request/accept/${requestId}`);
};


// ✅ 4. Reject request
export const rejectChatRequest = (requestId) => {
  return API.put(`/chat-request/reject/${requestId}`);
};