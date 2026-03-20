package com.logiq.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WarrantyInfoResponse {
    private Long productId;
    private Integer warrantyPeriodMonths;
    private Boolean active;
    private LocalDate purchaseDate;
    private LocalDate warrantyExpiryDate;
}
