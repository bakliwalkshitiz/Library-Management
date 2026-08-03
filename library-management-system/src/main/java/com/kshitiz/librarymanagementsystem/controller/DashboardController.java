package com.kshitiz.librarymanagementsystem.controller;

import com.kshitiz.librarymanagementsystem.dto.DashboardResponse;
import com.kshitiz.librarymanagementsystem.service.DashboardService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public DashboardResponse getDashboard() {
        return dashboardService.getDashboard();
    }
}