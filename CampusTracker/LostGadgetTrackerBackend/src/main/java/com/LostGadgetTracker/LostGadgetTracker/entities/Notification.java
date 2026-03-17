package com.LostGadgetTracker.LostGadgetTracker.entities;

import jakarta.persistence.*;

@Entity
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;

    private boolean readStatus = false;

    @ManyToOne
    private User user;

    // getters and setters
}