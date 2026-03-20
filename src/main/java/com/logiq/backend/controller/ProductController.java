package com.logiq.backend.controller;

import com.logiq.backend.model.Category;
import com.logiq.backend.model.Product;
import com.logiq.backend.repository.ProductRepository;
import com.logiq.backend.service.WarrantyService;
import com.logiq.backend.dto.WarrantyInfoResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;
    private final WarrantyService warrantyService;

    @GetMapping
    public ResponseEntity<Page<Product>> getProducts(
            @RequestParam(required = false) Category category,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<Product> products = productRepository.findByCategoryAndSearch(category, search, PageRequest.of(page, size));
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}/warranty-check")
    public ResponseEntity<WarrantyInfoResponse> getWarrantyStatus(
            @PathVariable Long id,
            @RequestParam String purchaseDate) {
        
        java.time.LocalDate date = java.time.LocalDate.parse(purchaseDate);
        return ResponseEntity.ok(warrantyService.calculateWarranty(id, date));
    }
}
