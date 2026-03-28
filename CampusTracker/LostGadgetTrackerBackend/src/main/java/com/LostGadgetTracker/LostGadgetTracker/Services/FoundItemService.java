package com.LostGadgetTracker.LostGadgetTracker.Services;

import com.LostGadgetTracker.LostGadgetTracker.entities.FoundItem;
import com.LostGadgetTracker.LostGadgetTracker.repo.FoundItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoundItemService {

    @Autowired
    private FoundItemRepository repository;

    // 🔹 Save new report — stored as PENDING, NOT approved
    public FoundItem save(FoundItem item) {
        item.setApproved(false);
        item.setStatus("PENDING");
        return repository.save(item);
    }

    // 🔹 Get by ID
    public FoundItem getById(Long id) {
        return repository.findById(id).orElse(null);
    }

    // 🔹 Get only APPROVED items (Public users)
    public List<FoundItem> getAllItems() {
        return repository.findByApproved(true);
    }

    // 🔹 Get ALL items regardless of status (Admin only)
    public List<FoundItem> getAll() {
        return repository.findAll();
    }

    // 🔹 Approve item — this is the moment the item goes "live"
    public FoundItem approve(Long id) {
        FoundItem item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        // ✅ null-safe: old rows with status=null are treated as PENDING
        String currentStatus = item.getStatus();
        if ("APPROVED".equals(currentStatus) || "REJECTED".equals(currentStatus)) {
            throw new RuntimeException("Item is already " + currentStatus);
        }

        item.setApproved(true);
        item.setStatus("APPROVED");
        return repository.save(item);
    }

    // 🔹 Reject — marks as REJECTED without deleting
    public void reject(Long id) {
        FoundItem item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        // ✅ null-safe: allow rejecting null-status (old) rows too
        String currentStatus = item.getStatus();
        if ("APPROVED".equals(currentStatus)) {
            throw new RuntimeException("Cannot reject an already approved item");
        }

        item.setApproved(false);
        item.setStatus("REJECTED");
        repository.save(item);
    }

    // 🔹 Counts
    public long total() {
        return repository.count();
    }

    public long approved() {
        return repository.countByApproved(true);
    }

    // ✅ counts both null-status (legacy) and explicit PENDING rows
    public long pending() {
        return repository.countByStatusOrStatusIsNull("PENDING");
    }
}