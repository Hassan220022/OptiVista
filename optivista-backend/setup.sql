DROP TABLE IF EXISTS user_preferences;
DROP TABLE IF EXISTS shopping_cart_items;
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS ar_models;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS product_categories;
DROP TABLE IF EXISTS users;

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    firstName VARCHAR(50),
    lastName VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    role ENUM('admin', 'seller', 'customer') DEFAULT 'customer',
    status ENUM('active', 'suspended') DEFAULT 'active',
    phoneNumber VARCHAR(20),
    address TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Product Categories table
CREATE TABLE IF NOT EXISTS product_categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parentId VARCHAR(36),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parentId) REFERENCES product_categories(id) ON DELETE CASCADE
);

-- Create Products table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0.00,
    categoryId VARCHAR(36),
    sellerId VARCHAR(36),
    brand VARCHAR(100),
    model VARCHAR(100),
    material VARCHAR(100),
    frameShape VARCHAR(50),
    frameColor VARCHAR(50),
    lensColor VARCHAR(50),
    gender ENUM('men', 'women', 'unisex'),
    size VARCHAR(10),
    weight DECIMAL(5,2),
    stock INT DEFAULT 0,
    status ENUM('active', 'inactive', 'out_of_stock') DEFAULT 'active',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoryId) REFERENCES product_categories(id),
    FOREIGN KEY (sellerId) REFERENCES users(id)
);

-- Create Product Images table
CREATE TABLE IF NOT EXISTS product_images (
    id VARCHAR(36) PRIMARY KEY,
    productId VARCHAR(36) NOT NULL,
    imageUrl VARCHAR(255) NOT NULL,
    isPrimary BOOLEAN DEFAULT FALSE,
    sortOrder INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);

-- Create AR Models table for 3D assets
CREATE TABLE IF NOT EXISTS ar_models (
    id VARCHAR(36) PRIMARY KEY,
    productId VARCHAR(36) NOT NULL,
    modelUrl VARCHAR(255) NOT NULL,
    thumbnailUrl VARCHAR(255),
    fileFormat VARCHAR(20),
    fileSize INT,
    version VARCHAR(20),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);

-- Create Orders table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(36) PRIMARY KEY,
    userId VARCHAR(36) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    totalAmount DECIMAL(10,2) NOT NULL,
    shippingAddress TEXT,
    billingAddress TEXT,
    paymentMethod VARCHAR(50),
    paymentStatus ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    trackingNumber VARCHAR(100),
    notes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
);

-- Create Order Items table
CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(36) PRIMARY KEY,
    orderId VARCHAR(36) NOT NULL,
    productId VARCHAR(36) NOT NULL,
    sellerId VARCHAR(36) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0.00,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id),
    FOREIGN KEY (sellerId) REFERENCES users(id)
);

