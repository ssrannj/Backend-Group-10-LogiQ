package com.logiq.backend.controller;

import com.logiq.backend.dto.WishlistResponse;
import com.logiq.backend.model.User;
import com.logiq.backend.repository.UserRepository;
import com.logiq.backend.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class WishlistController {

    private final WishlistService wishlistService;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        return userRepository.findAll().stream().findFirst().orElse(null);
    }

    @GetMapping("/my")
    public ResponseEntity<List<WishlistResponse>> getMyWishlist() {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).build();

        return ResponseEntity.ok(wishlistService.getUserWishlist(user));
    }

    @PostMapping
    public ResponseEntity<?> addToWishlist(@RequestParam Long productId) {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).body("User not authenticated");

        try {
            wishlistService.addToWishlist(user, productId);
            return ResponseEntity.ok("Added to wishlist");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long id) {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).build();

        try {
            wishlistService.removeFromWishlist(user, id);
            return ResponseEntity.ok("Removed from wishlist");
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }
}
