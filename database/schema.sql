-- ============================================================================
-- AI-Powered Student Performance Tracker - Relational MySQL Database Schema
-- Designed for: Multi-subject academic performance tracking, attendance analytics,
-- assessment trends, topic mastery, and Generative AI improvement plan records.
-- ============================================================================

CREATE DATABASE IF NOT EXISTS student_performance_db;
USE student_performance_db;

-- 1. Students Table
CREATE TABLE IF NOT EXISTS students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    roll_number VARCHAR(30) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department VARCHAR(50) NOT NULL DEFAULT 'Computer Science & Engineering',
    semester INT NOT NULL DEFAULT 6,
    enrollment_year INT NOT NULL DEFAULT 2022,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
    subject_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_code VARCHAR(20) UNIQUE NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL DEFAULT 'Computer Science & Engineering',
    credits INT NOT NULL DEFAULT 4,
    faculty_name VARCHAR(100) NOT NULL
);

-- 3. Assessments Table
CREATE TABLE IF NOT EXISTS assessments (
    assessment_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    assessment_type ENUM('Quiz', 'Assignment', 'Midterm', 'Final Exam') NOT NULL,
    max_marks DECIMAL(5,2) NOT NULL DEFAULT 100.00,
    weightage_percent DECIMAL(5,2) NOT NULL DEFAULT 20.00,
    assessment_date DATE NOT NULL,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
);

-- 4. Student Scores Table
CREATE TABLE IF NOT EXISTS student_scores (
    score_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    assessment_id INT NOT NULL,
    marks_obtained DECIMAL(5,2) NOT NULL,
    percentage DECIMAL(5,2) GENERATED ALWAYS AS ((marks_obtained / 100.00) * 100.00) STORED,
    letter_grade VARCHAR(5),
    submission_date DATE,
    remarks VARCHAR(255),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (assessment_id) REFERENCES assessments(assessment_id) ON DELETE CASCADE,
    UNIQUE KEY uq_student_assessment (student_id, assessment_id)
);

-- 5. Attendance Records Table
CREATE TABLE IF NOT EXISTS attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    status ENUM('Present', 'Absent', 'Late') NOT NULL DEFAULT 'Present',
    session_topic VARCHAR(150),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
);

-- 6. Subject Topics Table
CREATE TABLE IF NOT EXISTS subject_topics (
    topic_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    topic_name VARCHAR(100) NOT NULL,
    difficulty_level ENUM('Beginner', 'Intermediate', 'Advanced') NOT NULL DEFAULT 'Intermediate',
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
);

-- 7. Topic Evaluations (Granular topic mastery diagnostics)
CREATE TABLE IF NOT EXISTS topic_evaluations (
    eval_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    topic_id INT NOT NULL,
    mastery_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    is_weak_area BOOLEAN GENERATED ALWAYS AS (mastery_percentage < 65.00) STORED,
    last_evaluated DATE NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES subject_topics(topic_id) ON DELETE CASCADE,
    UNIQUE KEY uq_student_topic (student_id, topic_id)
);

-- 8. AI Improvement Plans Table
CREATE TABLE IF NOT EXISTS ai_improvement_plans (
    plan_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    overall_performance_status VARCHAR(50) NOT NULL,
    predicted_risk_level ENUM('Low', 'Moderate', 'High') NOT NULL DEFAULT 'Low',
    weak_topics_summary TEXT NOT NULL,
    structured_action_plan JSON,
    recommended_resources TEXT,
    ai_feedback_note TEXT,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);
