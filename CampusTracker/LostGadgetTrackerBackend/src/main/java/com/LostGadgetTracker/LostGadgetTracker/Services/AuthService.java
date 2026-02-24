package com.LostGadgetTracker.LostGadgetTracker.Services;

import com.LostGadgetTracker.LostGadgetTracker.Dto.LoginRequest;
import com.LostGadgetTracker.LostGadgetTracker.Dto.RegisterRequest;
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

        if (userRepository.existsByRollNoOrEmpId(request.getRollNoOrEmpId())) {
            throw new RuntimeException("Roll No / Emp ID already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .rollNoOrEmpId(request.getRollNoOrEmpId())
                .password(encoder.encode(request.getPassword()))
                .role(request.getRole())
                .enabled(true)
                .build();

        userRepository.save(user);
        return "User registered successfully";
    }

    public User login(LoginRequest request) {

        // find by email OR rollNoOrEmpId
        User user = userRepository.findByEmail(request.getEmailOrRollNo())
                .orElseGet(() -> userRepository.findByRollNoOrEmpId(request.getEmailOrRollNo())
                        .orElseThrow(() -> new RuntimeException("Invalid email or password")));

        // check account enabled
        if (!user.isEnabled()) {
            throw new RuntimeException("Account is disabled. Contact admin");
        }

        // match password
        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return user;
    }
}