package com.LostGadgetTracker.LostGadgetTracker.Controllers;

import com.LostGadgetTracker.LostGadgetTracker.Dto.ItemResponse;
import com.LostGadgetTracker.LostGadgetTracker.Services.LostItemService;
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
@RequestMapping("/api/lost-items")
@RequiredArgsConstructor
public class LostItemController {

    private final LostItemService lostItemService;

    /**
     * GET /api/lost-items?category=&search=
     */
    @GetMapping
    public ResponseEntity<List<ItemResponse>> getAll(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(lostItemService.getAll(category, search));
    }

    /**
     * GET /api/lost-items/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ItemResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(lostItemService.getById(id));
    }

    /**
     * POST /api/lost-items   (multipart/form-data)
     * → ReportLost.jsx calls reportLostItem(formData)
     * Fields: name, description, category, date, location, contact?, reward?, image?
     */
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ItemResponse> create(
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam String category,
            @RequestParam String date,
            @RequestParam String location,
            @RequestParam(required = false) String contact,
            @RequestParam(required = false) Double reward,
            @RequestParam(required = false) MultipartFile image,
            @AuthenticationPrincipal User user) throws IOException {

        return ResponseEntity.status(201)
                .body(lostItemService.create(name, description, category,
                        date, location, contact, reward, image, user));
    }

    /**
     * PATCH /api/lost-items/{id}/status
     * Body: { "status": "MATCHED" | "RESOLVED" }
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ItemResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(lostItemService.updateStatus(id, body.get("status")));
    }

    /**
     * DELETE /api/lost-items/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        lostItemService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
