package com.LostGadgetTracker.LostGadgetTracker.Services;

import com.LostGadgetTracker.LostGadgetTracker.Dto.LoginRequest;
import com.LostGadgetTracker.LostGadgetTracker.Dto.RegisterRequest;
import com.LostGadgetTracker.LostGadgetTracker.entities.Role;
import com.LostGadgetTracker.LostGadgetTracker.entities.User;
import com.LostGadgetTracker.LostGadgetTracker.repo.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        if (userRepository.existsByRoll(request.getRollNoOrEmpId())) {
            throw new RuntimeException("Roll No / Emp ID already exists");
        }

        // ✅ FIXED: Always STUDENT, ignore any role from frontend
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .rollNoOrEmpId(request.getRollNoOrEmpId())
                .password(encoder.encode(request.getPassword()))
                .role(Role.STUDENT) // 👈 hardcoded, never from request
                .enabled(true)
                .build();

        userRepository.save(user);
        return "User registered successfully";
    }

    public User login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmailOrRollNo())
                .orElseGet(() ->
                        userRepository.findByRoll(request.getEmailOrRollNo())
                                .orElseThrow(() -> new RuntimeException("Invalid email or password"))
                );

        if (!user.isEnabled()) {
            throw new RuntimeException("Account disabled");
        }

        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return user; // role is inside user object ✅
    }
}