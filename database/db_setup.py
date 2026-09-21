"""
Database Initializer and Management Utility
Supports both local SQLite relational database (embedded zero-friction mode)
and MySQL Server 8.0 connectivity.
"""

import os
import sqlite3
import json

DB_DIR = os.path.dirname(os.path.abspath(__file__))
SQLITE_DB_PATH = os.path.join(DB_DIR, "student_tracker.db")

def init_sqlite_db():
    """Initializes the SQLite database with full schema and seed data."""
    conn = sqlite3.connect(SQLITE_DB_PATH)
    cursor = conn.cursor()

    # Create Tables
    cursor.executescript("""
    CREATE TABLE IF NOT EXISTS students (
        student_id INTEGER PRIMARY KEY AUTOINCREMENT,
        roll_number TEXT UNIQUE NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        department TEXT NOT NULL DEFAULT 'Computer Science & Engineering',
        semester INTEGER NOT NULL DEFAULT 6,
        enrollment_year INTEGER NOT NULL DEFAULT 2022,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS subjects (
        subject_id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject_code TEXT UNIQUE NOT NULL,
        subject_name TEXT NOT NULL,
        department TEXT NOT NULL DEFAULT 'Computer Science & Engineering',
        credits INTEGER NOT NULL DEFAULT 4,
        faculty_name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS subject_topics (
        topic_id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject_id INTEGER NOT NULL,
        topic_name TEXT NOT NULL,
        difficulty_level TEXT NOT NULL DEFAULT 'Intermediate',
        FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
    );

    CREATE TABLE IF NOT EXISTS assessments (
        assessment_id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        assessment_type TEXT NOT NULL,
        max_marks REAL NOT NULL DEFAULT 100.0,
        weightage_percent REAL NOT NULL DEFAULT 20.0,
        assessment_date TEXT NOT NULL,
        FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
    );

    CREATE TABLE IF NOT EXISTS student_scores (
        score_id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        assessment_id INTEGER NOT NULL,
        marks_obtained REAL NOT NULL,
        percentage REAL GENERATED ALWAYS AS (marks_obtained) STORED,
        letter_grade TEXT,
        submission_date TEXT,
        remarks TEXT,
        FOREIGN KEY (student_id) REFERENCES students(student_id),
        FOREIGN KEY (assessment_id) REFERENCES assessments(assessment_id),
        UNIQUE(student_id, assessment_id)
    );

    CREATE TABLE IF NOT EXISTS attendance (
        attendance_id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        subject_id INTEGER NOT NULL,
        attendance_date TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Present',
        session_topic TEXT,
        FOREIGN KEY (student_id) REFERENCES students(student_id),
        FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
    );

    CREATE TABLE IF NOT EXISTS topic_evaluations (
        eval_id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        topic_id INTEGER NOT NULL,
        mastery_percentage REAL NOT NULL DEFAULT 0.0,
        is_weak_area BOOLEAN GENERATED ALWAYS AS (mastery_percentage < 65.0) STORED,
        last_evaluated TEXT NOT NULL,
        FOREIGN KEY (student_id) REFERENCES students(student_id),
        FOREIGN KEY (topic_id) REFERENCES subject_topics(topic_id),
        UNIQUE(student_id, topic_id)
    );

    CREATE TABLE IF NOT EXISTS ai_improvement_plans (
        plan_id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        overall_performance_status TEXT NOT NULL,
        predicted_risk_level TEXT NOT NULL DEFAULT 'Low',
        weak_topics_summary TEXT NOT NULL,
        structured_action_plan TEXT,
        recommended_resources TEXT,
        ai_feedback_note TEXT,
        FOREIGN KEY (student_id) REFERENCES students(student_id)
    );
    """)

    # Seed data if empty
    cursor.execute("SELECT COUNT(*) FROM students;")
    if cursor.fetchone()[0] == 0:
        print("[DB Setup] Seeding database with students, subjects, assessments, and marks...")

        students_data = [
            (1, 'CS2022-001', 'Sachin', 'Gurjar', 'sachingurjar8180@gmail.com', 'Computer Science & Engineering', 6, 2022),
            (2, 'CS2022-002', 'Priya', 'Sharma', 'priya.sharma@amity.edu', 'Computer Science & Engineering', 6, 2022),
            (3, 'CS2022-003', 'Rohan', 'Verma', 'rohan.verma@amity.edu', 'Computer Science & Engineering', 6, 2022),
            (4, 'CS2022-004', 'Ananya', 'Patel', 'ananya.patel@amity.edu', 'Computer Science & Engineering', 6, 2022),
            (5, 'CS2022-005', 'Vikram', 'Singh', 'vikram.singh@amity.edu', 'Computer Science & Engineering', 6, 2022),
            (6, 'CS2022-006', 'Neha', 'Reddy', 'neha.reddy@amity.edu', 'Computer Science & Engineering', 6, 2022),
            (7, 'CS2022-007', 'Aditya', 'Mishra', 'aditya.mishra@amity.edu', 'Computer Science & Engineering', 6, 2022),
            (8, 'CS2022-008', 'Sneha', 'Gupta', 'sneha.gupta@amity.edu', 'Computer Science & Engineering', 6, 2022)
        ]
        cursor.executemany("INSERT INTO students VALUES (?,?,?,?,?,?,?,?,datetime('now'))", students_data)

        subjects_data = [
            (1, 'CSE301', 'Data Structures & Algorithms', 'Computer Science & Engineering', 4, 'Dr. Rajesh Khanna'),
            (2, 'CSE302', 'Database Management Systems', 'Computer Science & Engineering', 4, 'Prof. Shalini Agarwal'),
            (3, 'CSE303', 'Operating Systems', 'Computer Science & Engineering', 4, 'Dr. Amit Joshi'),
            (4, 'CSE304', 'Computer Networks', 'Computer Science & Engineering', 3, 'Dr. Meenakshi Soni'),
            (5, 'CSE305', 'Machine Learning Foundations', 'Computer Science & Engineering', 4, 'Dr. Vikas Bansal')
        ]
        cursor.executemany("INSERT INTO subjects VALUES (?,?,?,?,?,?)", subjects_data)

        topics_data = [
            (1, 1, 'Binary Search Trees & AVL', 'Intermediate'),
            (2, 1, 'Graph Traversals (BFS/DFS)', 'Intermediate'),
            (3, 1, 'Dynamic Programming & Memoization', 'Advanced'),
            (4, 1, 'Sorting & Divide and Conquer', 'Beginner'),
            (5, 2, 'Relational Algebra & SQL Joins', 'Intermediate'),
            (6, 2, 'Normalization (1NF to BCNF)', 'Advanced'),
            (7, 2, 'ACID Properties & Transactions', 'Intermediate'),
            (8, 2, 'Indexing & Query Optimization', 'Advanced'),
            (9, 3, 'CPU Scheduling Algorithms', 'Beginner'),
            (10, 3, 'Deadlock Detection & Prevention', 'Intermediate'),
            (11, 3, 'Virtual Memory & Paging', 'Advanced'),
            (12, 3, 'Process Synchronization & Semaphores', 'Advanced'),
            (13, 4, 'OSI & TCP/IP Protocol Suite', 'Beginner'),
            (14, 4, 'Subnetting & IP Addressing (IPv4/v6)', 'Intermediate'),
            (15, 4, 'Routing Protocols (OSPF & BGP)', 'Advanced'),
            (16, 4, 'Transport Layer (TCP Handshake & Congestion Control)', 'Advanced'),
            (17, 5, 'Supervised Learning & Regression', 'Intermediate'),
            (18, 5, 'Decision Trees & Random Forests', 'Intermediate'),
            (19, 5, 'Clustering (K-Means & DBSCAN)', 'Intermediate'),
            (20, 5, 'Model Evaluation (Precision, Recall, ROC-AUC)', 'Advanced')
        ]
        cursor.executemany("INSERT INTO subject_topics VALUES (?,?,?,?)", topics_data)

        assessments_data = [
            (1, 1, 'DSA Quiz 1 (Trees & Sorts)', 'Quiz', 100.0, 10.0, '2026-01-20'),
            (2, 1, 'DSA Midterm Examination', 'Midterm', 100.0, 30.0, '2026-03-05'),
            (3, 1, 'DSA Quiz 2 (Graphs & DP)', 'Quiz', 100.0, 10.0, '2026-04-12'),
            (4, 1, 'DSA Final Examination', 'Final Exam', 100.0, 50.0, '2026-05-25'),
            (5, 2, 'DBMS Quiz 1 (SQL & Rel. Algebra)', 'Quiz', 100.0, 10.0, '2026-01-22'),
            (6, 2, 'DBMS Midterm Examination', 'Midterm', 100.0, 30.0, '2026-03-08'),
            (7, 2, 'DBMS Quiz 2 (Normalization & Concurrency)', 'Quiz', 100.0, 10.0, '2026-04-15'),
            (8, 2, 'DBMS Final Examination', 'Final Exam', 100.0, 50.0, '2026-05-28'),
            (9, 3, 'OS Quiz 1 (Processes & Scheduling)', 'Quiz', 100.0, 10.0, '2026-01-25'),
            (10, 3, 'OS Midterm Examination', 'Midterm', 100.0, 30.0, '2026-03-12'),
            (11, 3, 'OS Quiz 2 (Memory & Deadlocks)', 'Quiz', 100.0, 10.0, '2026-04-18'),
            (12, 3, 'OS Final Examination', 'Final Exam', 100.0, 50.0, '2026-06-02'),
            (13, 4, 'CN Quiz 1 (Protocols & Physical Layer)', 'Quiz', 100.0, 15.0, '2026-02-02'),
            (14, 4, 'CN Midterm Examination', 'Midterm', 100.0, 35.0, '2026-03-15'),
            (15, 4, 'CN Final Examination', 'Final Exam', 100.0, 50.0, '2026-06-05'),
            (16, 5, 'ML Lab Assignment 1 (Regression & Prep)', 'Assignment', 100.0, 20.0, '2026-02-15'),
            (17, 5, 'ML Midterm Examination', 'Midterm', 100.0, 30.0, '2026-03-20'),
            (18, 5, 'ML Final Project Evaluation', 'Final Exam', 100.0, 50.0, '2026-06-10')
        ]
        cursor.executemany("INSERT INTO assessments VALUES (?,?,?,?,?,?,?)", assessments_data)

        # Scores
        scores = [
            # Student 1: Sachin Gurjar
            (1, 1, 88.0, 'A', '2026-01-20', 'Solid algorithmic logic'),
            (1, 2, 92.0, 'A+', '2026-03-05', 'Excellent tree traversal implementation'),
            (1, 3, 85.0, 'A', '2026-04-12', 'Good graph search, minor edge case in DP'),
            (1, 4, 91.0, 'A+', '2026-05-25', 'Outstanding performance'),
            (1, 5, 95.0, 'A+', '2026-01-22', 'Top SQL query score in section'),
            (1, 6, 96.0, 'A+', '2026-03-08', 'Flawless relational schema design'),
            (1, 7, 90.0, 'A+', '2026-04-15', 'Clear grasp of BCNF'),
            (1, 8, 94.0, 'A+', '2026-05-28', 'Exceptional query optimization strategy'),
            (1, 9, 82.0, 'B+', '2026-01-25', 'Understood scheduling'),
            (1, 10, 78.0, 'B', '2026-03-12', 'Missed synchronization semaphore edge cases'),
            (1, 11, 80.0, 'B+', '2026-04-18', 'Virtual memory paging concepts clear'),
            (1, 12, 84.0, 'A', '2026-06-02', 'Good recovery on final exam'),
            (1, 13, 89.0, 'A', '2026-02-02', 'Accurate TCP/IP model breakdown'),
            (1, 14, 87.0, 'A', '2026-03-15', 'Solid subnetting calculations'),
            (1, 15, 90.0, 'A+', '2026-06-05', 'Great routing protocols analysis'),
            (1, 16, 94.0, 'A+', '2026-02-15', 'Comprehensive Pandas data cleaning and model'),
            (1, 17, 92.0, 'A+', '2026-03-20', 'High precision on classification models'),
            (1, 18, 95.0, 'A+', '2026-06-10', 'Outstanding end-to-end ML project'),

            # Student 2: Priya Sharma
            (2, 1, 94.0, 'A+', '2026-01-20', 'Mastery in data structures'),
            (2, 2, 95.0, 'A+', '2026-03-05', 'Top midterm score'),
            (2, 3, 91.0, 'A+', '2026-04-12', 'Clean DP implementation'),
            (2, 4, 96.0, 'A+', '2026-05-25', 'Valedictorian candidate score'),
            (2, 5, 92.0, 'A+', '2026-01-22', 'Very good database concepts'),
            (2, 6, 90.0, 'A+', '2026-03-08', 'Great work'),
            (2, 7, 94.0, 'A+', '2026-04-15', 'Excellent normalization'),
            (2, 8, 93.0, 'A+', '2026-05-28', 'Well structured'),
            (2, 9, 88.0, 'A', '2026-01-25', 'Good OS answers'),
            (2, 10, 89.0, 'A', '2026-03-12', 'Understood page replacement'),
            (2, 11, 92.0, 'A+', '2026-04-18', 'Strong grasp of deadlocks'),
            (2, 12, 91.0, 'A+', '2026-06-02', 'Consistently high'),
            (2, 13, 85.0, 'A', '2026-02-02', 'Good networking fundamentals'),
            (2, 14, 88.0, 'A', '2026-03-15', 'Reliable work'),
            (2, 15, 89.0, 'A', '2026-06-05', 'Solid finals'),
            (2, 16, 90.0, 'A+', '2026-02-15', 'Clean Python code'),
            (2, 17, 88.0, 'A', '2026-03-20', 'Good accuracy'),
            (2, 18, 92.0, 'A+', '2026-06-10', 'Well documented'),

            # Student 3: Rohan Verma
            (3, 1, 62.0, 'C', '2026-01-20', 'Confused with recursion base cases'),
            (3, 2, 58.0, 'D', '2026-03-05', 'Struggled with tree traversal algorithms'),
            (3, 3, 55.0, 'D', '2026-04-12', 'Unable to formulate dynamic programming state'),
            (3, 4, 60.0, 'C-', '2026-05-25', 'Passing grade reached with difficulty'),
            (3, 5, 74.0, 'B', '2026-01-22', 'Average SQL performance'),
            (3, 6, 70.0, 'B-', '2026-03-08', 'Errors in foreign key constraints'),
            (3, 7, 65.0, 'C', '2026-04-15', 'BCNF vs 3NF confusion'),
            (3, 8, 68.0, 'C+', '2026-05-28', 'Need query tuning practice'),
            (3, 9, 64.0, 'C', '2026-01-25', 'FCFS & SJF formulas missed'),
            (3, 10, 52.0, 'D', '2026-03-12', 'Critical misunderstanding of semaphores'),
            (3, 11, 56.0, 'D', '2026-04-18', 'Paging page tables calculation wrong'),
            (3, 12, 59.0, 'D', '2026-06-02', 'At-risk performance in OS'),
            (3, 13, 70.0, 'B-', '2026-02-02', 'Satisfactory'),
            (3, 14, 66.0, 'C+', '2026-03-15', 'Subnet masks calculation issues'),
            (3, 15, 68.0, 'C+', '2026-06-05', 'Fair'),
            (3, 16, 72.0, 'B', '2026-02-15', 'Decent Python notebook'),
            (3, 17, 68.0, 'C+', '2026-03-20', 'Confusion on confusion matrix metrics'),
            (3, 18, 70.0, 'B-', '2026-06-10', 'Basic model executed'),

            # Student 4: Ananya Patel
            (4, 1, 68.0, 'C+', '2026-01-20', 'Slow start'),
            (4, 2, 75.0, 'B', '2026-03-05', 'Notable improvement in problem solving'),
            (4, 3, 84.0, 'A', '2026-04-12', 'Significant improvement in DP'),
            (4, 4, 89.0, 'A', '2026-05-25', 'Strong finish in DSA'),
            (4, 5, 78.0, 'B', '2026-01-22', 'Good basics'),
            (4, 6, 82.0, 'B+', '2026-03-08', 'Solid ER modeling'),
            (4, 7, 85.0, 'A', '2026-04-15', 'Good normalization'),
            (4, 8, 88.0, 'A', '2026-05-28', 'Clean indexing solutions'),
            (4, 9, 70.0, 'B-', '2026-01-25', 'Fair start'),
            (4, 10, 76.0, 'B', '2026-03-12', 'Steady work'),
            (4, 11, 80.0, 'B+', '2026-04-18', 'Good grasp of memory management'),
            (4, 12, 85.0, 'A', '2026-06-02', 'Great improvement trend'),
            (4, 13, 75.0, 'B', '2026-02-02', 'Decent'),
            (4, 14, 81.0, 'B+', '2026-03-15', 'Well done'),
            (4, 15, 84.0, 'A', '2026-06-05', 'High competence'),
            (4, 16, 80.0, 'B+', '2026-02-15', 'Good ML workflow'),
            (4, 17, 83.0, 'A', '2026-03-20', 'Strong grasp of hyperparameter tuning'),
            (4, 18, 87.0, 'A', '2026-06-10', 'Excellent final presentation'),

            # Student 5: Vikram Singh
            (5, 1, 52.0, 'D', '2026-01-20', 'Incomplete paper'),
            (5, 2, 48.0, 'F', '2026-03-05', 'Critical gaps in sorting and pointers'),
            (5, 3, 50.0, 'F', '2026-04-12', 'Did not attempt dynamic programming'),
            (5, 4, 54.0, 'D', '2026-05-25', 'Needs re-examination'),
            (5, 5, 60.0, 'C-', '2026-01-22', 'Basic queries only'),
            (5, 6, 55.0, 'D', '2026-03-08', 'Foreign keys and joins missing'),
            (5, 7, 58.0, 'D', '2026-04-15', 'Normalization errors'),
            (5, 8, 62.0, 'C', '2026-05-28', 'Struggling with subqueries'),
            (5, 9, 50.0, 'F', '2026-01-25', 'Low attendance evident in test'),
            (5, 10, 46.0, 'F', '2026-03-12', 'Missed memory paging concepts'),
            (5, 11, 52.0, 'D', '2026-04-18', 'Failed deadlocks question'),
            (5, 12, 55.0, 'D', '2026-06-02', 'High risk academic warning'),
            (5, 13, 62.0, 'C', '2026-02-02', 'Fair'),
            (5, 14, 58.0, 'D', '2026-03-15', 'Struggling with CIDR notation'),
            (5, 15, 60.0, 'C-', '2026-06-05', 'Barely passed'),
            (5, 16, 65.0, 'C', '2026-02-15', 'Incomplete preprocessing pipeline'),
            (5, 17, 59.0, 'D', '2026-03-20', 'Overfitting not handled'),
            (5, 18, 63.0, 'C', '2026-06-10', 'Average submission')
        ]
        cursor.executemany("INSERT INTO student_scores (student_id, assessment_id, marks_obtained, letter_grade, submission_date, remarks) VALUES (?,?,?,?,?,?)", scores)

        # Topic Evaluations
        topic_evals = [
            (1, 1, 92.0, '2026-05-20'),
            (1, 2, 88.0, '2026-05-20'),
            (1, 3, 82.0, '2026-05-20'),
            (1, 5, 98.0, '2026-05-20'),
            (1, 6, 95.0, '2026-05-20'),
            (1, 7, 94.0, '2026-05-20'),
            (1, 8, 96.0, '2026-05-20'),
            (1, 10, 72.0, '2026-05-20'),
            (1, 11, 79.0, '2026-05-20'),
            (1, 12, 70.0, '2026-05-20'),
            (1, 14, 88.0, '2026-05-20'),
            (1, 16, 91.0, '2026-05-20'),
            (1, 17, 95.0, '2026-05-20'),
            (1, 20, 93.0, '2026-05-20'),

            (3, 1, 60.0, '2026-05-20'),
            (3, 2, 54.0, '2026-05-20'),
            (3, 3, 48.0, '2026-05-20'),
            (3, 5, 68.0, '2026-05-20'),
            (3, 6, 52.0, '2026-05-20'),
            (3, 7, 64.0, '2026-05-20'),
            (3, 10, 45.0, '2026-05-20'),
            (3, 11, 50.0, '2026-05-20'),
            (3, 12, 42.0, '2026-05-20'),
            (3, 14, 58.0, '2026-05-20'),
            (3, 17, 65.0, '2026-05-20'),
            (3, 20, 56.0, '2026-05-20'),

            (5, 1, 45.0, '2026-05-20'),
            (5, 2, 40.0, '2026-05-20'),
            (5, 3, 35.0, '2026-05-20'),
            (5, 5, 55.0, '2026-05-20'),
            (5, 6, 48.0, '2026-05-20'),
            (5, 10, 40.0, '2026-05-20'),
            (5, 11, 44.0, '2026-05-20'),
            (5, 12, 38.0, '2026-05-20'),
            (5, 14, 50.0, '2026-05-20'),
            (5, 17, 52.0, '2026-05-20')
        ]
        cursor.executemany("INSERT INTO topic_evaluations (student_id, topic_id, mastery_percentage, last_evaluated) VALUES (?,?,?,?)", topic_evals)

        # Attendance
        attendance_records = [
            (1, 1, '2026-01-15', 'Present', 'Introduction & Complexity Analysis'),
            (1, 1, '2026-01-18', 'Present', 'Binary Trees'),
            (1, 1, '2026-01-22', 'Present', 'AVL Balance Factor'),
            (1, 1, '2026-01-26', 'Present', 'Graph DFS/BFS'),
            (1, 1, '2026-02-02', 'Present', 'Dijkstras Shortest Path'),
            (1, 1, '2026-02-09', 'Present', 'Dynamic Programming Patterns'),
            (1, 2, '2026-01-16', 'Present', 'Relational Model & Keys'),
            (1, 2, '2026-01-20', 'Present', 'Advanced SQL Joins'),
            (1, 2, '2026-01-24', 'Present', '3NF & BCNF Normalization'),
            (1, 2, '2026-02-03', 'Present', 'Transaction Concurrency Control'),
            (1, 3, '2026-01-17', 'Present', 'CPU Scheduling Algorithms'),
            (1, 3, '2026-01-21', 'Present', 'Process Synchronization Semaphores'),
            (1, 3, '2026-01-28', 'Absent', 'Bankers Algorithm & Deadlocks'),
            (1, 3, '2026-02-04', 'Present', 'Demand Paging & Page Replacement'),
            (1, 4, '2026-01-19', 'Present', 'OSI 7-Layer Architecture'),
            (1, 4, '2026-01-25', 'Present', 'Subnetting IPv4 CIDR'),
            (1, 5, '2026-01-23', 'Present', 'Supervised Learning Pipeline'),
            (1, 5, '2026-01-30', 'Present', 'Decision Tree Pruning'),

            (2, 1, '2026-01-15', 'Present', 'Intro'),
            (2, 1, '2026-01-18', 'Present', 'Trees'),
            (2, 2, '2026-01-16', 'Present', 'Keys'),
            (2, 3, '2026-01-17', 'Present', 'CPU'),

            (3, 1, '2026-01-15', 'Present', 'Introduction & Complexity Analysis'),
            (3, 1, '2026-01-18', 'Absent', 'Binary Trees'),
            (3, 1, '2026-01-22', 'Present', 'AVL Balance Factor'),
            (3, 1, '2026-01-26', 'Absent', 'Graph DFS/BFS'),
            (3, 1, '2026-02-02', 'Late', 'Dijkstras Shortest Path'),
            (3, 1, '2026-02-09', 'Absent', 'Dynamic Programming Patterns'),
            (3, 2, '2026-01-16', 'Present', 'Relational Model & Keys'),
            (3, 2, '2026-01-20', 'Absent', 'Advanced SQL Joins'),
            (3, 3, '2026-01-17', 'Present', 'CPU Scheduling Algorithms'),
            (3, 3, '2026-01-21', 'Absent', 'Process Synchronization Semaphores'),
            (3, 3, '2026-01-28', 'Absent', 'Bankers Algorithm & Deadlocks'),

            (5, 1, '2026-01-15', 'Absent', 'Introduction & Complexity Analysis'),
            (5, 1, '2026-01-18', 'Absent', 'Binary Trees'),
            (5, 1, '2026-01-22', 'Present', 'AVL Balance Factor'),
            (5, 1, '2026-01-26', 'Absent', 'Graph DFS/BFS'),
            (5, 2, '2026-01-16', 'Present', 'Relational Model & Keys'),
            (5, 2, '2026-01-20', 'Absent', 'Advanced SQL Joins'),
            (5, 3, '2026-01-17', 'Absent', 'CPU Scheduling Algorithms'),
            (5, 3, '2026-01-21', 'Absent', 'Process Synchronization Semaphores'),
            (5, 3, '2026-01-28', 'Absent', 'Bankers Algorithm & Deadlocks')
        ]
        cursor.executemany("INSERT INTO attendance (student_id, subject_id, attendance_date, status, session_topic) VALUES (?,?,?,?,?)", attendance_records)

    conn.commit()
    conn.close()
    print(f"[DB Setup] Database ready at: {SQLITE_DB_PATH}")

def get_connection():
    """Returns a connection to the SQLite database with row factory enabled."""
    conn = sqlite3.connect(SQLITE_DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

if __name__ == "__main__":
    init_sqlite_db()
