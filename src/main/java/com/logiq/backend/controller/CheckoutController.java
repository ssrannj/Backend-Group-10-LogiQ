package com.logiq.backend.controller;

import com.logiq.backend.model.OrderPayment;
import com.logiq.backend.repository.OrderPaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.UUID;

import com.logiq.backend.model.PaymentStatus;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/orders/checkout")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class CheckoutController {

    private final OrderPaymentRepository orderPaymentRepository;

    @Value("${upload.path:./uploads/receipts}")
    private String uploadPath;

    @PostMapping("/bank-transfer")
    public ResponseEntity<?> uploadBankTransferProof(
            @RequestParam("orderId") Long orderId,
            @RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select a file to upload");
        }

        // Simple validation for PDF or Images
        String contentType = file.getContentType();
        if (contentType == null || (!contentType.startsWith("image/") && !contentType.equals("application/pdf"))) {
            return ResponseEntity.badRequest().body("Only images and PDF files are allowed");
        }

        try {
            // Ensure directory exists
            Path root = Paths.get(uploadPath);
            if (!Files.exists(root)) {
                Files.createDirectories(root);
                log.info("Created upload directory: " + root.toAbsolutePath());
            }

            // Generate unique filename
            String originalFileName = file.getOriginalFilename();
            String extension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String uniqueFileName = UUID.randomUUID().toString() + extension;
            
            Path targetPath = root.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            log.info("Uploaded file for order ID {}: {}", orderId, uniqueFileName);

            // Record in Database
            OrderPayment payment = OrderPayment.builder()
                    .orderId(orderId)
                    .fileName(uniqueFileName)
                    .fileType(contentType)
                    .storagePath(targetPath.toString())
                    .status(PaymentStatus.VERIFYING_ORDER)
                    .uploadTime(LocalDateTime.now())
                    .build();

            orderPaymentRepository.save(payment);

            return ResponseEntity.ok("Successfully uploaded and waiting for verification. Reference ID: " + payment.getId());

        } catch (IOException e) {
            log.error("Failed to upload file for order ID {}: {}", orderId, e.getMessage());
            return ResponseEntity.internalServerError().body("Failed to upload file: " + e.getMessage());
        }
    }
}
