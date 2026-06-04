USE empowher_db;
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('entrepreneur', 'mentor', 'admin') NOT NULL DEFAULT 'entrepreneur',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_role (role),
  KEY idx_users_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS entrepreneur_profiles (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  bio TEXT,
  location VARCHAR(150),
  skills TEXT,
  interests TEXT,
  profile_image_url VARCHAR(500),
  experience_level ENUM('beginner', 'intermediate', 'experienced') DEFAULT 'beginner',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_entrepreneur_profiles_user_id (user_id),
  KEY idx_entrepreneur_profiles_location (location),
  KEY idx_entrepreneur_profiles_experience_level (experience_level),
  CONSTRAINT fk_entrepreneur_profiles_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS business_profiles (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  business_name VARCHAR(150) NOT NULL,
  business_category VARCHAR(100) NOT NULL,
  business_description TEXT,
  business_location VARCHAR(150),
  business_image_url VARCHAR(500),
  website_url VARCHAR(500),
  instagram_url VARCHAR(500),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_business_profiles_user_id (user_id),
  KEY idx_business_profiles_category (business_category),
  KEY idx_business_profiles_location (business_location),
  KEY idx_business_profiles_is_active (is_active),
  KEY idx_business_profiles_category_active_name (business_category, is_active, business_name),
  CONSTRAINT fk_business_profiles_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS connections (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  sender_id INT UNSIGNED NOT NULL,
  receiver_id INT UNSIGNED NOT NULL,
  status ENUM('pending', 'accepted', 'rejected', 'cancelled') NOT NULL DEFAULT 'pending',
  pair_user_low INT UNSIGNED GENERATED ALWAYS AS (LEAST(sender_id, receiver_id)) STORED,
  pair_user_high INT UNSIGNED GENERATED ALWAYS AS (GREATEST(sender_id, receiver_id)) STORED,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_connections_user_pair (pair_user_low, pair_user_high),
  KEY idx_connections_sender_id (sender_id),
  KEY idx_connections_receiver_id (receiver_id),
  KEY idx_connections_status (status),
  KEY idx_connections_sender_status_updated (sender_id, status, updated_at),
  KEY idx_connections_receiver_status_updated (receiver_id, status, updated_at),
  CONSTRAINT fk_connections_sender
    FOREIGN KEY (sender_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_connections_receiver
    FOREIGN KEY (receiver_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TRIGGER IF EXISTS trg_connections_prevent_self_insert;
DROP TRIGGER IF EXISTS trg_connections_prevent_self_update;

DELIMITER $$

CREATE TRIGGER trg_connections_prevent_self_insert
BEFORE INSERT ON connections
FOR EACH ROW
BEGIN
  IF NEW.sender_id = NEW.receiver_id THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'sender_id and receiver_id cannot be the same';
  END IF;
END$$

CREATE TRIGGER trg_connections_prevent_self_update
BEFORE UPDATE ON connections
FOR EACH ROW
BEGIN
  IF NEW.sender_id = NEW.receiver_id THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'sender_id and receiver_id cannot be the same';
  END IF;
END$$

DELIMITER ;

CREATE TABLE IF NOT EXISTS community_posts (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  content TEXT NOT NULL,
  image_url VARCHAR(500),
  post_type ENUM('general', 'question', 'tip', 'success_story', 'business_update') NOT NULL DEFAULT 'general',
  visibility ENUM('public', 'connections') NOT NULL DEFAULT 'public',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_community_posts_user_id (user_id),
  KEY idx_community_posts_post_type (post_type),
  KEY idx_community_posts_visibility (visibility),
  KEY idx_community_posts_created_at (created_at),
  KEY idx_community_posts_is_active (is_active),
  KEY idx_community_posts_active_created (is_active, created_at),
  CONSTRAINT fk_community_posts_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS post_comments (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  post_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  comment_text TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_post_comments_post_id (post_id),
  KEY idx_post_comments_user_id (user_id),
  KEY idx_post_comments_created_at (created_at),
  KEY idx_post_comments_is_active (is_active),
  KEY idx_post_comments_post_active_created (post_id, is_active, created_at),
  CONSTRAINT fk_post_comments_post
    FOREIGN KEY (post_id) REFERENCES community_posts(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_post_comments_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
