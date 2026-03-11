package com.LostGadgetTracker.LostGadgetTracker.Controllers;


import com.LostGadgetTracker.LostGadgetTracker.entities.Role;
import java.util.Map;
import com.LostGadgetTracker.LostGadgetTracker.entities.User;
import com.LostGadgetTracker.LostGadgetTracker.repo.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('ADMIN')")  // 👈 blocks all non-admin users
public class AdminController {

    private final UserRepository userRepository;

    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ✅ Get all users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // ✅ Get user by ID
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    // ✅ Enable or disable a user account
    @PutMapping("/users/{id}/toggle-status")
    public ResponseEntity<String> toggleUserStatus(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEnabled(!user.isEnabled()); // flip true/false
        userRepository.save(user);

        String status = user.isEnabled() ? "enabled" : "disabled";
        return ResponseEntity.ok("User account " + status + " successfully");
    }

    // ✅ Delete a user
    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    // ✅ Admin dashboard stats
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalStudents = userRepository.countByRole(Role.STUDENT);

        return ResponseEntity.ok(Map.of(
                "totalUsers", totalUsers,
                "totalStudents", totalStudents
        ));
    }
}
