package com.LostGadgetTracker.LostGadgetTracker.Controllers;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.LostGadgetTracker.LostGadgetTracker.Services.ReportService;
import com.LostGadgetTracker.LostGadgetTracker.Dto.ReportCountDTO;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private ReportService service;

    // ✅ Get logged user report count
    @GetMapping("/count")
    public ReportCountDTO getUserReportCount(@RequestParam String email) {
        return service.getUserReportCount(email);
    }

    // ✅ Optional: total count
    @GetMapping("/total")
    public ReportCountDTO getTotalCount() {
        return service.getTotalCount();
    }
}
