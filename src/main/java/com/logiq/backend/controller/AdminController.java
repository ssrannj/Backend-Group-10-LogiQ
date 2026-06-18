package com.logiq.backend.controller;

import com.logiq.backend.dto.OrderAdminResponse;
import com.logiq.backend.model.OrderPayment;
import com.logiq.backend.model.PaymentStatus;
import com.logiq.backend.model.Product;
import com.logiq.backend.repository.OrderPaymentRepository;
import com.logiq.backend.repository.ProductRepository;
import com.logiq.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AdminController {

    private final OrderPaymentRepository orderPaymentRepository;
    private final ProductRepository productRepository;
    private final EmailService emailService;
    private final com.logiq.backend.service.PriorityScoreService priorityScoreService;

    @GetMapping("/verifying")
    public ResponseEntity<List<OrderAdminResponse>> getVerifyingOrders() {
        List<OrderPayment> payments = orderPaymentRepository.findByStatus(PaymentStatus.VERIFYING_ORDER);
        List<OrderAdminResponse> response = payments.stream()
                .map(p -> {
                    String productName = "Unknown Product";
                    if (p.getProductId() != null) {
                        productName = productRepository.findById(p.getProductId())
                                .map(Product::getName)
                                .orElse("Unknown Product");
                    }
                    int daysUntilDeadline = 7; // Fixed deadline for verifying status
                    boolean isUrgent = p.getAmount() != null && p.getAmount().doubleValue() > 1000;
                    int orderAgeDays = Math.max(0, (int) java.time.Duration.between(p.getUploadTime(), LocalDateTime.now()).toDays());
                    
                    int score = priorityScoreService.calculatePriorityScore(daysUntilDeadline, isUrgent, orderAgeDays);

                    return OrderAdminResponse.builder()
                            .id(p.getId())
                            .orderId(p.getOrderId())
                            .productId(p.getProductId())
                            .productName(productName)
                            .amount(p.getAmount())
                            .fileName(p.getFileName())
                            .fileType(p.getFileType())
                            .status(p.getStatus())
                            .uploadTime(p.getUploadTime())
                            .priorityScore(score)
                            .customerName("customer@example.com") 
                            .build();
                })
                .sorted((a, b) -> Integer.compare(b.getPriorityScore(), a.getPriorityScore())) // Sort by highest priority first
                .toList();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/verify-payment")
    public ResponseEntity<?> verifyPayment(@PathVariable Long id) {
        OrderPayment payment = orderPaymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment record not found"));
        
        payment.setStatus(PaymentStatus.PROCESSING);
        
        // Log the verification event for demo stability
        if (payment.getProductId() != null) {
            boolean productExists = productRepository.existsById(payment.getProductId());
            if (!productExists) {
                log.warn("Verifying payment for non-existent product ID: " + payment.getProductId());
            }
        }
        
        orderPaymentRepository.save(payment);

        // Improved Email Notification
        try {
            String mockUserEmail = "customer@example.com"; 
            emailService.sendStatusUpdateEmail(mockUserEmail, payment.getOrderId(), "PROCESSING");
        } catch (Exception e) {
            log.error("Failed to send email: " + e.getMessage());
        }
        
        return ResponseEntity.ok("Payment verified for ID: " + id + ". Order #" + payment.getOrderId() + " is now PROCESSING.");
    }

    @PostMapping("/{id}/reject-payment")
    public ResponseEntity<?> rejectPayment(@PathVariable Long id, @RequestParam(required = false, defaultValue = "Manual payment validation failed.") String reason) {
        OrderPayment payment = orderPaymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment record not found"));
        
        payment.setStatus(PaymentStatus.REJECTED);
        orderPaymentRepository.save(payment);

        // Notify user about rejection
        try {
            String mockUserEmail = "customer@example.com"; 
            emailService.sendRejectionEmail(mockUserEmail, payment.getOrderId(), reason);
        } catch (Exception e) {
            log.error("Failed to send email: " + e.getMessage());
        }
        
        return ResponseEntity.ok("Payment rejected for ID: " + id + ". Reason: " + reason);
    }

    @GetMapping("/{id}/payment-proof")
    public ResponseEntity<org.springframework.core.io.Resource> getPaymentProof(@PathVariable Long id) {
        OrderPayment payment = orderPaymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment record not found"));
        
        try {
            java.nio.file.Path filePath = java.nio.file.Paths.get(payment.getStoragePath());
            org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(filePath.toUri());
            
            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(org.springframework.http.HttpHeaders.CONTENT_TYPE, payment.getFileType())
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (java.net.MalformedURLException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
