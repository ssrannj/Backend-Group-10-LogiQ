package com.logiq.backend.controller;

import com.logiq.backend.dto.TrackingAdminResponse;
import com.logiq.backend.dto.TrackingCustomerResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RequiredArgsConstructor
public class TrackingController {
    
    private final com.logiq.backend.repository.OrderPaymentRepository orderPaymentRepository;
    private final com.logiq.backend.service.WarrantyService warrantyService;

    @GetMapping("/orders/{id}/tracking/customer")
    public ResponseEntity<TrackingCustomerResponse> getCustomerTracking(@PathVariable String id) {
        Long orderIdLong = null;
        try {
            orderIdLong = Long.parseLong(id);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        }

        com.logiq.backend.model.OrderPayment payment = orderPaymentRepository.findByOrderId(orderIdLong)
                .orElse(null);

        String currentStatus = (payment != null) ? payment.getStatus().name() : "ORDER_NOT_FOUND";
        
        List<TrackingCustomerResponse.Milestone> history = new ArrayList<>();
        if (payment != null) {
            history.add(TrackingCustomerResponse.Milestone.builder()
                    .status("ORDER_PLACED")
                    .timestamp(payment.getUploadTime())
                    .description("Order has been successfully placed and payment proof uploaded.")
                    .build());
            
            if (payment.getStatus() != com.logiq.backend.model.PaymentStatus.VERIFYING_ORDER) {
                history.add(TrackingCustomerResponse.Milestone.builder()
                        .status(payment.getStatus().name())
                        .timestamp(LocalDateTime.now()) // Approximate
                        .description("Payment has been " + payment.getStatus().name().toLowerCase() + ".")
                        .build());
            }
        }

        String warrantyStatus = "N/A";
        LocalDateTime warrantyExpiry = null;

        if (payment != null && payment.getProductId() != null) {
            try {
                com.logiq.backend.dto.WarrantyInfoResponse warrantyInfo = warrantyService.calculateWarranty(
                        payment.getProductId(), 
                        payment.getUploadTime().toLocalDate()
                );
                warrantyStatus = warrantyInfo.getActive() ? "ACTIVE" : "EXPIRED";
                if (warrantyInfo.getWarrantyExpiryDate() != null) {
                    warrantyExpiry = warrantyInfo.getWarrantyExpiryDate().atStartOfDay();
                }
            } catch (Exception e) {
                // Product might not have warranty or not found
            }
        }

        TrackingCustomerResponse response = TrackingCustomerResponse.builder()
                .orderId(id)
                .currentStatus(currentStatus)
                .milestoneHistory(history)
                .warrantyStatus(warrantyStatus)
                .warrantyExpiryDate(warrantyExpiry)
                .build();
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin/orders/{id}/tracking")
    public ResponseEntity<TrackingAdminResponse> getAdminTracking(@PathVariable String id) {
        Long orderIdLong = null;
        try {
            orderIdLong = Long.parseLong(id);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        }

        com.logiq.backend.model.OrderPayment payment = orderPaymentRepository.findByOrderId(orderIdLong)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Order tracking info not found"));

        String warrantyStatus = "N/A";
        if (payment.getProductId() != null) {
            try {
                com.logiq.backend.dto.WarrantyInfoResponse warrantyInfo = warrantyService.calculateWarranty(
                        payment.getProductId(), 
                        payment.getUploadTime().toLocalDate()
                );
                warrantyStatus = warrantyInfo.getActive() ? "ACTIVE" : "EXPIRED";
            } catch (Exception e) {
                // ignore
            }
        }

        TrackingAdminResponse response = TrackingAdminResponse.builder()
                .orderId(id)
                .status(payment.getStatus().name())
                .paymentVerificationState(payment.getStatus().name())
                .sourceWarehouse("Colombo Main Distribution Center")
                .adminNotes("Payment slip: " + payment.getFileName())
                .lastUpdated(LocalDateTime.now())
                .customerNotes("No specific notes.")
                .expectedDeliveryDate(payment.getUploadTime().plusDays(5))
                .warrantyStatus(warrantyStatus)
                .amount(payment.getAmount())
                .build();

        return ResponseEntity.ok(response);
    }
}
