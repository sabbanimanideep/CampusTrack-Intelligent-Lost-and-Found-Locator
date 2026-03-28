package com.LostGadgetTracker.LostGadgetTracker.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "found_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoundItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String itemName;
    private String category;

    @Column(length = 1000)
    private String description;

    private LocalDate dateFound;
    private String foundLocation;

    private String contactNumber;
    private String reporterEmail;

    // ✅ NEW FIELD (IMPORTANT)
    private String imageType;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] image;

    private boolean approved = false;

    private String status;

    private boolean flagged;


}