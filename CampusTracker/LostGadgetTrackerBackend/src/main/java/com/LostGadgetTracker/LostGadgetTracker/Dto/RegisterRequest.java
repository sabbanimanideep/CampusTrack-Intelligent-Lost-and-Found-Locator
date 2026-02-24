package com.LostGadgetTracker.LostGadgetTracker.Dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String rollNoOrEmpId;
    private String password;
    private String role;
}