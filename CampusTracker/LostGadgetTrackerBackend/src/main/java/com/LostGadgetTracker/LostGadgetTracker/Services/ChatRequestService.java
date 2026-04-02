package com.LostGadgetTracker.LostGadgetTracker.Services;

import com.LostGadgetTracker.LostGadgetTracker.entities.ChatRequest;
import com.LostGadgetTracker.LostGadgetTracker.repo.ChatRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;

@Service
public class ChatRequestService {

    @Autowired
    private ChatRequestRepository repo;

    // Send request when "Chat" clicked
    public ChatRequest sendRequest(String sender, String receiver, Long itemId) {

        Optional<ChatRequest> existing =
                repo.findBySenderAndReceiverAndItemId(sender, receiver, itemId);

        if (existing.isPresent()) {
            return existing.get(); // prevent duplicate
        }

        ChatRequest request = new ChatRequest();
        request.setSender(sender);
        request.setReceiver(receiver);
        request.setItemId(itemId);
        request.setStatus(ChatRequest.Status.PENDING);

        return repo.save(request);
    }

    // Accept request
    public ChatRequest acceptRequest(Long requestId) {
        ChatRequest req = repo.findById(requestId).orElseThrow();
        req.setStatus(ChatRequest.Status.ACCEPTED);
        return repo.save(req);
    }

    // Reject request
    public ChatRequest rejectRequest(Long requestId) {
        ChatRequest req = repo.findById(requestId).orElseThrow();
        req.setStatus(ChatRequest.Status.REJECTED);
        return repo.save(req);
    }

    // Get pending requests for a user
    public List<ChatRequest> getPendingRequests(String receiver) {
        return repo.findByReceiverAndStatus(receiver, ChatRequest.Status.PENDING);
    }
}
