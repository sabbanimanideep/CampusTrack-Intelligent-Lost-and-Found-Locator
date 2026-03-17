package com.LostGadgetTracker.LostGadgetTracker.entities;




import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

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

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private String location;

    private String contact;

    @Builder.Default
    private Double reward = 0.0;

    // ── Image stored directly in DB as LONGBLOB ──────────────────
    @Lob
    @Column(name = "image_data", columnDefinition = "LONGBLOB")
    private byte[] imageData;

    @Column(name = "image_type")   // e.g. "image/jpeg", "image/png"
    private String imageType;
    // ─────────────────────────────────────────────────────────────

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.ACTIVE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_by")
    private User reportedBy;

    @Column(updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum Category {
        electronics, documents, clothing, keys, accessories, other
    }

    public enum Status {
        ACTIVE, MATCHED, RESOLVED
    }
}