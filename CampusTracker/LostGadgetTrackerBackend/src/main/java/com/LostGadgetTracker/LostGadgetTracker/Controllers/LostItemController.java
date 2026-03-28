package com.LostGadgetTracker.LostGadgetTracker.Controllers;

import com.LostGadgetTracker.LostGadgetTracker.entities.LostItem;
import com.LostGadgetTracker.LostGadgetTracker.Services.LostItemService;
import com.LostGadgetTracker.LostGadgetTracker.Dto.LostItemResponseDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lost-items")
@CrossOrigin("*")
public class LostItemController {

    @Autowired
    private LostItemService service;

    // ================= USER APIs =================

    // 🔹 Report lost item — saved as PENDING, not visible to public yet
    @PostMapping("/report")
    public ResponseEntity<?> reportLostItem(
            @RequestParam String itemName,
            @RequestParam String category,
            @RequestParam String description,
            @RequestParam String dateLost,
            @RequestParam String lastSeenLocation,
            @RequestParam(required = false) String contactNumber,
            @RequestParam(required = false) String reward,
            @RequestParam String userEmail,
            @RequestParam MultipartFile image
    ) {
        try {
            Double rewardValue = (reward != null && !reward.isEmpty())
                    ? Double.parseDouble(reward)
                    : null;

            LostItem item = LostItem.builder()
                    .itemName(itemName)
                    .category(category)
                    .description(description)
                    .dateLost(LocalDate.parse(dateLost))
                    .lastSeenLocation(lastSeenLocation)
                    .contactNumber(contactNumber)
                    .reward(rewardValue)
                    .userEmail(userEmail)
                    .image(image.getBytes())
                    .build();

            return ResponseEntity.ok(service.save(item));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 🔹 Get image
    @GetMapping("/image/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable Long id) {
        LostItem item = service.getById(id);

        if (item == null || item.getImage() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(item.getImage());
    }

    // 🔹 Public listing — only APPROVED items are visible
    @GetMapping("/all")
    public ResponseEntity<List<LostItem>> getApprovedItems() {
        return ResponseEntity.ok(service.getApprovedItems());
    }

    // ================= ADMIN APIs =================

    // 🔹 Get all posts (ALL statuses — PENDING, APPROVED, REJECTED)
    @GetMapping("/admin/all")
    public ResponseEntity<List<LostItemResponseDTO>> getAll() {
        return ResponseEntity.ok(service.getAllPostsWithUser());
    }

    // 🔹 Approve post — item goes live only here
    @PutMapping("/admin/approve/{id}")
    public ResponseEntity<?> approve(@PathVariable Long id) {
        return ResponseEntity.ok(service.approvePost(id));
    }

    // 🔹 Reject post — marks as REJECTED (not deleted)
    @PutMapping("/admin/reject/{id}")
    public ResponseEntity<?> reject(@PathVariable Long id) {
        return ResponseEntity.ok(service.rejectPost(id));
    }

    // 🔹 Edit post
    @PutMapping("/admin/edit/{id}")
    public ResponseEntity<?> edit(@PathVariable Long id, @RequestBody LostItem item) {
        return ResponseEntity.ok(service.editPost(id, item));
    }

    // 🔹 Delete post
    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.deletePost(id);
        return ResponseEntity.ok("Post deleted successfully");
    }

    // 🔹 Count APIs (dashboard)
    @GetMapping("/admin/count")
    public ResponseEntity<Map<String, Long>> getCounts() {
        Map<String, Long> map = new HashMap<>();
        map.put("total", service.getTotalPosts());
        map.put("approved", service.getApprovedPosts());
        map.put("pending", service.getPendingPosts());
        return ResponseEntity.ok(map);
    }
}