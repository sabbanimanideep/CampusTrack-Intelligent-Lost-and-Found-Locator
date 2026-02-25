package com.LostGadgetTracker.LostGadgetTracker.Dto;

import com.LostGadgetTracker.LostGadgetTracker.entities.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    private String name;
    private String email;
    private String rollNoOrEmpId;
    private String password;
    private Role role;   // STUDENT / ADMIN (from frontend)
}