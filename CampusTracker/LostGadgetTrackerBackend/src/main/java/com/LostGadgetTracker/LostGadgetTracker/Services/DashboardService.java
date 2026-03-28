package com.LostGadgetTracker.LostGadgetTracker.Services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.LostGadgetTracker.LostGadgetTracker.repo.FoundItemRepository;
import com.LostGadgetTracker.LostGadgetTracker.repo.LostItemRepository;
import java.time.LocalDate;



import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    @Autowired
    private LostItemRepository lostRepository;

    @Autowired
    private FoundItemRepository foundRepository;

    public Map<String, Long> getOverviewCounts() {

        Map<String, Long> data = new HashMap<>();

        // TOTAL POSTS
        long totalPosts = lostRepository.count() + foundRepository.count();

        // APPROVED POSTS
        long approvedPosts =
                lostRepository.countByApprovedTrue() +
                        foundRepository.countByApprovedTrue();

        // FLAGGED POSTS
        long flaggedPosts =
                lostRepository.countByFlaggedTrue() +
                        foundRepository.countByFlaggedTrue();

        // RECENT POSTS (last 7 days)
        LocalDate today = LocalDate.now();
        LocalDate last7Days = today.minusDays(7);

        long recentLost = lostRepository.countByDateLostBetween(last7Days, today);
        long recentFound = foundRepository.countByDateFoundBetween(last7Days, today);

        long recentPosts = recentLost + recentFound;

        // OPTIONAL SPLIT
        long lostPosts = lostRepository.count();
        long foundPosts = foundRepository.count();

        // RESPONSE MAP
        data.put("totalPosts", totalPosts);
        data.put("approvedPosts", approvedPosts);
        data.put("flaggedPosts", flaggedPosts);
        data.put("recentPosts", recentPosts);
        data.put("lostPosts", lostPosts);
        data.put("foundPosts", foundPosts);

        return data;
    }
}
