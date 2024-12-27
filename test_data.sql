-- -------------------------------------------------------------------------
-- 0. Use the database
-- -------------------------------------------------------------------------
USE ecom_db;

-- -------------------------------------------------------------------------
-- 0.1. Disable Foreign Key Checks
-- -------------------------------------------------------------------------
SET FOREIGN_KEY_CHECKS = 0;

-- -------------------------------------------------------------------------
-- 1. Insert Test Data into categories
-- -------------------------------------------------------------------------
INSERT INTO categories (name, description) VALUES
    ('Sunglasses','Protective eyewear for sunlight.'),
    ('Reading Glasses','Eyewear for reading text at close range.'),
    ('Blue Light Glasses','Protect eyes from digital screens.'),
    ('Sports Glasses','Eyewear for sports activities.'),
    ('Designer Glasses','High-end fashion eyewear.');

-- -------------------------------------------------------------------------
-- 2. Insert Test Data into users
--    Roles: admin, customer, consultant
-- -------------------------------------------------------------------------
INSERT INTO users (username, email, password_hash, role, profile, preferences, auth_token, last_login) VALUES
    ('admin', 
     'admin@demo.com', 
     '$2y$10$dummyHashForAdmin', 
     'admin',
     '{"first_name":"Admin","last_name":"User"}',
     '{"theme":"dark"}',
     NULL,
     NULL
    ),
    ('consultant1',
     'consultant1@demo.com',
     '$2y$10$dummyHashForConsultant1',
     'consultant',
     '{"first_name":"Consultant","last_name":"One"}',
     '{"expertise":"Sunglasses"}',
     NULL,
     NULL
    ),
    ('consultant2',
     'consultant2@demo.com',
     '$2y$10$dummyHashForConsultant2',
     'consultant',
     '{"first_name":"Consultant","last_name":"Two"}',
     '{"expertise":"Reading Glasses"}',
     NULL,
     NULL
    ),
    ('alice',
     'alice@demo.com',
     '$2y$10$dummyHashForAlice',
     'customer',
     '{"first_name":"Alice","last_name":"Smith"}',
     '{"preferred_color":"black"}',
     NULL,
     NULL
    ),
    ('bob',
     'bob@demo.com',
     '$2y$10$dummyHashForBob',
     'customer',
     '{"first_name":"Bob","last_name":"Brown"}',
     '{"preferred_color":"silver"}',
     NULL,
     NULL
    ),
    ('charlie',
     'charlie@demo.com',
     '$2y$10$dummyHashForCharlie',
     'customer',
     '{"first_name":"Charlie","last_name":"Johnson"}',
     '{"preferred_color":"gold"}',
     NULL,
     NULL
    );

-- -------------------------------------------------------------------------
-- 3. Insert Test Data into pictures
--    References users (user_id)
-- -------------------------------------------------------------------------
INSERT INTO pictures (user_id, url, mime_type, file_size, metadata) VALUES
    (1, 'https://example.com/pic/admin_pic.jpg', 'image/jpeg', 2048, '{"description":"Admin profile pic"}'),
    (4, 'https://example.com/pic/alice_pic.jpg', 'image/jpeg', 1024, '{"description":"Alice profile pic"}');

-- -------------------------------------------------------------------------
-- 4. Insert Test Data into products
--    References categories (category_id)
-- -------------------------------------------------------------------------
INSERT INTO products (
    category_id,
    name,
    style,
    color,
    size,
    price,
    description,
    brand,
    ar_supported,
    stock,
    image_url,
    ar_model_url,
    frame_width,
    temple_length,
    lens_height,
    bridge_width,
    materials,
    available_colors
) VALUES
    (1, -- Sunglasses
     'Classic Aviator',
     'Aviator',
     'Gold',
     'Medium',
     99.99,
     'Classic aviator sunglasses',
     'Ray-Ban',
     TRUE,
     10,
     'https://example.com/img/aviator.jpg',
     'https://example.com/ar/aviator.glb',
     140,
     135,
     50,
     18,
     '["Metal"]',
     '["Gold","Silver"]'
    ),
    (1, -- Sunglasses
     'Wayfarer',
     'Wayfarer',
     'Tortoise',
     'Medium',
     89.99,
     'Popular style of sunglasses',
     'Ray-Ban',
     FALSE,
     15,
     'https://example.com/img/wayfarer.jpg',
     NULL,
     140,
     140,
     45,
     20,
     '["Plastic"]',
     '["Tortoise","Black"]'
    ),
    (2, -- Reading Glasses
     'Reading Glasses Model A',
     'Rectangle',
     'Black',
     'Small',
     29.99,
     'Basic reading glasses',
     'Generic',
     FALSE,
     30,
     'https://example.com/img/readA.jpg',
     NULL,
     130,
     135,
     35,
     18,
     '["Plastic"]',
     '["Black"]'
    ),
    (2, -- Reading Glasses
     'Reading Glasses Model B',
     'Round',
     'Blue',
     'Medium',
     35.50,
     'Round reading glasses',
     'Generic',
     FALSE,
     20,
     'https://example.com/img/readB.jpg',
     NULL,
     130,
     140,
     40,
     20,
     '["Metal"]',
     '["Blue","Silver"]'
    ),
    (3, -- Blue Light Glasses
     'Blue Light Blocker',
     'Wayfarer',
     'Black',
     'Medium',
     49.99,
     'Protects eyes from blue light',
     'Generic',
     TRUE,
     25,
     'https://example.com/img/bluelight.jpg',
     'https://example.com/ar/bluelight.glb',
     140,
     140,
     45,
     20,
     '["Plastic"]',
     '["Black"]'
    ),
    (5, -- Designer Glasses
     'Designer Luxury',
     'Cat-Eye',
     'Rose Gold',
     'Medium',
     199.99,
     'High-end designer glasses',
     'Gucci',
     FALSE,
     5,
     'https://example.com/img/luxury.jpg',
     NULL,
     140,
     140,
     45,
     20,
     '["Metal"]',
     '["Rose Gold"]'
    );

