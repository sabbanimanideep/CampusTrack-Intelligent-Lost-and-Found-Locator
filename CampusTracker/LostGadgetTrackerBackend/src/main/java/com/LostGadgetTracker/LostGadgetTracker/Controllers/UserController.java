package com.LostGadgetTracker.LostGadgetTracker.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.LostGadgetTracker.LostGadgetTracker.Dto.ChangePasswordRequest;
import com.LostGadgetTracker.LostGadgetTracker.Dto.ProfileResponse;
import com.LostGadgetTracker.LostGadgetTracker.Services.UserService;
import com.LostGadgetTracker.LostGadgetTracker.entities.User;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService service;

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ProfileResponse getProfile(Authentication auth) {
        if (auth == null) {
            throw new RuntimeException("User not authenticated");
        }
        return userService.getProfile(auth.getName());
    }

    @PutMapping("/update-profile")
    public User updateProfile(Authentication auth,@RequestBody User user){

        return service.updateProfile(auth.getName(),user);
    }

    @PutMapping("/change-password")
    public String changePassword(Authentication auth,
                                 @RequestBody ChangePasswordRequest req){

        service.changePassword(auth.getName(),req);

        return "Password Updated";
    }
}
