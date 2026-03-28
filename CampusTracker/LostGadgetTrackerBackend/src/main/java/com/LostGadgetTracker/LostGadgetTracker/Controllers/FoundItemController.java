package com.LostGadgetTracker.LostGadgetTracker.Controllers;

import com.LostGadgetTracker.LostGadgetTracker.entities.FoundItem;
import com.LostGadgetTracker.LostGadgetTracker.Services.FoundItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/found-items")
@CrossOrigin("*")
public class FoundItemController {

    @Autowired
    private FoundItemService service;

    // 🔹 Report found item — saved as PENDING, not visible to public yet
    @PostMapping("/report")
    public ResponseEntity<?> reportFoundItem(
            @RequestParam String itemName,
            @RequestParam String category,
            @RequestParam String description,
            @RequestParam String dateFound,
            @RequestParam String foundLocation,
            @RequestParam(required = false) String contactNumber,
            @RequestParam String reporterEmail,
            @RequestParam MultipartFile image
    ) {
        try {
            FoundItem item = FoundItem.builder()
                    .itemName(itemName)
                    .category(category)
                    .description(description)
                    .dateFound(LocalDate.parse(dateFound))
                    .foundLocation(foundLocation)
                    .contactNumber(contactNumber)
                    .reporterEmail(reporterEmail)
                    .imageType(image.getContentType())
                    .image(image.getBytes())
                    .build();

            return ResponseEntity.ok(service.save(item));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 🔹 Public listing — only APPROVED items are visible
    @GetMapping("/all")
    public ResponseEntity<List<FoundItem>> getAllFoundItems() {
        return ResponseEntity.ok(service.getAllItems());
    }

    // 🔹 Get image by ID
    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable Long id) {
        FoundItem item = service.getById(id);

        if (item == null || item.getImage() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(item.getImageType()))
                .body(item.getImage());
    }

    // ================= ADMIN APIs =================

    // 🔹 Get all items (ALL statuses — PENDING, APPROVED, REJECTED)
    @GetMapping("/admin/all")
    public ResponseEntity<List<FoundItem>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    // 🔹 Approve — item goes live only here
    @PutMapping("/admin/approve/{id}")
    public ResponseEntity<?> approve(@PathVariable Long id) {
        return ResponseEntity.ok(service.approve(id));
    }

    // ✅ FIXED: Changed from @DeleteMapping to @PutMapping to match frontend PUT call
    @PutMapping("/admin/reject/{id}")
    public ResponseEntity<?> reject(@PathVariable Long id) {
        service.reject(id);
        return ResponseEntity.ok("Rejected successfully");
    }

    // 🔹 Counts
    @GetMapping("/admin/count")
    public ResponseEntity<Map<String, Long>> counts() {
        Map<String, Long> map = new HashMap<>();
        map.put("total", service.total());
        map.put("approved", service.approved());
        map.put("pending", service.pending());
        return ResponseEntity.ok(map);
    }
}