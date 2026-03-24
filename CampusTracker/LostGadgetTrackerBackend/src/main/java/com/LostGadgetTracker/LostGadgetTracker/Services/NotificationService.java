package com.LostGadgetTracker.LostGadgetTracker.Services;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

import com.LostGadgetTracker.LostGadgetTracker.Dto.NotificationDTO;
import com.LostGadgetTracker.LostGadgetTracker.entities.*;
import com.LostGadgetTracker.LostGadgetTracker.repo.*;

@Service
public class NotificationService {

    @Autowired
    private LostItemRepository lostRepo;

    @Autowired
    private FoundItemRepository foundRepo;

    public List<NotificationDTO> getNotifications(String email) {

        List<NotificationDTO> list = new ArrayList<>();

        // 🔴 Lost items
        List<LostItem> lostItems = lostRepo.findByUserEmail(email);

        for (LostItem l : lostItems) {
            list.add(NotificationDTO.builder()
                    .type("LOST")
                    .title(l.getItemName())
                    .location(l.getLastSeenLocation())
                    .date(String.valueOf(l.getDateLost()))
                    .build());
        }

        // 🟢 Found items
        List<FoundItem> foundItems = foundRepo.findByReporterEmail(email);

        for (FoundItem f : foundItems) {
            list.add(NotificationDTO.builder()
                    .type("FOUND")
                    .title(f.getItemName())
                    .location(f.getFoundLocation())
                    .date(String.valueOf(f.getDateFound()))
                    .build());
        }

        // 🔥 Sort by date (latest first)
        list.sort((a, b) -> b.getDate().compareTo(a.getDate()));

        return list;
    }
}