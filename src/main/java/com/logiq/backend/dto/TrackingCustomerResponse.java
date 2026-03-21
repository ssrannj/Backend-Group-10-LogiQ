package com.logiq.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrackingCustomerResponse {
    private String orderId;
    private String currentStatus;
    private List<Milestone> milestoneHistory;
    private String warrantyStatus; 
    private LocalDateTime warrantyExpiryDate;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Milestone {
        private String status;
        private LocalDateTime timestamp;
        private String description;
    }
}
