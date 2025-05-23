-- -------------------------------------------------------------------------
-- 1. Create Database and Switch Context
-- -------------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS ecom_db
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE ecom_db;

SET sql_mode = 'STRICT_ALL_TABLES';

-- -------------------------------------------------------------------------
-- 2. Drop Tables if They Exist (Reverse Order of Dependencies)
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS pictures;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS consultations;
DROP TABLE IF EXISTS ar_sessions;
DROP TABLE IF EXISTS promotions;
DROP TABLE IF EXISTS wishlist;
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS categories;

-- -------------------------------------------------------------------------
-- 3. Create Tables (Respecting Dependencies)
-- -------------------------------------------------------------------------

-- 3.1: categories
CREATE TABLE categories (
    id          INT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    description TEXT
) ENGINE = InnoDB
COMMENT = 'Product categories (e.g., Sunglasses, Reading Glasses, etc.)';

-- 3.2: users
CREATE TABLE users (
    id            INT PRIMARY KEY AUTO_INCREMENT,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          ENUM('admin','customer','consultant') NOT NULL DEFAULT 'customer',
    profile       JSON         NULL,
    preferences   JSON         NULL,
    auth_token    VARCHAR(255) NULL,
    last_login    DATETIME     NULL
) ENGINE = InnoDB
COMMENT = 'Stores user accounts (customers, admins, consultants)';

-- 3.3: pictures
--    This table references users to track which user uploaded the picture.
--    It's suitable for storing MinIO (or external) URLs.
CREATE TABLE pictures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    url VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL DEFAULT 'image/jpeg',
    file_size INT UNSIGNED NOT NULL DEFAULT 0,
    metadata JSON NULL, 
    uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pictures_user_id
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE = InnoDB
COMMENT = 'Holds references to images stored in MinIO or external storage';

