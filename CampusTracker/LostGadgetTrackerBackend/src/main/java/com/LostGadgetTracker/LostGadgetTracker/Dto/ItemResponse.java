package com.LostGadgetTracker.LostGadgetTracker.Dto;

import com.LostGadgetTracker.LostGadgetTracker.entities.FoundItem;
import com.LostGadgetTracker.LostGadgetTracker.entities.LostItem;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Base64;

@Data
public class ItemResponse {

    private Long id;
    private String name;
    private String description;
    private String category;
    private LocalDate date;
    private String location;
    private String contact;
    private Double reward;
    private String status;
    private LocalDateTime createdAt;

    // ── Image returned as a Base64 data URL ──────────────────────
    // Frontend uses directly:  <img src={item.imageUrl} />
    private String imageUrl;
    // ─────────────────────────────────────────────────────────────

    // ── Static factory for LostItem ──────────────────────────────
    public static ItemResponse from(LostItem item) {
        ItemResponse r = new ItemResponse();
        r.id          = item.getId();
        r.name        = item.getName();
        r.description = item.getDescription();
        r.category    = item.getCategory().name();
        r.date        = item.getDate();
        r.location    = item.getLocation();
        r.contact     = item.getContact();
        r.reward      = item.getReward();
        r.status      = item.getStatus().name();
        r.createdAt   = item.getCreatedAt();
        r.imageUrl    = buildDataUrl(item.getImageData(), item.getImageType());
        return r;
    }

    // ── Static factory for FoundItem ─────────────────────────────
    public static ItemResponse from(FoundItem item) {
        ItemResponse r = new ItemResponse();
        r.id          = item.getId();
        r.name        = item.getName();
        r.description = item.getDescription();
        r.category    = item.getCategory().name();
        r.date        = item.getFoundDate();
        r.location    = item.getLocation();
        r.contact     = item.getContact();
        r.reward      = null;
        r.status      = item.getStatus().name();
        r.createdAt   = item.getCreatedAt();
        r.imageUrl    = buildDataUrl(item.getImageData(), item.getImageType());
        return r;
    }

    // ── Convert byte[] → "data:image/jpeg;base64,/9j/4AAQ..." ───
    private static String buildDataUrl(byte[] imageData, String imageType) {
        if (imageData == null || imageData.length == 0) return null;
        String base64 = Base64.getEncoder().encodeToString(imageData);
        String mime   = (imageType != null) ? imageType : "image/jpeg";
        return "data:" + mime + ";base64," + base64;
    }
}