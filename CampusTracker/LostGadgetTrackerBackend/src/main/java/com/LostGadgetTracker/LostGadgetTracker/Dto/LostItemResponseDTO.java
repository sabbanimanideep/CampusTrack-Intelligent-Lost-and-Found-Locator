package com.LostGadgetTracker.LostGadgetTracker.Dto;

import com.LostGadgetTracker.LostGadgetTracker.entities.LostItem;
import com.LostGadgetTracker.LostGadgetTracker.entities.User;

public class LostItemResponseDTO {

    private Long id;
    private String title;
    private String description;
    private String status;
    private String author;
    private String rollNo;
    private String userEmail;
    private String date;

    public LostItemResponseDTO(LostItem item, User user) {
        this.id          = item.getId();
        this.title       = item.getItemName();
        this.description = item.getDescription();
        this.status      = item.isApproved() ? "APPROVED" : "PENDING";
        this.date        = item.getDateLost() != null ? item.getDateLost().toString() : "";
        this.userEmail   = item.getUserEmail();

        // null-safe: user might not exist
        this.author = user != null ? user.getName()           : "Unknown";
        this.rollNo = user != null ? user.getRollNoOrEmpId()  : "";
    }

    // Getters (required for Jackson serialization)
    public Long   getId()          { return id; }
    public String getTitle()       { return title; }
    public String getDescription() { return description; }
    public String getStatus()      { return status; }
    public String getAuthor()      { return author; }
    public String getRollNo()      { return rollNo; }
    public String getUserEmail()   { return userEmail; }
    public String getDate()        { return date; }
}