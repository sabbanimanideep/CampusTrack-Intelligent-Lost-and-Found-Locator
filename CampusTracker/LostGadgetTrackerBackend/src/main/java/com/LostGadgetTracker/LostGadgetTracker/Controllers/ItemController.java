package com.LostGadgetTracker.LostGadgetTracker.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.LostGadgetTracker.LostGadgetTracker.entities.*;
import com.LostGadgetTracker.LostGadgetTracker.Services.ItemService;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*")
public class ItemController {

    @Autowired
    private ItemService service;

    // ✅ Get Found Items by user
    @GetMapping("/found")
    public List<FoundItem> getFound(@RequestParam String email) {
        return service.getFoundByEmail(email);
    }

    // ✅ Get Lost Items by user
    @GetMapping("/lost")
    public List<LostItem> getLost(@RequestParam String email) {
        return service.getLostByEmail(email);
    }
}
