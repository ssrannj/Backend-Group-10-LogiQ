package com.logiq.backend.controller;

import com.logiq.backend.service.PriorityScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class PriorityScoreTestController {

    private final PriorityScoreService priorityScoreService;

    @Autowired
    public PriorityScoreTestController(PriorityScoreService priorityScoreService) {
        this.priorityScoreService = priorityScoreService;
    }

    @GetMapping("/priority-score")
    public Map<String, Integer> calculatePriorityScore(
            @RequestParam(name = "daysUntilDeadline") int daysUntilDeadline,
            @RequestParam(name = "isUrgent") boolean isUrgent,
            @RequestParam(name = "orderAgeDays") int orderAgeDays) {
        
        int score = priorityScoreService.calculatePriorityScore(daysUntilDeadline, isUrgent, orderAgeDays);
        Map<String, Integer> response = new HashMap<>();
        response.put("score", score);
        return response;
    }
}
