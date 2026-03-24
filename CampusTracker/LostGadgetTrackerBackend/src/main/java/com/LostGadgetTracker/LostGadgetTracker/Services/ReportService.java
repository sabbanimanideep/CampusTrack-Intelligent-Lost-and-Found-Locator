package com.LostGadgetTracker.LostGadgetTracker.Services;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.LostGadgetTracker.LostGadgetTracker.Dto.ReportCountDTO;
import com.LostGadgetTracker.LostGadgetTracker.repo.*;

@Service
public class ReportService {

    @Autowired
    private LostItemRepository lostRepo;

    @Autowired
    private FoundItemRepository foundRepo;

    // ✅ Get count by user email
    public ReportCountDTO getUserReportCount(String email) {

        long lost = lostRepo.countByUserEmail(email);
        long found = foundRepo.countByReporterEmail(email);

        return new ReportCountDTO(lost, found);
    }

    // ✅ Optional: total count (admin)
    public ReportCountDTO getTotalCount() {
        return new ReportCountDTO(
                lostRepo.count(),
                foundRepo.count()
        );
    }
}
