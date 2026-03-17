package com.LostGadgetTracker.LostGadgetTracker.Services;

import com.LostGadgetTracker.LostGadgetTracker.Dto.ChangePasswordRequest;
import com.LostGadgetTracker.LostGadgetTracker.Dto.ProfileResponse;
import com.LostGadgetTracker.LostGadgetTracker.entities.User;
import com.LostGadgetTracker.LostGadgetTracker.repo.FoundItemRepository;
import com.LostGadgetTracker.LostGadgetTracker.repo.LostItemRepository;
import com.LostGadgetTracker.LostGadgetTracker.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private LostItemRepository lostRepo;

    @Autowired
    private FoundItemRepository foundRepo;

    @Autowired
    private PasswordEncoder encoder;

    public  ProfileResponse getProfile(String email) {

        User user = userRepo.findByEmail(email).orElseThrow();

        long lostCount = lostRepo.countByReportedBy(user);
        long foundCount = foundRepo.countByReportedBy(user);

        return new ProfileResponse(
                user.getName(),
                user.getEmail(),
                user.getRollNoOrEmpId(),
                lostCount,
                foundCount
        );
    }

    public User updateProfile(String email, User updated) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        user.setName(updated.getName());
        user.setRollNoOrEmpId(updated.getRollNoOrEmpId());

        return userRepo.save(user);
    }

    public void changePassword(String email, ChangePasswordRequest req) {

        User user = userRepo.findByEmail(email).orElseThrow();

        if (!encoder.matches(req.getCurrentPassword(), user.getPassword()))
            throw new RuntimeException("Wrong password");

        if (!req.getNewPassword().equals(req.getConfirmPassword()))
            throw new RuntimeException("Passwords not matching");

        user.setPassword(encoder.encode(req.getNewPassword()));

        userRepo.save(user);
    }
}