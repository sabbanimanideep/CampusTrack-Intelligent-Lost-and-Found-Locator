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

    // 🔹 Save new post (default = not approved)
    public LostItem save(LostItem item) {
        item.setApproved(false);
        return repository.save(item);
    }

    // 🔹 Get by ID
    public LostItem getById(Long id) {
        return repository.findById(id).orElse(null);
    }

    // 🔹 Get all posts with user details
// 🔹 Get all posts with user details
    public List<LostItemResponseDTO> getAllPostsWithUser() {
        List<LostItem> items = repository.findAll();

        return items.stream().map(item -> {
            User user = userRepository.findByEmail(item.getUserEmail())
                    .orElse(null); // null-safe now — DTO handles it

            return new LostItemResponseDTO(item, user);
        }).toList();
    }

    // 🔹 Approve post
    public LostItem approvePost(Long id) {
        LostItem item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        item.setApproved(true);
        return repository.save(item);
    }

    // 🔹 Edit post
    public LostItem editPost(Long id, LostItem updatedItem) {
        LostItem item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        item.setItemName(updatedItem.getItemName());
        item.setDescription(updatedItem.getDescription());
        item.setCategory(updatedItem.getCategory());
        item.setLastSeenLocation(updatedItem.getLastSeenLocation());

        return repository.save(item);
    }

    // 🔹 Delete post
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

    public long getPendingPosts() {
        return repository.countByApproved(false);
    }

}