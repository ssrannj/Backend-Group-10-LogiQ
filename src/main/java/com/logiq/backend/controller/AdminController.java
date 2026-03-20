package com.logiq.backend.controller;

import com.logiq.backend.model.OrderPayment;
import com.logiq.backend.model.PaymentStatus;
import com.logiq.backend.repository.OrderPaymentRepository;
import com.logiq.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AdminController {

    private final OrderPaymentRepository orderPaymentRepository;
    private final EmailService emailService;

    @GetMapping("/verifying")
    public ResponseEntity<List<OrderPayment>> getVerifyingOrders() {
        return ResponseEntity.ok(orderPaymentRepository.findByStatus(PaymentStatus.VERIFYING_ORDER));
    }

    @PostMapping("/{id}/verify-payment")
    public ResponseEntity<?> verifyPayment(@PathVariable Long id) {
        OrderPayment payment = orderPaymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment record not found"));
        
        payment.setStatus(PaymentStatus.PROCESSING);
        orderPaymentRepository.save(payment);

        // Simple Email Notification
        try {
            String mockUserEmail = "customer@example.com"; 
            emailService.sendEmail(
                mockUserEmail, 
                "Order Update: Payment Verified", 
                "Your payment for order #" + payment.getOrderId() + " has been verified. Your order is now being processed."
            );
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
        
        return ResponseEntity.ok("Payment verified and order is now PROCESSING. ID: " + id);
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
            emailService.sendEmail(
                mockUserEmail, 
                "Order Update: Payment Rejected", 
                "Your payment for order #" + payment.getOrderId() + " was rejected. Reason: " + reason
            );
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
        
        return ResponseEntity.ok("Payment rejected for ID: " + id);
    }
}
