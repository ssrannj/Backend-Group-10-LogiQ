package com.logiq.backend.config;

import com.logiq.backend.model.Category;
import com.logiq.backend.model.Product;
import com.logiq.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final ProductRepository productRepository;

    @Bean
    public CommandLineRunner seedData() {
        return args -> {
            if (productRepository.count() == 0) {
                List<Product> products = Arrays.asList(
                    // SOFAS
                    createProduct("Luxury Velvet Sofa", "Elegant 3-seater sofa with velvet finish", 899.99, "sofa1.jpg", Category.SOFA, 24),
                    createProduct("Modern Leather Couch", "Sleek black leather sofa for modern living rooms", 1200.00, "sofa2.jpg", Category.SOFA, 36),
                    createProduct("Corner Fabric Sectional", "Spacious L-shaped sofa with grey fabric", 750.50, "sofa3.jpg", Category.SOFA, 12),
                    createProduct("Classic Chesterfield", "Vintage tufted leather sofa", 1500.00, "sofa4.jpg", Category.SOFA, 24),
                    
                    // BEDS
                    createProduct("King Size Oak Bed", "Solid oak wood bed frame with headboard", 650.00, "bed1.jpg", Category.BED, 60),
                    createProduct("Queen Platform Bed", "Minimalist platform bed with metal frame", 350.99, "bed2.jpg", Category.BED, 24),
                    createProduct("Upholstered Storage Bed", "Bed with built-in drawers and fabric headboard", 550.00, "bed3.jpg", Category.BED, 12),
                    createProduct("Single Guest Bed", "Foldable single bed for guests", 120.00, "bed4.jpg", Category.BED, 6),
                    
                    // TABLES
                    createProduct("Dining Room Oak Table", "Large dining table for 8 people", 450.00, "table1.jpg", Category.TABLE, 24),
                    createProduct("Glass Coffee Table", "Modern glass top table with wooden legs", 150.00, "table2.jpg", Category.TABLE, 12),
                    createProduct("Study Desk", "Ergonomic desk for home office", 220.00, "table3.jpg", Category.TABLE, 24),
                    createProduct("Round Marble Table", "Luxury marble top side table", 300.00, "table4.jpg", Category.TABLE, 36),
                    
                    // CHAIRS
                    createProduct("Ergonomic Office Chair", "Adjustable chair with lumbar support", 180.00, "chair1.jpg", Category.CHAIR, 24),
                    createProduct("Velvet Dining Chair", "Set of 2 elegant dining chairs", 120.00, "chair2.jpg", Category.CHAIR, 12),
                    createProduct("Leather Recliner", "Comfortable recliner with footrest", 250.00, "chair3.jpg", Category.CHAIR, 24),
                    createProduct("Wooden Accent Chair", "Traditional wooden chair with cushion", 90.00, "chair4.jpg", Category.CHAIR, 12),
                    
                    // CUPBOARDS
                    createProduct("Wooden Wardrobe", "3-door wardrobe with mirror", 400.00, "cupboard1.jpg", Category.CUPBOARD, 36),
                    createProduct("Slim Kitchen Cabinet", "Space-saving cabinet for kitchen", 150.00, "cupboard2.jpg", Category.CUPBOARD, 12),
                    createProduct("Modern Bookshelf", "Open shelf cupboard for books and decor", 200.00, "cupboard3.jpg", Category.CUPBOARD, 24),
                    createProduct("Sideboard Buffet", "Elegant sideboard for dining room storage", 320.00, "cupboard4.jpg", Category.CUPBOARD, 24)
                );
                productRepository.saveAll(products);
                System.out.println("Seeded 20 furniture products into the database.");
            }
        };
    }

    private Product createProduct(String name, String desc, double price, String img, Category cat, int warranty) {
        return Product.builder()
                .name(name)
                .description(desc)
                .price(BigDecimal.valueOf(price))
                .imageUrl(img)
                .category(cat)
                .inStock(true)
                .warrantyPeriodMonths(warranty)
                .build();
    }
}
