package com.LostGadgetTracker.LostGadgetTracker.Dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class LostItemRequest {

    @NotBlank(message = "Item name is required.")
    private String name;

    @NotBlank(message = "Description is required.")
    private String description;

    @NotNull(message = "Category is required.")
    private String category;

    @NotNull(message = "Date is required.")
    private LocalDate date;

    @NotBlank(message = "Location is required.")
    private String location;

    private String contact;
    private Double reward;
}
