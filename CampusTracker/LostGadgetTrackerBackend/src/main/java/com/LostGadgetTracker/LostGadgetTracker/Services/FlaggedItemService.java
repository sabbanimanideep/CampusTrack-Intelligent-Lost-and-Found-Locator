package com.LostGadgetTracker.LostGadgetTracker.Services;

import com.LostGadgetTracker.LostGadgetTracker.Dto.FlaggedItemResponseDTO;
import com.LostGadgetTracker.LostGadgetTracker.entities.FlaggedItem;
import com.LostGadgetTracker.LostGadgetTracker.repo.FlaggedItemRepository;
import com.LostGadgetTracker.LostGadgetTracker.repo.FoundItemRepository;
import com.LostGadgetTracker.LostGadgetTracker.repo.LostItemRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class FlaggedItemService {

    @Autowired private FlaggedItemRepository flagRepo;
    @Autowired private LostItemRepository    lostRepo;
    @Autowired private FoundItemRepository   foundRepo;

    // ── Student: flag an item ──────────────────────────────────────────────
    public String flagItem(Long itemId, String itemType, String studentEmail, String reason) {

        // Validate item exists
        if ("LOST".equals(itemType)) {
            lostRepo.findById(itemId)
                    .orElseThrow(() -> new RuntimeException("Lost item not found"));
        } else if ("FOUND".equals(itemType)) {
            foundRepo.findById(itemId)
                    .orElseThrow(() -> new RuntimeException("Found item not found"));
        } else {
            throw new RuntimeException("Invalid item type. Use LOST or FOUND.");
        }

        // Prevent duplicate flags from same student
        flagRepo.findByItemIdAndItemTypeAndFlaggedByEmail(itemId, itemType, studentEmail)
                .ifPresent(f -> { throw new RuntimeException("You have already flagged this post."); });

        FlaggedItem flag = FlaggedItem.builder()
                .itemId(itemId)
                .itemType(itemType)
                .flaggedByEmail(studentEmail)
                .reason(reason)
                .build();

        flagRepo.save(flag);
        return "Post flagged successfully.";
    }

    // ── Admin: get all active flagged items grouped by itemId+itemType ─────
    public List<FlaggedItemResponseDTO> getAllFlaggedItems() {

        List<FlaggedItem> activeFlags = flagRepo.findByDismissedFalse();

        // Group by itemId + itemType
        Map<String, List<FlaggedItem>> grouped = activeFlags.stream()
                .collect(Collectors.groupingBy(f -> f.getItemId() + "_" + f.getItemType()));

        List<FlaggedItemResponseDTO> result = new ArrayList<>();

        for (Map.Entry<String, List<FlaggedItem>> entry : grouped.entrySet()) {
            List<FlaggedItem> flags = entry.getValue();
            FlaggedItem       first = flags.get(0);
            Long   itemId   = first.getItemId();
            String itemType = first.getItemType();
            int    count    = flags.size();
            String reason   = first.getReason();

            if ("LOST".equals(itemType)) {
                lostRepo.findById(itemId).ifPresent(item ->
                        result.add(new FlaggedItemResponseDTO(
                                itemId, itemType,
                                item.getItemName(),
                                item.getDescription(),
                                item.getUserEmail(),
                                item.getDateLost() != null ? item.getDateLost().toString() : "",
                                count, reason
                        ))
                );
            } else {
                foundRepo.findById(itemId).ifPresent(item ->
                        result.add(new FlaggedItemResponseDTO(
                                itemId, itemType,
                                item.getItemName(),
                                item.getDescription(),
                                item.getReporterEmail(),
                                item.getDateFound() != null ? item.getDateFound().toString() : "",
                                count, reason
                        ))
                );
            }
        }

        // Sort by flagCount descending
        result.sort((a, b) -> b.getFlagCount() - a.getFlagCount());
        return result;
    }

    // ── Admin: dismiss all flags for an item (keep the post) ──────────────
    public String dismissFlags(Long itemId, String itemType) {
        List<FlaggedItem> flags = flagRepo.findByItemIdAndItemType(itemId, itemType);
        if (flags.isEmpty()) throw new RuntimeException("No flags found for this item.");
        flags.forEach(f -> f.setDismissed(true));
        flagRepo.saveAll(flags);
        return "Flags dismissed.";
    }

    // ── Admin: remove post + delete all its flags ──────────────────────────
    public String removePost(Long itemId, String itemType) {
        // Delete all flags first
        List<FlaggedItem> flags = flagRepo.findByItemIdAndItemType(itemId, itemType);
        flagRepo.deleteAll(flags);

        // Delete the actual item
        if ("LOST".equals(itemType)) {
            lostRepo.deleteById(itemId);
        } else {
            foundRepo.deleteById(itemId);
        }
        return "Post removed successfully.";
    }
}