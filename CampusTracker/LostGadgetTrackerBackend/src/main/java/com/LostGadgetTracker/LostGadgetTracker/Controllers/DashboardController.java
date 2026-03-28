package com.LostGadgetTracker.LostGadgetTracker.Controllers;
import com.LostGadgetTracker.LostGadgetTracker.Services.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/dashboard/overview")
    public ResponseEntity<Map<String, Long>> getOverview() {
        return ResponseEntity.ok(dashboardService.getOverviewCounts());
    }
}
