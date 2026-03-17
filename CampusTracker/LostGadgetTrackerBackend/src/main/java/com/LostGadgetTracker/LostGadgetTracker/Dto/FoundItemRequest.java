package com.LostGadgetTracker.LostGadgetTracker.Dto;



import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class FoundItemRequest {

    @NotBlank(message = "Item name is required.")
    private String name;

    @NotBlank(message = "Description is required.")
    private String description;

    @NotNull(message = "Category is required.")
    private String category;

    @NotNull(message = "Found date is required.")
    private LocalDate foundDate;

    @NotBlank(message = "Location is required.")
    private String location;

    private String contact;
}
