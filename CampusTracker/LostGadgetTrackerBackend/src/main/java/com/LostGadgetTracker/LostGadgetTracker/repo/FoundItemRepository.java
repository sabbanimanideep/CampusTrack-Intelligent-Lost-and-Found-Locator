package com.LostGadgetTracker.LostGadgetTracker.repo;



import com.LostGadgetTracker.LostGadgetTracker.entities.FoundItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FoundItemRepository extends JpaRepository<FoundItem, Long> {
    List<FoundItem> findByReporterEmail(String email);
    long countByReporterEmail(String email); // per user
    long count(); // total (optional)
}
