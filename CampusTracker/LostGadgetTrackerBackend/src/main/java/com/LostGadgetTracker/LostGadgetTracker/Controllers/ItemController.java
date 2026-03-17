package com.LostGadgetTracker.LostGadgetTracker.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.LostGadgetTracker.LostGadgetTracker.entities.FoundItem;
import com.LostGadgetTracker.LostGadgetTracker.entities.LostItem;
import com.LostGadgetTracker.LostGadgetTracker.entities.User;
import com.LostGadgetTracker.LostGadgetTracker.repo.FoundItemRepository;
import com.LostGadgetTracker.LostGadgetTracker.repo.LostItemRepository;
import com.LostGadgetTracker.LostGadgetTracker.repo.UserRepository;


@RestController
@RequestMapping("/api/items")
public class ItemController {

    @Autowired
    private LostItemRepository lostRepo;

    @Autowired
    private FoundItemRepository foundRepo;

    @Autowired
    private UserRepository userRepo;

    @GetMapping("/my-lost")
    public List<LostItem> myLost(Authentication auth) {

        User user = userRepo.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return lostRepo.findByReportedBy(user);
    }

    @GetMapping("/my-found")
    public List<FoundItem> myFound(Authentication auth) {

        User user = userRepo.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return foundRepo.findByReportedBy(user);
    }
}