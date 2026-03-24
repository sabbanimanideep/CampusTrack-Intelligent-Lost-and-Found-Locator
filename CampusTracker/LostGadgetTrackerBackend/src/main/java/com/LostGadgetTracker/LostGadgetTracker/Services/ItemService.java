package com.LostGadgetTracker.LostGadgetTracker.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import com.LostGadgetTracker.LostGadgetTracker.entities.*;
import com.LostGadgetTracker.LostGadgetTracker.repo.*;

@Service
public class ItemService {

    @Autowired
    private FoundItemRepository foundRepo;

    @Autowired
    private LostItemRepository lostRepo;

    // ✅ Found Items
    public List<FoundItem> getFoundByEmail(String email) {
        return foundRepo.findByReporterEmail(email);
    }

    // ✅ Lost Items
    public List<LostItem> getLostByEmail(String email) {
        return lostRepo.findByUserEmail(email);
    }
}