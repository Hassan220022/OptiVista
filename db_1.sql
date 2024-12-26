-- 1. Create the database
DROP DATABASE IF EXISTS Optivista;
CREATE DATABASE IF NOT EXISTS Optivista;
USE Optivista;

-- 2. Ensure the default storage engine is InnoDB
SET default_storage_engine=InnoDB;

-- 3. Categories table
CREATE TABLE categories (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Users table
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(100),
  username VARCHAR(50) UNIQUE,
  email VARCHAR(254) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  profile_picture_url TEXT,
  preferences JSON,
  role ENUM('customer', 'admin', 'vendor') DEFAULT 'customer',
  auth_token VARCHAR(255),
  last_login TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Products table
CREATE TABLE products (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  style VARCHAR(100),
  color VARCHAR(50),
  size VARCHAR(50),
  price DECIMAL(10,2) NOT NULL,
  model_3d_url TEXT,
  description TEXT,
  category_id BIGINT,
  brand VARCHAR(100),
  available_stock INT NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Orders table
CREATE TABLE orders (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status ENUM('pending', 'processed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  total_price DECIMAL(10,2) NOT NULL,
  shipping_address JSON,
  payment_method ENUM('credit_card', 'paypal', 'cash_on_delivery') NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Order items table
CREATE TABLE order_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT,
  product_id BIGINT,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Feedback table
CREATE TABLE feedback (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  product_id BIGINT,
  rating INT,
  review TEXT,
  feedback_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CHECK (rating >= 1 AND rating <= 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. AR sessions table
CREATE TABLE ar_sessions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  product_id BIGINT,
  session_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  session_end TIMESTAMP NULL,
  actions JSON,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Wishlist table
CREATE TABLE wishlist (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  product_id BIGINT,
  added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Promotions table
CREATE TABLE promotions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  product_id BIGINT,
  discount_percentage DECIMAL(5,2),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CHECK (discount_percentage >= 0 AND discount_percentage <= 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Notifications table
CREATE TABLE notifications (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  message TEXT NOT NULL,
  read_status TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Admin logs table
CREATE TABLE admin_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  admin_id BIGINT,
  action_details TEXT NOT NULL,
  performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. User sessions table
CREATE TABLE user_sessions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  session_token VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
