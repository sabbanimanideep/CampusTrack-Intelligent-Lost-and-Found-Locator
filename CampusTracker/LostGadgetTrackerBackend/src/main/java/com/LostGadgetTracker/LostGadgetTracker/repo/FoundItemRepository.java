package com.LostGadgetTracker.LostGadgetTracker.repo;



import com.LostGadgetTracker.LostGadgetTracker.entities.FoundItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.security.core.userdetails.User;


import java.util.List;

@Repository
public interface FoundItemRepository extends JpaRepository<FoundItem, Long> {

    List<FoundItem> findByCategory(FoundItem.Category category);

    @Query("SELECT f FROM FoundItem f WHERE " +
            "(:category IS NULL OR f.category = :category) AND " +
            "(:search IS NULL OR " +
            " LOWER(f.name) LIKE LOWER(CONCAT('%',:search,'%')) OR " +
            " LOWER(f.description) LIKE LOWER(CONCAT('%',:search,'%')) OR " +
            " LOWER(f.location) LIKE LOWER(CONCAT('%',:search,'%')))")
    List<FoundItem> searchItems(
            @Param("category") FoundItem.Category category,
            @Param("search") String search
    );
    List<FoundItem> findByReportedBy(User user);

    long countByReportedBy(User user);

    long countByReportedBy(com.LostGadgetTracker.LostGadgetTracker.entities.User user);

    List<FoundItem> findByReportedBy(com.LostGadgetTracker.LostGadgetTracker.entities.User user);
}
