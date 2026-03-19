package com.logiq.backend.controller;

import com.logiq.backend.model.OrderPayment;
import com.logiq.backend.model.PaymentStatus;
import com.logiq.backend.repository.OrderPaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final OrderPaymentRepository orderPaymentRepository;

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
        
        return ResponseEntity.ok("Payment verified and order is now PROCESSING. ID: " + id);
    }
}
