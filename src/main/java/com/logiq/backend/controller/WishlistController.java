package com.logiq.backend.controller;

import com.logiq.backend.dto.WishlistResponse;
import com.logiq.backend.model.Product;
import com.logiq.backend.model.User;
import com.logiq.backend.model.WishlistItem;
import com.logiq.backend.repository.ProductRepository;
import com.logiq.backend.repository.UserRepository;
import com.logiq.backend.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    // Temporary method to get current user until full auth wiring is verified
    private User getCurrentUser() {
        // For development/test, we'll pick the first user or return null
        return userRepository.findAll().stream().findFirst().orElse(null);
    }

    @GetMapping("/my")
    public ResponseEntity<List<WishlistResponse>> getMyWishlist() {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).build();

        List<WishlistResponse> wishlist = wishlistRepository.findByUser(user).stream()
                .map(item -> WishlistResponse.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .productDescription(item.getProduct().getDescription())
                        .price(item.getProduct().getPrice())
                        .imageUrl(item.getProduct().getImageUrl())
                        .category(item.getProduct().getCategory())
                        .inStock(item.getProduct().isInStock())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(wishlist);
    }

    @PostMapping
    public ResponseEntity<?> addToWishlist(@RequestParam Long productId) {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).body("User not authenticated");

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (wishlistRepository.findByUserAndProduct(user, product).isPresent()) {
            return ResponseEntity.badRequest().body("Product already in wishlist");
        }

        WishlistItem item = WishlistItem.builder()
                .user(user)
                .product(product)
                .build();
        
        wishlistRepository.save(item);
        return ResponseEntity.ok("Added to wishlist");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long id) {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).build();

        WishlistItem item = wishlistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Wishlist item not found"));

        if (!item.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Not authorized to remove this item");
        }

        wishlistRepository.delete(item);
        return ResponseEntity.ok("Removed from wishlist");
    }
}
