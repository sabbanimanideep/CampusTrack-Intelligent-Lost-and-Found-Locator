package com.LostGadgetTracker.LostGadgetTracker.Services;



import com.LostGadgetTracker.LostGadgetTracker.Dto.ItemResponse;
import com.LostGadgetTracker.LostGadgetTracker.entities.FoundItem;
import com.LostGadgetTracker.LostGadgetTracker.entities.User;
import com.LostGadgetTracker.LostGadgetTracker.repo.FoundItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FoundItemService {

    private final FoundItemRepository foundItemRepository;

    // ── GET all (BrowseItems.jsx → fetchFoundItems()) ─────────────
    public List<ItemResponse> getAll(String category, String search) {
        FoundItem.Category cat = parseCategory(category);
        return foundItemRepository.searchItems(cat, search)
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
                               String foundDate, String location, String contact,
                               MultipartFile image, User reporter)
            throws IOException {

        byte[] imageData = null;
        String imageType = null;

        if (image != null && !image.isEmpty()) {
            imageData = image.getBytes();          // read bytes from upload
            imageType = image.getContentType();    // "image/jpeg", "image/png" etc.
        }

        FoundItem item = FoundItem.builder()
                .name(name)
                .description(description)
                .category(FoundItem.Category.valueOf(category.toLowerCase()))
                .foundDate(LocalDate.parse(foundDate))
                .location(location)
                .contact(contact)
                .imageData(imageData)              // ← stored in DB as LONGBLOB
                .imageType(imageType)              // ← stored in DB as VARCHAR
                .reportedBy(reporter)
                .build();

        return ItemResponse.from(foundItemRepository.save(item));
    }

    // ── UPDATE STATUS ─────────────────────────────────────────────
    public ItemResponse updateStatus(Long id, String status) {
        FoundItem item = findOrThrow(id);
        item.setStatus(FoundItem.Status.valueOf(status.toUpperCase()));
        return ItemResponse.from(foundItemRepository.save(item));
    }

    // ── DELETE ────────────────────────────────────────────────────
    public void delete(Long id) {
        foundItemRepository.delete(findOrThrow(id));
    }

    // ── Helpers ───────────────────────────────────────────────────
    private FoundItem findOrThrow(Long id) {
        return foundItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Found item not found: " + id));
    }

    private FoundItem.Category parseCategory(String value) {
        if (value == null || value.equalsIgnoreCase("All")) return null;
        try { return FoundItem.Category.valueOf(value.toLowerCase()); }
        catch (IllegalArgumentException e) { return null; }
    }
}














