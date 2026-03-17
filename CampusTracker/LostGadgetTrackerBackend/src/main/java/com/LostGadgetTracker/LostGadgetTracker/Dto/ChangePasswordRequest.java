package com.LostGadgetTracker.LostGadgetTracker.Dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordRequest {

    private String currentPassword;
    private String newPassword;
    private String confirmPassword;

}