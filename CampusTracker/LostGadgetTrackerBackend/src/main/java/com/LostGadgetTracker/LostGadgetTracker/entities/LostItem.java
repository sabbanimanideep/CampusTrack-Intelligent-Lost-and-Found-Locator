package com.LostGadgetTracker.LostGadgetTracker.entities;



import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "lost_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LostItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Item Info
    @Column(nullable = false)
    private String itemName;

    @Column(nullable = false)
    private String category;

    @Column(length = 1000)
    private String description;

    // Lost Details
    @Column(nullable = false)
    private LocalDate dateLost;

    @Column(nullable = false)
    private String lastSeenLocation;

    // Contact
    private String contactNumber;

    @Column(nullable = false)
    private String userEmail; // 🔥 user who lost item

    // Optional reward
    private Double reward;

    // Image
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] image;
}
