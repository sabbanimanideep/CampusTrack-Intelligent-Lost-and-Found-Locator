package com.LostGadgetTracker.LostGadgetTracker.repo;

import com.LostGadgetTracker.LostGadgetTracker.entities.LostItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface LostItemRepository extends JpaRepository<LostItem, Long> {
    List<LostItem> findByUserEmail(String email);
    long countByUserEmail(String email);
    long count();
    List<LostItem> findByApproved(boolean approved);
    long countByApproved(boolean approved);
    long countByApprovedTrue();
    long countByFlaggedTrue();
    long countByDateLostBetween(LocalDate start, LocalDate end);

    // ✅ counts rows where status = "PENDING" OR status IS NULL (legacy rows)
    long countByStatusOrStatusIsNull(String status);
}