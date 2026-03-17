package com.LostGadgetTracker.LostGadgetTracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class LostGadgetTrackerApplication {

    public static void main(String[] args) {
        SpringApplication.run(LostGadgetTrackerApplication.class, args);
    }

    // ✅ Nothing else here — no @Bean methods
}
