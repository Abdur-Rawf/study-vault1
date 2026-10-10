-- Study Vault database schema
-- Run this once against a fresh database: mysql -u root -p study_vault < schema.sql

CREATE DATABASE IF NOT EXISTS study_vault CHARACTER SET utf8mb4;
USE study_vault;

-- ============ USERS ============
-- role: chairman (manages teachers + assignments)
--       teacher  (manages resources for assigned courses, approves student submissions)
--       student  (browses approved resources, submits new ones for approval)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('chairman', 'teacher', 'student') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============ COURSES ============
CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,
  title VARCHAR(200) NOT NULL,
  year TINYINT NOT NULL,       -- 1..4
  semester TINYINT NOT NULL    -- 1..2
);

-- ============ COURSE ASSIGNMENTS ============
-- Which teacher is responsible for which course (set by Chairman)
CREATE TABLE IF NOT EXISTS course_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  teacher_id INT NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_course_teacher (course_id, teacher_id)
);

-- ============ RESOURCES ============
CREATE TABLE IF NOT EXISTS resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  link VARCHAR(500) NOT NULL,
  type ENUM('yt', 'drive', 'link') NOT NULL DEFAULT 'link',
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'approved',
  submitted_by INT NULL,          -- NULL if added directly by teacher/chairman
  reviewed_by INT NULL,
  reviewed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (submitted_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_resources_course_status ON resources(course_id, status);
CREATE INDEX idx_courses_year_sem ON courses(year, semester);

-- ============ COMMENTS (Q&A) ============
-- Attached to a specific resource, not the course as a whole.
-- parent_id NULL  -> a top-level question
-- parent_id set   -> a reply to that question
CREATE TABLE IF NOT EXISTS comments (
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

-- ============ RATINGS ============
-- Attached to a specific resource. One rating per student per resource
-- (re-submitting updates it, doesn't duplicate).
CREATE TABLE IF NOT EXISTS ratings (
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