-- 3.4: products
CREATE TABLE products (
    id               INT PRIMARY KEY AUTO_INCREMENT,
    category_id      INT         NULL,
    name             VARCHAR(255) NOT NULL,
    style            VARCHAR(100) NULL,
    color            VARCHAR(50)  NULL,         
    size             VARCHAR(50)  NULL,         
    price            DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    description      TEXT        NULL,
    brand            VARCHAR(100) NULL,
    ar_supported     BOOLEAN     NOT NULL DEFAULT FALSE,
    
    -- Additional Fields
    stock            INT         NOT NULL DEFAULT 0,
    image_url        VARCHAR(255) NULL,
    ar_model_url     VARCHAR(255) NULL,
    
    frame_width      INT         NULL,
    temple_length    INT         NULL,
    lens_height      INT         NULL,
    bridge_width     INT         NULL,
    
    materials        JSON        NULL, 
    available_colors JSON        NULL,
    
    CONSTRAINT fk_products_category_id
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE = InnoDB
COMMENT = 'Stores product catalog, including AR support and stock info';

-- 3.5: orders
CREATE TABLE orders (
    id               INT PRIMARY KEY AUTO_INCREMENT,
    user_id          INT NOT NULL,
    order_date       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status           ENUM('pending','processing','shipped','delivered','cancelled')
                     NOT NULL DEFAULT 'pending',
    total_price      DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    shipping_address TEXT         NOT NULL,
    payment_method   VARCHAR(50)  NOT NULL,
    CONSTRAINT fk_orders_user_id
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE = InnoDB
COMMENT = 'Stores user orders including total price, status, and shipping details';

-- 3.6: order_items
CREATE TABLE order_items (
    id         INT PRIMARY KEY AUTO_INCREMENT,
    order_id   INT NOT NULL,
    product_id INT NOT NULL,
    quantity   INT NOT NULL DEFAULT 1,
    price      DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    CONSTRAINT fk_order_items_order_id
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_order_items_product_id
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE = InnoDB
COMMENT = 'Line items for each order, capturing quantity and purchase price';

-- 3.7: feedback
CREATE TABLE feedback (
    id            INT PRIMARY KEY AUTO_INCREMENT,
    user_id       INT NOT NULL,
    product_id    INT NOT NULL,
    rating        INT NOT NULL,
    review        TEXT NULL,
    feedback_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_feedback_user_id
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_feedback_product_id
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT chk_feedback_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE = InnoDB
COMMENT = 'Stores user ratings and reviews for products';

-- 3.8: wishlist
CREATE TABLE wishlist (
    id         INT PRIMARY KEY AUTO_INCREMENT,
    user_id    INT NOT NULL,
    product_id INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_wishlist_user_id
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_wishlist_product_id
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE = InnoDB
COMMENT = 'Stores products that users have wishlisted';

-- 3.9: promotions
CREATE TABLE promotions (
    id                  INT PRIMARY KEY AUTO_INCREMENT,
    name                VARCHAR(100) NOT NULL,
    description         TEXT         NULL,
    discount_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    start_date          DATETIME     NOT NULL,
    end_date            DATETIME     NOT NULL
) ENGINE = InnoDB
COMMENT = 'Information about promotional campaigns or discounts';

-- 3.10: ar_sessions
CREATE TABLE ar_sessions (
    id               INT PRIMARY KEY AUTO_INCREMENT,
    user_id          INT NOT NULL,
    product_id       INT NOT NULL,
    -- session_start    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- session_end      DATETIME NULL,
    snapshots        JSON     NULL,
    session_metadata JSON     NULL,
    CONSTRAINT fk_ar_sessions_user_id
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_ar_sessions_product_id
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE = InnoDB
COMMENT = 'Logs AR interactions for each user and product';

-- 3.11: consultations
CREATE TABLE consultations (
    id                INT PRIMARY KEY AUTO_INCREMENT,
    user_id           INT NOT NULL,
    consultant_id     INT NOT NULL,
    consultation_date DATETIME NOT NULL,
    details           TEXT NULL,
    status            ENUM('scheduled','completed','canceled') NOT NULL DEFAULT 'scheduled',
    CONSTRAINT fk_consultations_user_id
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_consultations_consultant_id
        FOREIGN KEY (consultant_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE = InnoDB
COMMENT = 'Schedules consults between customers and consultants (both are in users)';

-- 3.12: audit_logs
CREATE TABLE audit_logs (
    id        INT PRIMARY KEY AUTO_INCREMENT,
    user_id   INT NULL,
    action    VARCHAR(255) NOT NULL,
    timestamp DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    details   TEXT         NULL,
    CONSTRAINT fk_audit_logs_user_id
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE = InnoDB
COMMENT = 'Tracks critical actions (e.g., admin changes) for auditing';

-- -------------------------------------------------------------------------
-- 4. Example Indexes for Performance
-- -------------------------------------------------------------------------

-- Users
CREATE INDEX idx_users_role ON users(role);

-- Pictures
CREATE INDEX idx_pictures_user_id ON pictures(user_id);

-- Products
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_name        ON products(name);

-- Orders
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- Order Items
CREATE INDEX idx_order_items_order_id   ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Feedback
CREATE INDEX idx_feedback_user_id    ON feedback(user_id);
CREATE INDEX idx_feedback_product_id ON feedback(product_id);

-- Wishlist
CREATE INDEX idx_wishlist_user_id      ON wishlist(user_id);
CREATE INDEX idx_wishlist_product_id   ON wishlist(product_id);
CREATE UNIQUE INDEX idx_wishlist_combo ON wishlist(user_id, product_id);

-- AR Sessions
CREATE INDEX idx_ar_sessions_user_id    ON ar_sessions(user_id);
CREATE INDEX idx_ar_sessions_product_id ON ar_sessions(product_id);

-- Consultations
CREATE INDEX idx_consultations_user_id       ON consultations(user_id);
CREATE INDEX idx_consultations_consultant_id ON consultations(consultant_id);

-- Audit Logs
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);

-- -------------------------------------------------------------------------
-- End of Full Schema
-- -------------------------------------------------------------------------