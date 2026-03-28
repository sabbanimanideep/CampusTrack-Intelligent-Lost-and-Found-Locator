package com.LostGadgetTracker.LostGadgetTracker.repo;

import com.LostGadgetTracker.LostGadgetTracker.entities.FoundItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface FoundItemRepository extends JpaRepository<FoundItem, Long> {
    List<FoundItem> findByReporterEmail(String email);
    long countByReporterEmail(String email);
    long count();
    List<FoundItem> findByApproved(boolean approved);
    long countByApproved(boolean approved);
    long countByApprovedTrue();
    long countByFlaggedTrue();
    long countByDateFoundBetween(LocalDate start, LocalDate end);

    // ✅ counts rows where status = "PENDING" OR status IS NULL (legacy rows)
    long countByStatusOrStatusIsNull(String status);
}