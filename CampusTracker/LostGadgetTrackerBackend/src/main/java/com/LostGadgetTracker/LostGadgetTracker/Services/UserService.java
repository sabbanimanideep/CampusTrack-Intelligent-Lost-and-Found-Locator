package com.LostGadgetTracker.LostGadgetTracker.Services;



import com.LostGadgetTracker.LostGadgetTracker.entities.User;
import com.LostGadgetTracker.LostGadgetTracker.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository repository;

    public User getProfile(String email) {
        return repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public User updateProfile(User updated) {

        User user = repository.findByEmail(updated.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(updated.getName());

        // optional update
        if (updated.getRole() != null)
            user.setRole(updated.getRole());

        if (updated.getRollNoOrEmpId() != null)
            user.setRollNoOrEmpId(updated.getRollNoOrEmpId());

        return repository.save(user);
    }
}