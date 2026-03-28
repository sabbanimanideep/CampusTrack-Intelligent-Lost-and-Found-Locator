package com.LostGadgetTracker.LostGadgetTracker.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "flagged_items",
        uniqueConstraints = @UniqueConstraint(columnNames = {"item_id", "item_type", "flagged_by_email"})
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlaggedItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ID of the LostItem or FoundItem being flagged
    private Long itemId;

    // "LOST" or "FOUND"
    @Column(name = "item_type", nullable = false)
    private String itemType;

    // Student who flagged it
    @Column(name = "flagged_by_email", nullable = false)
    private String flaggedByEmail;

    @Column(nullable = false)
    private String reason;

    @Builder.Default
    private LocalDateTime flaggedAt = LocalDateTime.now();

    // false = active flag, true = dismissed by admin
    @Builder.Default
    private boolean dismissed = false;
}