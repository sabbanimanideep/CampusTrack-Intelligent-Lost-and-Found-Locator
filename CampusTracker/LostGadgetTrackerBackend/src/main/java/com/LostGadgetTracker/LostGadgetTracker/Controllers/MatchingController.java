package com.LostGadgetTracker.LostGadgetTracker.Controllers;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.LostGadgetTracker.LostGadgetTracker.Services.MatchingService;
import com.LostGadgetTracker.LostGadgetTracker.Dto.MatchResultDTO;

@RestController
@RequestMapping("/api/match")
@CrossOrigin(origins = "*")
public class MatchingController {

    @Autowired
    private MatchingService service;

    @GetMapping
    public List<MatchResultDTO> getMatches(@RequestParam(required = false) String email) {

        if (email == null || email.isEmpty()) {
            throw new RuntimeException("Email is required");
        }

        return service.findMatches(email);
    }
}
