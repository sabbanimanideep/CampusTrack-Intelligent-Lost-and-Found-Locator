package com.LostGadgetTracker.LostGadgetTracker.Controllers;

import com.LostGadgetTracker.LostGadgetTracker.Services.ChatRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chat-request")
@CrossOrigin
public class ChatRequestController {

    @Autowired
    private ChatRequestService service;

    // 1️⃣ Send request
    @PostMapping("/send")
    public ResponseEntity<?> sendRequest(
            @RequestParam String sender,
            @RequestParam String receiver,
            @RequestParam Long itemId) {

        return ResponseEntity.ok(
                service.sendRequest(sender, receiver, itemId)
        );
    }

    // 2️⃣ Get pending requests (for item owner)
    @GetMapping("/pending")
    public ResponseEntity<?> getPending(@RequestParam String receiver) {
        return ResponseEntity.ok(
                service.getPendingRequests(receiver)
        );
    }

    // 3️⃣ Accept request
    @PutMapping("/accept/{id}")
    public ResponseEntity<?> accept(@PathVariable Long id) {
        return ResponseEntity.ok(service.acceptRequest(id));
    }

    // 4️⃣ Reject request
    @PutMapping("/reject/{id}")
    public ResponseEntity<?> reject(@PathVariable Long id) {
        return ResponseEntity.ok(service.rejectRequest(id));
    }
}
