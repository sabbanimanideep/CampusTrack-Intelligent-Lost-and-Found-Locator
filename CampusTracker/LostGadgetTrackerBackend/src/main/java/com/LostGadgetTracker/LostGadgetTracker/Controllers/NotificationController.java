package com.LostGadgetTracker.LostGadgetTracker.Controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.LostGadgetTracker.LostGadgetTracker.Services.NotificationService;
import com.LostGadgetTracker.LostGadgetTracker.Dto.NotificationDTO;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService service;

    @GetMapping
    public List<NotificationDTO> getNotifications(@RequestParam String email) {
        return service.getNotifications(email);
    }
}
