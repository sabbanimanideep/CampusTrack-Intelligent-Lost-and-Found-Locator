package com.LostGadgetTracker.LostGadgetTracker.Services;

import com.LostGadgetTracker.LostGadgetTracker.entities.LostItem;
import com.LostGadgetTracker.LostGadgetTracker.entities.User;
import com.LostGadgetTracker.LostGadgetTracker.repo.LostItemRepository;
import com.LostGadgetTracker.LostGadgetTracker.repo.UserRepository;
import com.LostGadgetTracker.LostGadgetTracker.Dto.LostItemResponseDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LostItemService {

    @Autowired
    private LostItemRepository repository;

    @Autowired
    private UserRepository userRepository;

    // 🔹 Save new post — stored as PENDING, NOT approved
    public LostItem save(LostItem item) {
        item.setApproved(false);
        item.setStatus("PENDING");
        return repository.save(item);
    }

    // 🔹 Get by ID
    public LostItem getById(Long id) {
        return repository.findById(id).orElse(null);
    }

    // 🔹 Get all posts with user details (Admin only — all statuses)
    public List<LostItemResponseDTO> getAllPostsWithUser() {
        List<LostItem> items = repository.findAll();

        return items.stream().map(item -> {
            User user = userRepository.findByEmail(item.getUserEmail())
                    .orElse(null);
            return new LostItemResponseDTO(item, user);
        }).toList();
    }

    // 🔹 Get only APPROVED posts (Public users)
    public List<LostItem> getApprovedItems() {
        return repository.findByApproved(true);
    }

    // 🔹 Approve post — this is the moment the item goes "live"
    public LostItem approvePost(Long id) {
        LostItem item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // ✅ null-safe: old rows with status=null are treated as PENDING
        String currentStatus = item.getStatus();
        if ("APPROVED".equals(currentStatus) || "REJECTED".equals(currentStatus)) {
            throw new RuntimeException("Post is already " + currentStatus);
        }

        item.setApproved(true);
        item.setStatus("APPROVED");
        return repository.save(item);
    }

    // 🔹 Reject post — marks as REJECTED without deleting
    public LostItem rejectPost(Long id) {
        LostItem item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // ✅ null-safe: allow rejecting null-status (old) rows too
        String currentStatus = item.getStatus();
        if ("APPROVED".equals(currentStatus)) {
            throw new RuntimeException("Cannot reject an already approved post");
        }

        item.setApproved(false);
        item.setStatus("REJECTED");
        return repository.save(item);
    }

    // 🔹 Edit post (Admin)
    public LostItem editPost(Long id, LostItem updatedItem) {
        LostItem item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        item.setItemName(updatedItem.getItemName());
        item.setDescription(updatedItem.getDescription());
        item.setCategory(updatedItem.getCategory());
        item.setLastSeenLocation(updatedItem.getLastSeenLocation());

        return repository.save(item);
    }

    // 🔹 Delete post (Admin)
    public void deletePost(Long id) {
        LostItem item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        repository.delete(item);
    }

    // 🔹 Count methods
    public long getTotalPosts() {
        return repository.count();
    }

    public long getApprovedPosts() {
        return repository.countByApproved(true);
    }

    // ✅ counts both null-status (legacy) and explicit PENDING rows
    public long getPendingPosts() {
        return repository.countByStatusOrStatusIsNull("PENDING");
    }
}