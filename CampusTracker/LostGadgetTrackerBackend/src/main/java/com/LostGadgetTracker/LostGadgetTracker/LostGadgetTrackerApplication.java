package com.LostGadgetTracker.LostGadgetTracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class LostGadgetTrackerApplication {

	public static void main(String[] args) {

        SpringApplication.run(LostGadgetTrackerApplication.class, args);
	}

}
