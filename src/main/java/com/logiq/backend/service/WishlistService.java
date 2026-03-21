package com.logiq.backend.service;

import com.logiq.backend.dto.WishlistResponse;
import com.logiq.backend.model.Product;
import com.logiq.backend.model.User;
import com.logiq.backend.model.WishlistItem;
import com.logiq.backend.repository.ProductRepository;
import com.logiq.backend.repository.UserRepository;
import com.logiq.backend.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public List<WishlistResponse> getUserWishlist(User user) {
        return wishlistRepository.findByUser(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void addToWishlist(User user, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (wishlistRepository.findByUserAndProduct(user, product).isPresent()) {
            throw new RuntimeException("Product already in wishlist");
        }

        WishlistItem item = WishlistItem.builder()
                .user(user)
                .product(product)
                .build();
        
        wishlistRepository.save(item);
    }

    public void removeFromWishlist(User user, Long id) {
        WishlistItem item = wishlistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Wishlist item not found"));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to remove this item");
        }

        wishlistRepository.delete(item);
    }

    private WishlistResponse mapToResponse(WishlistItem item) {
        Product p = item.getProduct();
        return WishlistResponse.builder()
                .id(item.getId())
                .productId(p.getId())
                .productName(p.getName())
                .productDescription(p.getDescription())
                .price(p.getPrice())
                .imageUrl(p.getImageUrl())
                .category(p.getCategory())
                .inStock(p.isInStock())
                .build();
    }
}
