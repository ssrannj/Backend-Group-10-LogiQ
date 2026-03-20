package com.logiq.backend.service;

import com.logiq.backend.dto.WarrantyInfoResponse;
import com.logiq.backend.model.Product;
import com.logiq.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class WarrantyService {

    private final ProductRepository productRepository;

    public WarrantyInfoResponse calculateWarranty(Long productId, LocalDate purchaseDate) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Integer period = product.getWarrantyPeriodMonths();
        if (period == null) {
            return WarrantyInfoResponse.builder()
                    .productId(productId)
                    .active(false)
                    .build();
        }

        LocalDate expiryDate = purchaseDate.plusMonths(period);
        boolean active = LocalDate.now().isBefore(expiryDate);

        return WarrantyInfoResponse.builder()
                .productId(productId)
                .warrantyPeriodMonths(period)
                .active(active)
                .purchaseDate(purchaseDate)
                .warrantyExpiryDate(expiryDate)
                .build();
    }
}
