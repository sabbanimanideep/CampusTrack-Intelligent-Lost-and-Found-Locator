package com.LostGadgetTracker.LostGadgetTracker.Controllers;



import com.LostGadgetTracker.LostGadgetTracker.Dto.ItemResponse;
import com.LostGadgetTracker.LostGadgetTracker.Services.FoundItemService;
import com.LostGadgetTracker.LostGadgetTracker.entities.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/found-items")
@RequiredArgsConstructor
public class FoundItemController {

    private final FoundItemService foundItemService;

    /**
     * GET /api/found-items?category=&search=
     * → BrowseItems.jsx calls fetchFoundItems()
     * Public — no auth required
     */
    @GetMapping
    public ResponseEntity<List<ItemResponse>> getAll(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(foundItemService.getAll(category, search));
    }

    /**
     * GET /api/found-items/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ItemResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(foundItemService.getById(id));
    }

    /**
     * POST /api/found-items   (multipart/form-data)
     * → ReportFound.jsx calls reportFoundItem(formData)
     * Fields: name, description, category, foundDate, location, contact?, image?
     */
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ItemResponse> create(
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam String category,
            @RequestParam String foundDate,
            @RequestParam String location,
            @RequestParam(required = false) String contact,
            @RequestParam(required = false) MultipartFile image,
            @AuthenticationPrincipal User user) throws IOException {

        return ResponseEntity.status(201)
                .body(foundItemService.create(name, description, category,
                        foundDate, location, contact, image, user));
    }

    /**
     * PATCH /api/found-items/{id}/status
     * → BrowseItems.jsx "This is mine" button calls claimFoundItem(id)
     * Body: { "status": "CLAIMED" }
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ItemResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(foundItemService.updateStatus(id, body.get("status")));
    }

    /**
     * DELETE /api/found-items/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        foundItemService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
