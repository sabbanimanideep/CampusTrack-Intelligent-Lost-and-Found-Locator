package com.LostGadgetTracker.LostGadgetTracker.Controllers;

import com.LostGadgetTracker.LostGadgetTracker.Dto.FlaggedItemResponseDTO;
import com.LostGadgetTracker.LostGadgetTracker.Services.FlaggedItemService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/flags")
@CrossOrigin("*")
public class FlaggedItemController {

    @Autowired
    private FlaggedItemService service;

    // ── Student: flag a post ───────────────────────────────────────────────
    // POST /api/flags/report
    // Body: { itemId, itemType, studentEmail, reason }
    @PostMapping("/report")
    public ResponseEntity<?> flagItem(@RequestBody Map<String, String> body) {
        try {
            Long   itemId       = Long.parseLong(body.get("itemId"));
            String itemType     = body.get("itemType");     // "LOST" or "FOUND"
            String studentEmail = body.get("studentEmail");
            String reason       = body.get("reason");

            String msg = service.flagItem(itemId, itemType, studentEmail, reason);
            return ResponseEntity.ok(Map.of("message", msg));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ── Admin: get all flagged items ───────────────────────────────────────
    // GET /api/flags/admin/all
    @GetMapping("/admin/all")
    public ResponseEntity<List<FlaggedItemResponseDTO>> getAllFlagged() {
        return ResponseEntity.ok(service.getAllFlaggedItems());
    }

    // ── Admin: dismiss flags (keep post) ──────────────────────────────────
    // PUT /api/flags/admin/dismiss/{itemId}?itemType=LOST
    @PutMapping("/admin/dismiss/{itemId}")
    public ResponseEntity<?> dismissFlags(
            @PathVariable Long itemId,
            @RequestParam String itemType) {
        try {
            return ResponseEntity.ok(Map.of("message", service.dismissFlags(itemId, itemType)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ── Admin: remove flagged post entirely ───────────────────────────────
    // DELETE /api/flags/admin/remove/{itemId}?itemType=LOST
    @DeleteMapping("/admin/remove/{itemId}")
    public ResponseEntity<?> removePost(
            @PathVariable Long itemId,
            @RequestParam String itemType) {
        try {
            return ResponseEntity.ok(Map.of("message", service.removePost(itemId, itemType)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
