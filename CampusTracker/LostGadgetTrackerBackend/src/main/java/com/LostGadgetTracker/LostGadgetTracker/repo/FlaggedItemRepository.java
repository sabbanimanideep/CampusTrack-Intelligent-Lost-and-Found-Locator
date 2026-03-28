package com.LostGadgetTracker.LostGadgetTracker.repo;

import com.LostGadgetTracker.LostGadgetTracker.entities.FlaggedItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FlaggedItemRepository extends JpaRepository<FlaggedItem, Long> {

    // All active (non-dismissed) flags
    List<FlaggedItem> findByDismissedFalse();

    // All flags for a specific item+type (to count them)
    List<FlaggedItem> findByItemIdAndItemTypeAndDismissedFalse(Long itemId, String itemType);

    // Check if a student already flagged this item
    Optional<FlaggedItem> findByItemIdAndItemTypeAndFlaggedByEmail(Long itemId, String itemType, String flaggedByEmail);

    // Dismiss all flags for an item (when admin dismisses)
    List<FlaggedItem> findByItemIdAndItemType(Long itemId, String itemType);
}