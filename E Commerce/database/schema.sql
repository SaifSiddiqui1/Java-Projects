-- Create database
CREATE DATABASE ecommerce;

-- Connect to the database
\c ecommerce;

-- Create products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500),
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

-- Insert sample data
INSERT INTO products (name, description, price, image_url, stock_quantity) VALUES
('Wireless Headphones', 'High-quality wireless headphones with noise cancellation', 99.99, '🎧', 50),
('Smartphone', 'Latest smartphone with advanced features and great camera', 599.99, '📱', 30),
('Laptop', 'Powerful laptop for work and gaming', 999.99, '💻', 20),
('Smart Watch', 'Feature-rich smartwatch with health monitoring', 199.99, '⌚', 40),
('Tablet', 'Versatile tablet for entertainment and work', 399.99, '📱', 25),
('Gaming Console', 'Next-gen gaming console with 4K support', 499.99, '🎮', 15);

-- Create indexes
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);