-- Create Feedback table
CREATE TABLE IF NOT EXISTS feedback (
    id VARCHAR(36) PRIMARY KEY,
    userId VARCHAR(36) NOT NULL,
    productId VARCHAR(36) NOT NULL,
    rating DECIMAL(2,1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    arExperienceRating DECIMAL(2,1) CHECK (arExperienceRating >= 1 AND arExperienceRating <= 5),
    arExperienceReview TEXT,
    isVerifiedPurchase BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);

-- Create Shopping Cart Items table
CREATE TABLE IF NOT EXISTS shopping_cart_items (
    id VARCHAR(36) PRIMARY KEY,
    userId VARCHAR(36) NOT NULL,
    productId VARCHAR(36) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    addedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY (userId, productId)
);

-- Create User Preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    id VARCHAR(36) PRIMARY KEY,
    userId VARCHAR(36) NOT NULL,
    preferredFrameShape VARCHAR(50),
    preferredFrameColor VARCHAR(50),
    preferredBrands TEXT,
    faceMeasurements TEXT,
    arSettings TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample data

-- Users: Admin, sellers, and customers
INSERT INTO users (id, firstName, lastName, email, password, role, status) VALUES 
('1', 'Admin', 'User', 'admin@optivista.com', '$2b$10$w9OaZ9WzurKJSXX3elQoA.F1RZlJmw67fHhYCSN0sQ9H1Z9z2P3S2', 'admin', 'active'),
('2', 'John', 'Seller', 'john.seller@optivista.com', '$2b$10$jHkYkm/fvTN3C2TKjnEJje5HdwTLYE8NJsZygP7PqTSm/JQlzOjM2', 'seller', 'active'),
('3', 'Jane', 'Seller', 'jane.seller@optivista.com', '$2b$10$Fx7P9Cq.N2XCK1PXczO2puMILJPP1Jb6/6N3d4lEjwcT.7fgqwXVe', 'seller', 'active'),
('4', 'Alice', 'Customer', 'alice@example.com', '$2b$10$hITK.KlU9Yc5JLKVn4vmCeYKURLYJ1VV/6rIQJLNfuLrwjqJe8cou', 'customer', 'active'),
('5', 'Bob', 'Customer', 'bob@example.com', '$2b$10$NpQpPQzYWio52fJpJ27FEOGWekiMkd1vOTM5uNP8l7XVZRERdLJ02', 'customer', 'active'),
('6', 'Charlie', 'Customer', 'charlie@example.com', '$2b$10$GZxGIrvPfQZ0hDJO/Yq9AuLly1UYwHQvS9cXrJt/MXl9.44ZXddsq', 'customer', 'active'),
('7', 'Diana', 'Customer', 'diana@example.com', '$2b$10$WaNf5vMYkvB7WWZvzz.Z2eZFLh2n93XZgGZhkbTN0WImqDK5q1Lg.', 'customer', 'active');

-- Product Categories
INSERT INTO product_categories (id, name, description) VALUES
('1', 'Sunglasses', 'Protective eyewear designed to prevent bright sunlight from damaging the eyes'),
('2', 'Prescription Glasses', 'Corrective eyewear designed to improve visual acuity'),
('3', 'Contact Lenses', 'Thin lenses placed directly on the surface of the eyes'),
('4', 'Eyewear Accessories', 'Items related to eyewear maintenance and storage');

-- Subcategories
INSERT INTO product_categories (id, name, description, parentId) VALUES
('5', 'Aviator', 'Thin metal frames with a double bridge and teardrop-shaped lenses', '1'),
('6', 'Wayfarer', 'Trapezoidal frames made of plastic', '1'),
('7', 'Round', 'Circular frames with a vintage look', '2'),
('8', 'Rectangle', 'Rectangular frames for a professional look', '2'),
('9', 'Daily Disposable', 'Contact lenses designed to be worn once then thrown away', '3'),
('10', 'Monthly Disposable', 'Contact lenses designed to last for a month with proper care', '3'),
('11', 'Cases', 'Storage cases for eyewear', '4'),
('12', 'Cleaning Kits', 'Products for cleaning and maintaining eyewear', '4');

-- Products (Sunglasses)
INSERT INTO products (id, name, description, price, categoryId, sellerId, brand, model, material, frameShape, frameColor, lensColor, gender, size, stock, status) VALUES
('1', 'Ray-Ban Aviator Classic', 'The iconic Ray-Ban Aviator with gold frames and green lenses', 149.99, '5', '2', 'Ray-Ban', 'Aviator Classic', 'Metal', 'Aviator', 'Gold', 'Green', 'unisex', 'Medium', 50, 'active'),
('2', 'Oakley Holbrook', 'Sporty sunglasses with square frame and polarized lenses', 129.99, '6', '2', 'Oakley', 'Holbrook', 'Plastic', 'Square', 'Black', 'Black', 'men', 'Large', 45, 'active'),
('3', 'Gucci Square Frame', 'Luxury square frame sunglasses with Gucci logo', 299.99, '1', '3', 'Gucci', 'GG0022S', 'Acetate', 'Square', 'Tortoise', 'Brown', 'women', 'Medium', 25, 'active'),
('4', 'Tom Ford Aviator', 'Designer aviator sunglasses with gradient lenses', 359.99, '5', '3', 'Tom Ford', 'FT0497', 'Metal', 'Aviator', 'Gold', 'Blue', 'unisex', 'Medium', 30, 'active');

-- Products (Prescription Glasses)
INSERT INTO products (id, name, description, price, categoryId, sellerId, brand, model, material, frameShape, frameColor, gender, size, stock, status) VALUES
('5', 'Warby Parker Percey', 'Stylish round eyeglasses in crystal clear acetate', 95.00, '7', '2', 'Warby Parker', 'Percey', 'Acetate', 'Round', 'Crystal', 'unisex', 'Medium', 60, 'active'),
('6', 'Ray-Ban RX5154', 'Classic clubmaster style prescription glasses', 179.99, '2', '2', 'Ray-Ban', 'RX5154', 'Metal/Acetate', 'Clubmaster', 'Black', 'unisex', 'Medium', 40, 'active'),
('7', 'Prada PR 10XV', 'Luxury rectangular frame glasses', 320.00, '8', '3', 'Prada', 'PR 10XV', 'Acetate', 'Rectangle', 'Tortoise', 'women', 'Small', 20, 'active'),
('8', 'Hugo Boss 0680', 'Professional rectangular metal frame glasses', 250.00, '8', '3', 'Hugo Boss', '0680', 'Metal', 'Rectangle', 'Silver', 'men', 'Large', 35, 'active');

-- Products (Contact Lenses and Accessories)
INSERT INTO products (id, name, description, price, categoryId, sellerId, brand, model, gender, stock, status) VALUES
('9', 'Acuvue Oasys 1-Day', 'Daily disposable contact lenses with HydraLuxe technology', 65.99, '9', '2', 'Acuvue', 'Oasys 1-Day', 'unisex', 100, 'active'),
('10', 'Air Optix Night & Day', 'Monthly contact lenses for continuous wear', 45.99, '10', '2', 'Alcon', 'Air Optix Night & Day', 'unisex', 80, 'active'),
('11', 'Eyewear Case - Premium', 'Hard shell case with microfiber interior', 19.99, '11', '3', 'OptiVista', 'Premium Case', 'unisex', 120, 'active'),
('12', 'Lens Cleaning Kit', 'Complete kit with solution, cloth, and spray', 14.99, '12', '3', 'OptiVista', 'Cleaning Pro', 'unisex', 150, 'active');

-- Product Images
INSERT INTO product_images (id, productId, imageUrl, isPrimary) VALUES
('1', '1', '/images/products/rayban_aviator_1.jpg', TRUE),
('2', '1', '/images/products/rayban_aviator_2.jpg', FALSE),
('3', '2', '/images/products/oakley_holbrook_1.jpg', TRUE),
('4', '2', '/images/products/oakley_holbrook_2.jpg', FALSE),
('5', '3', '/images/products/gucci_square_1.jpg', TRUE),
('6', '4', '/images/products/tomford_aviator_1.jpg', TRUE),
('7', '5', '/images/products/warby_percey_1.jpg', TRUE),
('8', '6', '/images/products/rayban_clubmaster_1.jpg', TRUE),
('9', '7', '/images/products/prada_rectangle_1.jpg', TRUE),
('10', '8', '/images/products/hugoboss_rectangle_1.jpg', TRUE),
('11', '9', '/images/products/acuvue_oasys_1.jpg', TRUE),
('12', '10', '/images/products/airoptix_monthly_1.jpg', TRUE),
('13', '11', '/images/products/case_premium_1.jpg', TRUE),
('14', '12', '/images/products/cleaning_kit_1.jpg', TRUE);

-- AR Models
INSERT INTO ar_models (id, productId, modelUrl, thumbnailUrl, fileFormat, fileSize) VALUES
('1', '1', '/models/rayban_aviator.glb', '/thumbnails/rayban_aviator_model.jpg', 'GLB', 2048),
('2', '2', '/models/oakley_holbrook.glb', '/thumbnails/oakley_holbrook_model.jpg', 'GLB', 1856),
('3', '3', '/models/gucci_square.glb', '/thumbnails/gucci_square_model.jpg', 'GLB', 2240),
('4', '4', '/models/tomford_aviator.glb', '/thumbnails/tomford_aviator_model.jpg', 'GLB', 1920),
('5', '5', '/models/warby_percey.glb', '/thumbnails/warby_percey_model.jpg', 'GLB', 1680),
('6', '6', '/models/rayban_clubmaster.glb', '/thumbnails/rayban_clubmaster_model.jpg', 'GLB', 1792),
('7', '7', '/models/prada_rectangle.glb', '/thumbnails/prada_rectangle_model.jpg', 'GLB', 1536),
('8', '8', '/models/hugoboss_rectangle.glb', '/thumbnails/hugoboss_rectangle_model.jpg', 'GLB', 1664);

-- Orders
INSERT INTO orders (id, userId, status, totalAmount, shippingAddress, paymentMethod, paymentStatus) VALUES
('1', '4', 'delivered', 149.99, '123 Main St, Anytown, USA', 'Credit Card', 'paid'),
('2', '5', 'shipped', 129.99, '456 Oak Ave, Somewhere, USA', 'PayPal', 'paid'),
('3', '6', 'processing', 299.99, '789 Pine Rd, Elsewhere, USA', 'Credit Card', 'paid'),
('4', '7', 'pending', 359.99, '101 Elm St, Nowhere, USA', 'Credit Card', 'pending'),
('5', '4', 'delivered', 95.00, '123 Main St, Anytown, USA', 'Credit Card', 'paid'),
('6', '5', 'cancelled', 179.99, '456 Oak Ave, Somewhere, USA', 'PayPal', 'paid');

-- Order Items
INSERT INTO order_items (id, orderId, productId, sellerId, quantity, price) VALUES
('1', '1', '1', '2', 1, 149.99),
('2', '2', '2', '2', 1, 129.99),
('3', '3', '3', '3', 1, 299.99),
('4', '4', '4', '3', 1, 359.99),
('5', '5', '5', '2', 1, 95.00),
('6', '6', '6', '2', 1, 179.99);

-- Feedback
INSERT INTO feedback (id, userId, productId, rating, review, arExperienceRating, arExperienceReview, isVerifiedPurchase) VALUES
('1', '4', '1', 5.0, 'Perfect fit and great quality!', 4.5, 'The AR try-on was pretty accurate.', TRUE),
('2', '5', '2', 4.5, 'Good sunglasses for sports activities.', 4.0, 'AR experience was good but could be better.', TRUE),
('3', '6', '3', 5.0, 'Luxury quality, worth every penny.', 5.0, 'AR try-on was incredibly realistic!', TRUE),
('4', '7', '5', 4.0, 'Nice frames, good value for money.', 3.5, 'AR feature had some alignment issues.', FALSE),
('5', '4', '6', 4.5, 'Classic style, fits well.', 4.0, 'AR was helpful in deciding on the size.', TRUE);

-- Shopping Cart Items
INSERT INTO shopping_cart_items (id, userId, productId, quantity) VALUES
('1', '4', '7', 1),
('2', '5', '8', 1),
('3', '6', '11', 2),
('4', '7', '12', 1);

-- User Preferences
INSERT INTO user_preferences (id, userId, preferredFrameShape, preferredFrameColor, preferredBrands, faceMeasurements, arSettings) VALUES
('1', '4', 'Aviator', 'Gold', 'Ray-Ban,Gucci', '{"pupillaryDistance": 62, "faceWidth": 140}', '{"enableHighRes": true}'),
('2', '5', 'Square', 'Black', 'Oakley,Ray-Ban', '{"pupillaryDistance": 64, "faceWidth": 145}', '{"enableHighRes": false}'),
('3', '6', 'Round', 'Tortoise', 'Warby Parker,Prada', '{"pupillaryDistance": 60, "faceWidth": 135}', '{"enableHighRes": true}'),
('4', '7', 'Rectangle', 'Silver', 'Hugo Boss,Tom Ford', '{"pupillaryDistance": 63, "faceWidth": 142}', '{"enableHighRes": true}'); 