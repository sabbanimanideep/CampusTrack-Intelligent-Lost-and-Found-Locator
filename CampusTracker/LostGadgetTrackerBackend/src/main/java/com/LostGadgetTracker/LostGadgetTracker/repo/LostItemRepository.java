package com.LostGadgetTracker.LostGadgetTracker.repo;


import com.LostGadgetTracker.LostGadgetTracker.entities.LostItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.security.core.userdetails.User;


import java.util.List;

@Repository
public interface LostItemRepository extends JpaRepository<LostItem, Long> {

    List<LostItem> findByCategory(LostItem.Category category);

    @Query("SELECT l FROM LostItem l WHERE " +
            "(:category IS NULL OR l.category = :category) AND " +
            "(:search IS NULL OR " +
            " LOWER(l.name) LIKE LOWER(CONCAT('%',:search,'%')) OR " +
            " LOWER(l.description) LIKE LOWER(CONCAT('%',:search,'%')) OR " +
            " LOWER(l.location) LIKE LOWER(CONCAT('%',:search,'%')))")
    List<LostItem> searchItems(
            @Param("category") LostItem.Category category,
            @Param("search") String search
    );
    List<LostItem> findByReportedBy(User user);

    long countByReportedBy(User user);

    List<LostItem> findByReportedBy(com.LostGadgetTracker.LostGadgetTracker.entities.User user);

    long countByReportedBy(com.LostGadgetTracker.LostGadgetTracker.entities.User user);
}
