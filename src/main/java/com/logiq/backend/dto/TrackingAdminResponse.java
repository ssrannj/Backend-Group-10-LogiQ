package com.logiq.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrackingAdminResponse {
    private String orderId;
    private String status;
    private String paymentVerificationState;
    private String sourceWarehouse; // Placeholder
    private String adminNotes;      // Placeholder
    private LocalDateTime lastUpdated;
    // New detailed fields
    private String customerNotes;
    private LocalDateTime expectedDeliveryDate;
    private String warrantyStatus; // e.g., ACTIVE or EXPIRED
    private java.math.BigDecimal amount;
}
