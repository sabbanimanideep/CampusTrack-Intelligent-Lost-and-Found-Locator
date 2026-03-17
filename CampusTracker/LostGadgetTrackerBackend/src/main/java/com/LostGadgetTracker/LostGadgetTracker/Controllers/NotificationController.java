package com.LostGadgetTracker.LostGadgetTracker.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.Authentication;

import com.LostGadgetTracker.LostGadgetTracker.entities.Notification;
import com.LostGadgetTracker.LostGadgetTracker.repo.NotificationRepository;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository repo;

    @GetMapping
    public List<Notification> getNotifications(Authentication auth) {

        return repo.findByUserEmail(auth.getName());
    }

    @PutMapping("/read-all")
    public String markAllRead() {

        repo.markAllRead();

        return "All notifications read";
    }
}