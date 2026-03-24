package com.LostGadgetTracker.LostGadgetTracker.Controllers;



import com.LostGadgetTracker.LostGadgetTracker.entities.LostItem;
import com.LostGadgetTracker.LostGadgetTracker.Services.LostItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/lost-items")
@CrossOrigin("*")
public class LostItemController {

    @Autowired
    private LostItemService service;

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
                    .dateLost(LocalDate.parse(dateLost)) // yyyy-MM-dd
                    .lastSeenLocation(lastSeenLocation)
                    .contactNumber(contactNumber)
                    .reward(rewardValue)
                    .userEmail(userEmail)
                    .image(image.getBytes())
                    .build();

            return ResponseEntity.ok(service.save(item));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable Long id) {

        LostItem item = service.getById(id);

        if (item == null || item.getImage() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(item.getImage());
    }
}
