package com.LostGadgetTracker.LostGadgetTracker.repo;

import com.LostGadgetTracker.LostGadgetTracker.entities.ChatRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRequestRepository extends JpaRepository<ChatRequest, Long> {

    List<ChatRequest> findByReceiverAndStatus(String receiver, ChatRequest.Status status);

    Optional<ChatRequest> findBySenderAndReceiverAndItemId(
            String sender, String receiver, Long itemId
    );
}