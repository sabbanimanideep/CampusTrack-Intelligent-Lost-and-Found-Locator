package com.LostGadgetTracker.LostGadgetTracker.repo;



import com.LostGadgetTracker.LostGadgetTracker.entities.LostItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LostItemRepository extends JpaRepository<LostItem, Long> {
    List<LostItem> findByUserEmail(String email);
    long countByUserEmail(String email); // per user
    long count(); // total (optional)
    List<LostItem> findByApproved(boolean approved);
    long countByApproved(boolean approved);
}
