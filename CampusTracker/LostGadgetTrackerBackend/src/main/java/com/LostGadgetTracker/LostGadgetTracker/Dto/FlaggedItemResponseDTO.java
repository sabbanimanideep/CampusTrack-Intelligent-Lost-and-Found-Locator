package com.LostGadgetTracker.LostGadgetTracker.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FlaggedItemResponseDTO {

    private Long   itemId;
    private String itemType;    // "LOST" or "FOUND"
    private String title;       // itemName from LostItem / FoundItem
    private String description;
    private String author;      // reporterEmail / userEmail
    private String date;        // dateLost / dateFound
    private int    flagCount;   // how many students flagged it
    private String reason;      // most recent flag reason
}