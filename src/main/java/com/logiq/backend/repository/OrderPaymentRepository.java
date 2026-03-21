package com.logiq.backend.repository;

import com.logiq.backend.model.OrderPayment;
import com.logiq.backend.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderPaymentRepository extends JpaRepository<OrderPayment, Long> {
    Optional<OrderPayment> findByOrderId(Long orderId);
    List<OrderPayment> findByStatus(PaymentStatus status);
}