-- -------------------------------------------------------------------------
-- 5. Insert Test Data into orders
--    References users (user_id)
-- -------------------------------------------------------------------------
INSERT INTO orders (
    user_id,
    order_date,
    status,
    total_price,
    shipping_address,
    payment_method
) VALUES
    (4, -- alice
     NOW(),
     'pending',
     189.98,
     '123 Main St, Wonderland',
     'credit_card'
    ),
    (5, -- bob
     NOW(),
     'pending',
     49.99,
     '456 Elm St, Bobsville',
     'paypal'
    );

-- -------------------------------------------------------------------------
-- 6. Insert Test Data into order_items
--    References orders (order_id) and products (product_id)
-- -------------------------------------------------------------------------
-- Assuming the auto-increment IDs for orders above are 1 and 2.
INSERT INTO order_items (
    order_id,
    product_id,
    quantity,
    price
) VALUES
    (1, 1, 1, 99.99), -- Order #1, product #1 (Classic Aviator)
    (1, 2, 1, 89.99), -- Order #1, product #2 (Wayfarer)
    (2, 5, 1, 49.99); -- Order #2, product #5 (Blue Light Blocker)

-- -------------------------------------------------------------------------
-- 7. Insert Test Data into feedback
--    References users (user_id) and products (product_id)
-- -------------------------------------------------------------------------
INSERT INTO feedback (
    user_id,
    product_id,
    rating,
    review
) VALUES
    (4, 1, 5, 'Great sunglasses, loved them!'),
    (5, 5, 4, 'The blue light blocker helps with eye strain.');

-- -------------------------------------------------------------------------
-- 8. Insert Test Data into wishlist
--    References users (user_id) and products (product_id)
-- -------------------------------------------------------------------------
INSERT INTO wishlist (
    user_id,
    product_id
) VALUES
    (4, 5), -- Alice wishlists the Blue Light Blocker
    (5, 2), -- Bob wishlists the Wayfarer
    (6, 1); -- Charlie wishlists the Classic Aviator

-- -------------------------------------------------------------------------
-- 9. Insert Test Data into promotions
-- -------------------------------------------------------------------------
INSERT INTO promotions (
    name,
    description,
    discount_percentage,
    start_date,
    end_date
) VALUES
    ('Summer Sale',
     'Get 20% off all sunglasses',
     20.00,
     '2025-06-01',
     '2025-08-31'
    ),
    ('Holiday Special',
     '10% off on all frames for the holidays',
     10.00,
     '2025-12-01',
     '2025-12-31'
    );

-- -------------------------------------------------------------------------
-- 10. Insert Test Data into ar_sessions
--     References users (user_id) and products (product_id)
-- -------------------------------------------------------------------------
INSERT INTO ar_sessions (
    user_id,
    product_id,
    snapshots,
    session_metadata
) VALUES
    (4, 1, '["snapshot1.jpg","snapshot2.jpg"]', '{"device":"iPhone"}');

-- -------------------------------------------------------------------------
-- 11. Insert Test Data into consultations
--     References users (user_id) and consultant_id (also in users)
-- -------------------------------------------------------------------------
INSERT INTO consultations (
    user_id,
    consultant_id,
    consultation_date,
    details,
    status
) VALUES
    (4, 2, NOW(), 'Discussion about new sunglasses styles', 'scheduled'), 
    (5, 2, NOW(), 'Consultation for reading glasses upgrade', 'scheduled');

-- -------------------------------------------------------------------------
-- 12. Insert Test Data into audit_logs
--     References users (user_id), which can be NULL or set to an admin user
-- -------------------------------------------------------------------------
INSERT INTO audit_logs (
    user_id,
    action,
    details
) VALUES
    (1, 'CREATE_PRODUCT', 'Admin created product Designer Luxury'),
    (1, 'UPDATE_STOCK', 'Admin updated stock for Blue Light Blocker');

-- -------------------------------------------------------------------------
-- 0.2. Re-enable Foreign Key Checks
-- -------------------------------------------------------------------------
SET FOREIGN_KEY_CHECKS = 1;

-- -------------------------------------------------------------------------
-- Done. 
-- You now have sample data across all tables for testing.
-- -------------------------------------------------------------------------