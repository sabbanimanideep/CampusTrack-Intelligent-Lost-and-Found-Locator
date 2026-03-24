package com.LostGadgetTracker.LostGadgetTracker.Services;


import org.apache.commons.text.similarity.LevenshteinDistance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

import com.LostGadgetTracker.LostGadgetTracker.entities.*;
import com.LostGadgetTracker.LostGadgetTracker.repo.*;
import com.LostGadgetTracker.LostGadgetTracker.Dto.MatchResultDTO;

@Service
public class MatchingService {

    @Autowired
    private LostItemRepository lostRepo;

    @Autowired
    private FoundItemRepository foundRepo;

    private final LevenshteinDistance ld = new LevenshteinDistance();

    // 🔹 Main Matching Method
    public List<MatchResultDTO> findMatches(String email) {

        List<LostItem> lostItems = lostRepo.findByUserEmail(email);
        List<FoundItem> foundItems = foundRepo.findAll();

        List<MatchResultDTO> results = new ArrayList<>();

        for (LostItem lost : lostItems) {

            for (FoundItem found : foundItems) {

                double textScore = computeTextScore(lost, found);
                double locationScore = computeLocationScore(
                        lost.getLastSeenLocation(),
                        found.getFoundLocation()
                );

                double finalScore = (textScore * 0.7) + (locationScore * 0.3);

                if (finalScore > 0.5) { // threshold
                    results.add(
                            MatchResultDTO.builder()
                                    .lostId(lost.getId())
                                    .lostItemName(lost.getItemName())
                                    .foundId(found.getId())
                                    .foundItemName(found.getItemName())
                                    .score(finalScore)
                                    .build()
                    );
                }
            }
        }

        results.sort((a, b) -> Double.compare(b.getScore(), a.getScore()));

        return results;
    }

    // 🔹 TEXT MATCHING (Fuzzy)
    private double computeTextScore(LostItem lost, FoundItem found) {

        double nameScore = fuzzy(lost.getItemName(), found.getItemName());
        double categoryScore = fuzzy(lost.getCategory(), found.getCategory());
        double descScore = fuzzy(lost.getDescription(), found.getDescription());

        return (nameScore * 0.5) + (categoryScore * 0.2) + (descScore * 0.3);
    }

    // 🔹 FUZZY FUNCTION
    private double fuzzy(String a, String b) {
        if (a == null || b == null) return 0.0;

        int distance = ld.apply(a.toLowerCase(), b.toLowerCase());
        int maxLen = Math.max(a.length(), b.length());

        return maxLen == 0 ? 1.0 : (1.0 - ((double) distance / maxLen));
    }

    // 🔹 LOCATION MATCHING
    private double computeLocationScore(String loc1, String loc2) {

        if (loc1 == null || loc2 == null) return 0.0;

        loc1 = loc1.toLowerCase();
        loc2 = loc2.toLowerCase();

        if (loc1.equals(loc2)) return 1.0;

        if (loc1.contains(loc2) || loc2.contains(loc1)) return 0.7;

        return 0.0;
    }
}
