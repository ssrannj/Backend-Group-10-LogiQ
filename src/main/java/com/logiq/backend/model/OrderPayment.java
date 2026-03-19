package com.logiq.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "order_payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderPayment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long orderId;

    private String fileName;
    
    private String fileType;
    
    private String storagePath;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    private LocalDateTime uploadTime;
}
