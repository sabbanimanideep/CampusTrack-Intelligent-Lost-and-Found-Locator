package com.LostGadgetTracker.LostGadgetTracker.Services;

import com.LostGadgetTracker.LostGadgetTracker.Config.JwtUtil;
import com.LostGadgetTracker.LostGadgetTracker.Dto.ChangePasswordRequest;
import com.LostGadgetTracker.LostGadgetTracker.Dto.LoginRequest;
import com.LostGadgetTracker.LostGadgetTracker.Dto.ProfileResponse;
import com.LostGadgetTracker.LostGadgetTracker.Dto.RegisterRequest;
import com.LostGadgetTracker.LostGadgetTracker.entities.Role;
import com.LostGadgetTracker.LostGadgetTracker.entities.User;
import com.LostGadgetTracker.LostGadgetTracker.repo.FoundItemRepository;
import com.LostGadgetTracker.LostGadgetTracker.repo.LostItemRepository;
import com.LostGadgetTracker.LostGadgetTracker.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    public String register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        if (userRepository.existsByRoll(request.getRollNoOrEmpId())) {
            throw new RuntimeException("Roll No / Emp ID already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .rollNoOrEmpId(request.getRollNoOrEmpId())
                .password(encoder.encode(request.getPassword()))
                .role(Role.STUDENT)
                .enabled(true)
                .build();

        userRepository.save(user);
        return "User registered successfully";
    }

    public Map<String, Object> login(LoginRequest request) {

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

        // ✅ CHANGED: pass role so it gets embedded in the token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return Map.of(
                "token", token,
                "role",  user.getRole().name(),
                "name",  user.getName()
        );
    }
}