package com.LostGadgetTracker.LostGadgetTracker.Dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    private String emailOrRollNo;
    private String password;
}