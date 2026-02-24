package com.LostGadgetTracker.LostGadgetTracker.Dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String emailOrRollNo;
    private String password;
}