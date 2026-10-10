-- Run this against your existing study_vault database:
-- mysql -u root -p study_vault < migration_comments_ratings.sql
--
-- Comments and ratings are attached to individual RESOURCES, not whole courses.
-- If you previously ran an older version of this migration (course-level),
-- this safely drops those tables and recreates them correctly - any old
-- course-level ratings/comments will be cleared since the shape changed.

USE study_vault;

DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS ratings;

-- ============ COMMENTS (Q&A) - per resource ============
-- parent_id NULL  -> a top-level question
-- parent_id set   -> a reply to that question
CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  resource_id INT NOT NULL,
  user_id INT NOT NULL,
  parent_id INT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
);

CREATE INDEX idx_comments_resource ON comments(resource_id);

-- ============ RATINGS - per resource ============
-- One rating per student per resource (re-submitting updates it, doesn't duplicate)
CREATE TABLE ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  resource_id INT NOT NULL,
  user_id INT NOT NULL,
  rating TINYINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CHECK (rating BETWEEN 1 AND 5),
  UNIQUE KEY unique_resource_user (resource_id, user_id),
  FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
