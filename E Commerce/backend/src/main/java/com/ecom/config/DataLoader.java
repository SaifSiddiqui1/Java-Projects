package com.ecommerce.config;

import com.ecommerce.model.Product;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        // Add sample products if database is empty
        if (productRepository.count() == 0) {
            productRepository.save(new Product(
                "Wireless Headphones", 
                "High-quality wireless headphones with noise cancellation", 
                99.99, 
                "🎧", 
                50
            ));
            
            productRepository.save(new Product(
                "Smartphone", 
                "Latest smartphone with advanced features and great camera", 
                599.99, 
                "📱", 
                30
            ));
            
            productRepository.save(new Product(
                "Laptop", 
                "Powerful laptop for work and gaming", 
                999.99, 
                "💻", 
                20
            ));
            
            productRepository.save(new Product(
                "Smart Watch", 
                "Feature-rich smartwatch with health monitoring", 
                199.99, 
                "⌚", 
                40
            ));
            
            productRepository.save(new Product(
                "Tablet", 
                "Versatile tablet for entertainment and work", 
                399.99, 
                "📱", 
                25
            ));
            
            productRepository.save(new Product(
                "Gaming Console", 
                "Next-gen gaming console with 4K support", 
                499.99, 
                "🎮", 
                15
            ));
            
            System.out.println("Sample products loaded successfully! H2 Database is ready.");
        }
    }
}