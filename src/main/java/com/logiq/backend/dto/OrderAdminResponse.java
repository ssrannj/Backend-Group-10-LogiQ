package com.logiq.backend.dto;

import com.logiq.backend.model.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderAdminResponse {
    private Long id;
    private String orderId;
    private Long productId;
    private String productName;
    private BigDecimal amount;
    private String fileName;
    private String fileType;
    private PaymentStatus status;
    private LocalDateTime uploadTime;
    private int priorityScore;
    private String customerName;
}
