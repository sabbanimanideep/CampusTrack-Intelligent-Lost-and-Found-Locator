package com.LostGadgetTracker.LostGadgetTracker.entities;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Table(name = "chat_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sender;
    private String receiver;
    private Long itemId;

    @Enumerated(EnumType.STRING)
    private Status status;

    public enum Status {
        PENDING,
        ACCEPTED,
        REJECTED
    }
}