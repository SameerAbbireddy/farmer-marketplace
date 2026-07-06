-- Create database
CREATE DATABASE farmer_marketplace_auth;

-- Select database
USE farmer_marketplace_auth;

-- =====================================
-- 1. CREATE TABLES
-- =====================================

-- Main users table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    role VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Farmers table
CREATE TABLE farmers (
    farmer_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    farm_name VARCHAR(100),
    farm_location VARCHAR(100),
    certifications VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Consumers table
CREATE TABLE consumers (
    consumer_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    address VARCHAR(255),
    preferred_payment_method VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Products table
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT,
    name VARCHAR(100),
    category VARCHAR(50),
    unit VARCHAR(20),
    price DECIMAL(10,2),
    stock_quantity INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES farmers(farmer_id)
);

-- Orders table
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    consumer_id INT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50),
    total_amount DECIMAL(10,2),
    FOREIGN KEY (consumer_id) REFERENCES consumers(consumer_id)
);

-- Order items table
CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT,
    price_at_purchase DECIMAL(10,2),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Payments table
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50),
    paid_at TIMESTAMP NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

-- =====================================
-- 2. INSERT SAMPLE DATA
-- =====================================

-- Insert users
INSERT INTO users (name, email, phone, role) VALUES
('Ramesh Kumar', 'ramesh@gmail.com', '9876543210', 'Farmer'),
('Sita Devi', 'sita@gmail.com', '9876543211', 'Farmer'),
('Arjun Rao', 'arjun@gmail.com', '9876543212', 'Consumer'),
('Priya Sharma', 'priya@gmail.com', '9876543213', 'Consumer'),
('Kiran Reddy', 'kiran@gmail.com', '9876543214', 'Farmer'),
('Neha Singh', 'neha@gmail.com', '9876543215', 'Consumer');

-- Insert farmers
INSERT INTO farmers (user_id, farm_name, farm_location, certifications) VALUES
(1, 'Green Valley Farms', 'Guntur', 'Organic Certified'),
(2, 'Fresh Roots Farm', 'Vijayawada', 'Natural Farming'),
(5, 'Sunrise Agro Farm', 'Mangalagiri', 'FSSAI Certified');

-- Insert consumers
INSERT INTO consumers (user_id, address, preferred_payment_method) VALUES
(3, 'Benz Circle, Vijayawada', 'UPI'),
(4, 'Tadepalli, Guntur', 'Card'),
(6, 'Mangalagiri Main Road', 'Cash');

-- Insert products
INSERT INTO products (farmer_id, name, category, unit, price, stock_quantity, is_active) VALUES
(1, 'Tomato', 'Vegetable', 'kg', 30.00, 100, TRUE),
(1, 'Brinjal', 'Vegetable', 'kg', 40.00, 80, TRUE),
(2, 'Mango', 'Fruit', 'dozen', 120.00, 50, TRUE),
(2, 'Banana', 'Fruit', 'dozen', 60.00, 70, TRUE),
(3, 'Carrot', 'Vegetable', 'kg', 50.00, 90, TRUE),
(3, 'Milk', 'Dairy', 'liter', 55.00, 40, TRUE);

-- Insert orders
INSERT INTO orders (consumer_id, status, total_amount) VALUES
(1, 'Delivered', 150.00),
(2, 'Pending', 220.00),
(3, 'Delivered', 110.00),
(1, 'Shipped', 180.00),
(2, 'Delivered', 90.00);

-- Insert order items
INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES
(1, 1, 2, 30.00),
(1, 4, 1, 60.00),
(2, 3, 1, 120.00),
(2, 5, 2, 50.00),
(3, 6, 2, 55.00),
(4, 2, 2, 40.00),
(4, 5, 2, 50.00),
(5, 1, 3, 30.00);

-- Insert payments
INSERT INTO payments (order_id, payment_method, payment_status, paid_at) VALUES
(1, 'UPI', 'Paid', '2026-04-03 09:05:00'),
(2, 'Card', 'Pending', NULL),
(3, 'Cash', 'Paid', '2026-04-03 10:05:00'),
(4, 'UPI', 'Paid', '2026-04-04 11:05:00'),
(5, 'Card', 'Paid', '2026-04-04 11:35:00');

-- =====================================
-- 3. JOIN QUERIES
-- =====================================

-- Orders with consumer names
SELECT 
    o.order_id,
    u.name AS consumer,
    o.total_amount
FROM orders o
JOIN consumers c ON o.consumer_id = c.consumer_id
JOIN users u ON c.user_id = u.user_id
LIMIT 10;

-- Products with farmer names
SELECT 
    p.product_id,
    p.name AS product,
    u.name AS farmer
FROM products p
JOIN farmers f ON p.farmer_id = f.farmer_id
JOIN users u ON f.user_id = u.user_id
LIMIT 10;

-- Order details
SELECT 
    o.order_id,
    p.name AS product,
    oi.quantity
FROM order_items oi
JOIN orders o ON oi.order_id = o.order_id
JOIN products p ON oi.product_id = p.product_id
LIMIT 10;

-- Payments with order amount
SELECT 
    p.payment_id,
    o.total_amount,
    p.payment_status
FROM payments p
JOIN orders o ON p.order_id = o.order_id
LIMIT 10;

-- Consumer purchase history
SELECT 
    u.name AS consumer,
    p.name AS product
FROM users u
JOIN consumers c ON u.user_id = c.user_id
JOIN orders o ON c.consumer_id = o.consumer_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
LIMIT 10;

-- =====================================
-- 4. AGGREGATE QUERIES
-- =====================================

-- Total users
SELECT COUNT(*) AS total_users 
FROM users;

-- Average product price
SELECT AVG(price) AS avg_price 
FROM products;

-- Total revenue
SELECT SUM(total_amount) AS total_revenue 
FROM orders;

-- Maximum order value
SELECT MAX(total_amount) AS max_order 
FROM orders;

-- Orders per consumer
SELECT 
    consumer_id,
    COUNT(*) AS total_orders
FROM orders
GROUP BY consumer_id
LIMIT 10;

-- =====================================
-- 5. SUBQUERY QUERIES
-- =====================================

-- Products above average price
SELECT name, price
FROM products
WHERE price > (
    SELECT AVG(price) FROM products
)
LIMIT 10;

-- Consumers who placed orders
SELECT name
FROM users
WHERE user_id IN (
    SELECT user_id
    FROM consumers
    WHERE consumer_id IN (
        SELECT consumer_id FROM orders
    )
)
LIMIT 10;

-- Highest spending consumer
SELECT consumer_id
FROM orders
GROUP BY consumer_id
ORDER BY SUM(total_amount) DESC
LIMIT 1;

-- Products never ordered
SELECT name
FROM products
WHERE product_id NOT IN (
    SELECT product_id FROM order_items
)
LIMIT 10;

-- Orders above average value
SELECT order_id, total_amount
FROM orders
WHERE total_amount > (
    SELECT AVG(total_amount) FROM orders
)
LIMIT 10;