package com.LostGadgetTracker.LostGadgetTracker.Services;



import com.LostGadgetTracker.LostGadgetTracker.Dto.ItemResponse;
import com.LostGadgetTracker.LostGadgetTracker.entities.LostItem;
import com.LostGadgetTracker.LostGadgetTracker.entities.User;
import com.LostGadgetTracker.LostGadgetTracker.repo.LostItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LostItemService {

    private final LostItemRepository lostItemRepository;

    // ── GET all ───────────────────────────────────────────────────
    public List<ItemResponse> getAll(String category, String search) {
        LostItem.Category cat = parseCategory(category);
        return lostItemRepository.searchItems(cat, search)
                .stream()
                .map(ItemResponse::from)
                .toList();
    }

    // ── GET by ID ─────────────────────────────────────────────────
    public ItemResponse getById(Long id) {
        return ItemResponse.from(findOrThrow(id));
    }

    // ── CREATE — image bytes stored directly in DB ────────────────
    public ItemResponse create(String name, String description, String category,
                               String date, String location, String contact,
                               Double reward, MultipartFile image, User reporter)
            throws IOException {

        byte[] imageData = null;
        String imageType = null;

        if (image != null && !image.isEmpty()) {
            imageData = image.getBytes();          // read bytes from upload
            imageType = image.getContentType();    // "image/jpeg", "image/png" etc.
        }

        LostItem item = LostItem.builder()
                .name(name)
                .description(description)
                .category(LostItem.Category.valueOf(category.toLowerCase()))
                .date(LocalDate.parse(date))
                .location(location)
                .contact(contact)
                .reward(reward != null ? reward : 0.0)
                .imageData(imageData)              // ← stored in DB as LONGBLOB
                .imageType(imageType)              // ← stored in DB as VARCHAR
                .reportedBy(reporter)
                .build();

        return ItemResponse.from(lostItemRepository.save(item));
    }

    // ── UPDATE STATUS ─────────────────────────────────────────────
    public ItemResponse updateStatus(Long id, String status) {
        LostItem item = findOrThrow(id);
        item.setStatus(LostItem.Status.valueOf(status.toUpperCase()));
        return ItemResponse.from(lostItemRepository.save(item));
    }

    // ── DELETE ────────────────────────────────────────────────────
    public void delete(Long id) {
        lostItemRepository.delete(findOrThrow(id));
    }

    // ── Helpers ───────────────────────────────────────────────────
    private LostItem findOrThrow(Long id) {
        return lostItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lost item not found: " + id));
    }

    private LostItem.Category parseCategory(String value) {
        if (value == null || value.equalsIgnoreCase("All")) return null;
        try { return LostItem.Category.valueOf(value.toLowerCase()); }
        catch (IllegalArgumentException e) { return null; }
    }
}














