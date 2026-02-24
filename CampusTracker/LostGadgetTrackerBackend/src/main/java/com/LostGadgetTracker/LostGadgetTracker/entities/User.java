package com.LostGadgetTracker.LostGadgetTracker.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "email"),
        @UniqueConstraint(columnNames = "rollNoOrEmpId")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String rollNoOrEmpId;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;   // STUDENT or STAFF

    private boolean enabled = true;
}