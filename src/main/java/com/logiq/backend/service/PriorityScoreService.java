package com.logiq.backend.service;

import org.springframework.stereotype.Service;

@Service
public class PriorityScoreService {
    
    public int calculatePriorityScore(int daysUntilDeadline, boolean isUrgent, int orderAgeDays) {
        int score = 10 - daysUntilDeadline;
        
        if (isUrgent) {
            score += 20;
        }
        
        score += orderAgeDays;

        // Ensure the score is always strictly positive (at least 1)
        return Math.max(1, score);
    }
}
