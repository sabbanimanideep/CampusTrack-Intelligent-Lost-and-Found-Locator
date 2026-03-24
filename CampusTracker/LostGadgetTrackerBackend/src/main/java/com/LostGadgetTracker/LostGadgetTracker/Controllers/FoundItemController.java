package com.LostGadgetTracker.LostGadgetTracker.Controllers;



import com.LostGadgetTracker.LostGadgetTracker.entities.FoundItem;
import com.LostGadgetTracker.LostGadgetTracker.Services.FoundItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
@RestController
@RequestMapping("/api/found-items")
@CrossOrigin("*")
public class FoundItemController {

    @Autowired
    private FoundItemService service;

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
    @GetMapping("/all")
    public ResponseEntity<List<FoundItem>> getAllFoundItems() {
        return ResponseEntity.ok(service.getAllItems());
    }

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
}
