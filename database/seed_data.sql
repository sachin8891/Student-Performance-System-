-- ============================================================================
-- AI-Powered Student Performance Tracker - Realistic Seed Data
-- ============================================================================

USE student_performance_db;

-- 1. Insert Students
INSERT INTO students (student_id, roll_number, first_name, last_name, email, department, semester, enrollment_year) VALUES
(1, 'CS2022-001', 'Sachin', 'Gurjar', 'sachingurjar8180@gmail.com', 'Computer Science & Engineering', 6, 2022),
(2, 'CS2022-002', 'Priya', 'Sharma', 'priya.sharma@amity.edu', 'Computer Science & Engineering', 6, 2022),
(3, 'CS2022-003', 'Rohan', 'Verma', 'rohan.verma@amity.edu', 'Computer Science & Engineering', 6, 2022),
(4, 'CS2022-004', 'Ananya', 'Patel', 'ananya.patel@amity.edu', 'Computer Science & Engineering', 6, 2022),
(5, 'CS2022-005', 'Vikram', 'Singh', 'vikram.singh@amity.edu', 'Computer Science & Engineering', 6, 2022),
(6, 'CS2022-006', 'Neha', 'Reddy', 'neha.reddy@amity.edu', 'Computer Science & Engineering', 6, 2022),
(7, 'CS2022-007', 'Aditya', 'Mishra', 'aditya.mishra@amity.edu', 'Computer Science & Engineering', 6, 2022),
(8, 'CS2022-008', 'Sneha', 'Gupta', 'sneha.gupta@amity.edu', 'Computer Science & Engineering', 6, 2022);

-- 2. Insert Subjects
INSERT INTO subjects (subject_id, subject_code, subject_name, department, credits, faculty_name) VALUES
(1, 'CSE301', 'Data Structures & Algorithms', 'Computer Science & Engineering', 4, 'Dr. Rajesh Khanna'),
(2, 'CSE302', 'Database Management Systems', 'Computer Science & Engineering', 4, 'Prof. Shalini Agarwal'),
(3, 'CSE303', 'Operating Systems', 'Computer Science & Engineering', 4, 'Dr. Amit Joshi'),
(4, 'CSE304', 'Computer Networks', 'Computer Science & Engineering', 3, 'Dr. Meenakshi Soni'),
(5, 'CSE305', 'Machine Learning Foundations', 'Computer Science & Engineering', 4, 'Dr. Vikas Bansal');

-- 3. Insert Syllabus Topics
INSERT INTO subject_topics (topic_id, subject_id, topic_name, difficulty_level) VALUES
-- DSA Topics
(1, 1, 'Binary Search Trees & AVL', 'Intermediate'),
(2, 1, 'Graph Traversals (BFS/DFS)', 'Intermediate'),
(3, 1, 'Dynamic Programming & Memoization', 'Advanced'),
(4, 1, 'Sorting & Divide and Conquer', 'Beginner'),

-- DBMS Topics
(5, 2, 'Relational Algebra & SQL Joins', 'Intermediate'),
(6, 2, 'Normalization (1NF to BCNF)', 'Advanced'),
(7, 2, 'ACID Properties & Transactions', 'Intermediate'),
(8, 2, 'Indexing & Query Optimization', 'Advanced'),

-- OS Topics
(9, 3, 'CPU Scheduling Algorithms', 'Beginner'),
(10, 3, 'Deadlock Detection & Prevention', 'Intermediate'),
(11, 3, 'Virtual Memory & Paging', 'Advanced'),
(12, 3, 'Process Synchronization & Semaphores', 'Advanced'),

-- CN Topics
(13, 4, 'OSI & TCP/IP Protocol Suite', 'Beginner'),
(14, 4, 'Subnetting & IP Addressing (IPv4/v6)', 'Intermediate'),
(15, 4, 'Routing Protocols (OSPF & BGP)', 'Advanced'),
(16, 4, 'Transport Layer (TCP Handshake & Congestion Control)', 'Advanced'),

-- ML Topics
(17, 5, 'Supervised Learning & Regression', 'Intermediate'),
(18, 5, 'Decision Trees & Random Forests', 'Intermediate'),
(19, 5, 'Clustering (K-Means & DBSCAN)', 'Intermediate'),
(20, 5, 'Model Evaluation (Precision, Recall, ROC-AUC)', 'Advanced');

-- 4. Insert Assessments
INSERT INTO assessments (assessment_id, subject_id, title, assessment_type, max_marks, weightage_percent, assessment_date) VALUES
-- DSA
(1, 1, 'DSA Quiz 1 (Trees & Sorts)', 'Quiz', 100.00, 10.00, '2026-01-20'),
(2, 1, 'DSA Midterm Examination', 'Midterm', 100.00, 30.00, '2026-03-05'),
(3, 1, 'DSA Quiz 2 (Graphs & DP)', 'Quiz', 100.00, 10.00, '2026-04-12'),
(4, 1, 'DSA Final Examination', 'Final Exam', 100.00, 50.00, '2026-05-25'),

-- DBMS
(5, 2, 'DBMS Quiz 1 (SQL & Rel. Algebra)', 'Quiz', 100.00, 10.00, '2026-01-22'),
(6, 2, 'DBMS Midterm Examination', 'Midterm', 100.00, 30.00, '2026-03-08'),
(7, 2, 'DBMS Quiz 2 (Normalization & Concurrency)', 'Quiz', 100.00, 10.00, '2026-04-15'),
(8, 2, 'DBMS Final Examination', 'Final Exam', 100.00, 50.00, '2026-05-28'),

-- OS
(9, 3, 'OS Quiz 1 (Processes & Scheduling)', 'Quiz', 100.00, 10.00, '2026-01-25'),
(10, 3, 'OS Midterm Examination', 'Midterm', 100.00, 30.00, '2026-03-12'),
(11, 3, 'OS Quiz 2 (Memory & Deadlocks)', 'Quiz', 100.00, 10.00, '2026-04-18'),
(12, 3, 'OS Final Examination', 'Final Exam', 100.00, 50.00, '2026-06-02'),

-- CN
(13, 4, 'CN Quiz 1 (Protocols & Physical Layer)', 'Quiz', 100.00, 15.00, '2026-02-02'),
(14, 4, 'CN Midterm Examination', 'Midterm', 100.00, 35.00, '2026-03-15'),
(15, 4, 'CN Final Examination', 'Final Exam', 100.00, 50.00, '2026-06-05'),

-- ML
(16, 5, 'ML Lab Assignment 1 (Regression & Prep)', 'Assignment', 100.00, 20.00, '2026-02-15'),
(17, 5, 'ML Midterm Examination', 'Midterm', 100.00, 30.00, '2026-03-20'),
(18, 5, 'ML Final Project Evaluation', 'Final Exam', 100.00, 50.00, '2026-06-10');

-- 5. Insert Student Scores (Realistic distributions across students)
-- Student 1: Sachin Gurjar (High performer in DB & ML, strong in DSA, developing in OS)
INSERT INTO student_scores (student_id, assessment_id, marks_obtained, letter_grade, submission_date, remarks) VALUES
(1, 1, 88.00, 'A', '2026-01-20', 'Solid algorithmic logic'),
(1, 2, 92.00, 'A+', '2026-03-05', 'Excellent tree traversal implementation'),
(1, 3, 85.00, 'A', '2026-04-12', 'Good graph search, minor edge case in DP'),
(1, 4, 91.00, 'A+', '2026-05-25', 'Outstanding performance'),

(1, 5, 95.00, 'A+', '2026-01-22', 'Top SQL query score in section'),
(1, 6, 96.00, 'A+', '2026-03-08', 'Flawless relational schema design'),
(1, 7, 90.00, 'A+', '2026-04-15', 'Clear grasp of BCNF'),
(1, 8, 94.00, 'A+', '2026-05-28', 'Exceptional query optimization strategy'),

(1, 9, 82.00, 'B+', '2026-01-25', 'Understood scheduling'),
(1, 10, 78.00, 'B', '2026-03-12', 'Missed synchronization semaphore edge cases'),
(1, 11, 80.00, 'B+', '2026-04-18', 'Virtual memory paging concepts clear'),
(1, 12, 84.00, 'A', '2026-06-02', 'Good recovery on final exam'),

(1, 13, 89.00, 'A', '2026-02-02', 'Accurate TCP/IP model breakdown'),
(1, 14, 87.00, 'A', '2026-03-15', 'Solid subnetting calculations'),
(1, 15, 90.00, 'A+', '2026-06-05', 'Great routing protocols analysis'),

(1, 16, 94.00, 'A+', '2026-02-15', 'Comprehensive Pandas data cleaning and model'),
(1, 17, 92.00, 'A+', '2026-03-20', 'High precision on classification models'),
(1, 18, 95.00, 'A+', '2026-06-10', 'Outstanding end-to-end ML project');

-- Student 2: Priya Sharma (Consistent High Achiever)
INSERT INTO student_scores (student_id, assessment_id, marks_obtained, letter_grade, submission_date, remarks) VALUES
(2, 1, 94.00, 'A+', '2026-01-20', 'Mastery in data structures'),
(2, 2, 95.00, 'A+', '2026-03-05', 'Top midterm score'),
(2, 3, 91.00, 'A+', '2026-04-12', 'Clean DP implementation'),
(2, 4, 96.00, 'A+', '2026-05-25', 'Valedictorian candidate score'),
(2, 5, 92.00, 'A+', '2026-01-22', 'Very good database concepts'),
(2, 6, 90.00, 'A+', '2026-03-08', 'Great work'),
(2, 7, 94.00, 'A+', '2026-04-15', 'Excellent normalization'),
(2, 8, 93.00, 'A+', '2026-05-28', 'Well structured'),
(2, 9, 88.00, 'A', '2026-01-25', 'Good OS answers'),
(2, 10, 89.00, 'A', '2026-03-12', 'Understood page replacement'),
(2, 11, 92.00, 'A+', '2026-04-18', 'Strong grasp of deadlocks'),
(2, 12, 91.00, 'A+', '2026-06-02', 'Consistently high'),
(2, 13, 85.00, 'A', '2026-02-02', 'Good networking fundamentals'),
(2, 14, 88.00, 'A', '2026-03-15', 'Reliable work'),
(2, 15, 89.00, 'A', '2026-06-05', 'Solid finals'),
(2, 16, 90.00, 'A+', '2026-02-15', 'Clean Python code'),
(2, 17, 88.00, 'A', '2026-03-20', 'Good accuracy'),
(2, 18, 92.00, 'A+', '2026-06-10', 'Well documented');

-- Student 3: Rohan Verma (Struggles with DSA & OS Synchronization, Needs AI Improvement Plan)
INSERT INTO student_scores (student_id, assessment_id, marks_obtained, letter_grade, submission_date, remarks) VALUES
(3, 1, 62.00, 'C', '2026-01-20', 'Confused with recursion base cases'),
(3, 2, 58.00, 'D', '2026-03-05', 'Struggled with tree traversal algorithms'),
(3, 3, 55.00, 'D', '2026-04-12', 'Unable to formulate dynamic programming state'),
(3, 4, 60.00, 'C-', '2026-05-25', 'Passing grade reached with difficulty'),
(3, 5, 74.00, 'B', '2026-01-22', 'Average SQL performance'),
(3, 6, 70.00, 'B-', '2026-03-08', 'Errors in foreign key constraints'),
(3, 7, 65.00, 'C', '2026-04-15', 'BCNF vs 3NF confusion'),
(3, 8, 68.00, 'C+', '2026-05-28', 'Need query tuning practice'),
(3, 9, 64.00, 'C', '2026-01-25', 'FCFS & SJF formulas missed'),
(3, 10, 52.00, 'D', '2026-03-12', 'Critical misunderstanding of semaphores'),
(3, 11, 56.00, 'D', '2026-04-18', 'Paging page tables calculation wrong'),
(3, 12, 59.00, 'D', '2026-06-02', 'At-risk performance in OS'),
(3, 13, 70.00, 'B-', '2026-02-02', 'Satisfactory'),
(3, 14, 66.00, 'C+', '2026-03-15', 'Subnet masks calculation issues'),
(3, 15, 68.00, 'C+', '2026-06-05', 'Fair'),
(3, 16, 72.00, 'B', '2026-02-15', 'Decent Python notebook'),
(3, 17, 68.00, 'C+', '2026-03-20', 'Confusion on confusion matrix metrics'),
(3, 18, 70.00, 'B-', '2026-06-10', 'Basic model executed');

-- Student 4: Ananya Patel (Moderate Performer, Sharp upward trend)
INSERT INTO student_scores (student_id, assessment_id, marks_obtained, letter_grade, submission_date, remarks) VALUES
(4, 1, 68.00, 'C+', '2026-01-20', 'Slow start'),
(4, 2, 75.00, 'B', '2026-03-05', 'Notable improvement in problem solving'),
(4, 3, 84.00, 'A', '2026-04-12', 'Significant improvement in DP'),
(4, 4, 89.00, 'A', '2026-05-25', 'Strong finish in DSA'),
(4, 5, 78.00, 'B', '2026-01-22', 'Good basics'),
(4, 6, 82.00, 'B+', '2026-03-08', 'Solid ER modeling'),
(4, 7, 85.00, 'A', '2026-04-15', 'Good normalization'),
(4, 8, 88.00, 'A', '2026-05-28', 'Clean indexing solutions'),
(4, 9, 70.00, 'B-', '2026-01-25', 'Fair start'),
(4, 10, 76.00, 'B', '2026-03-12', 'Steady work'),
(4, 11, 80.00, 'B+', '2026-04-18', 'Good grasp of memory management'),
(4, 12, 85.00, 'A', '2026-06-02', 'Great improvement trend'),
(4, 13, 75.00, 'B', '2026-02-02', 'Decent'),
(4, 14, 81.00, 'B+', '2026-03-15', 'Well done'),
(4, 15, 84.00, 'A', '2026-06-05', 'High competence'),
(4, 16, 80.00, 'B+', '2026-02-15', 'Good ML workflow'),
(4, 17, 83.00, 'A', '2026-03-20', 'Strong grasp of hyperparameter tuning'),
(4, 18, 87.00, 'A', '2026-06-10', 'Excellent final presentation');

-- Student 5: Vikram Singh (At-risk, Low attendance correlation)
INSERT INTO student_scores (student_id, assessment_id, marks_obtained, letter_grade, submission_date, remarks) VALUES
(5, 1, 52.00, 'D', '2026-01-20', 'Incomplete paper'),
(5, 2, 48.00, 'F', '2026-03-05', 'Critical gaps in sorting and pointers'),
(5, 3, 50.00, 'F', '2026-04-12', 'Did not attempt dynamic programming'),
(5, 4, 54.00, 'D', '2026-05-25', 'Needs re-examination'),
(5, 5, 60.00, 'C-', '2026-01-22', 'Basic queries only'),
(5, 6, 55.00, 'D', '2026-03-08', 'Foreign keys and joins missing'),
(5, 7, 58.00, 'D', '2026-04-15', 'Normalization errors'),
(5, 8, 62.00, 'C', '2026-05-28', 'Struggling with subqueries'),
(5, 9, 50.00, 'F', '2026-01-25', 'Low attendance evident in test'),
(5, 10, 46.00, 'F', '2026-03-12', 'Missed memory paging concepts'),
(5, 11, 52.00, 'D', '2026-04-18', 'Failed deadlocks question'),
(5, 12, 55.00, 'D', '2026-06-02', 'High risk academic warning'),
(5, 13, 62.00, 'C', '2026-02-02', 'Fair'),
(5, 14, 58.00, 'D', '2026-03-15', 'Struggling with CIDR notation'),
(5, 15, 60.00, 'C-', '2026-06-05', 'Barely passed'),
(5, 16, 65.00, 'C', '2026-02-15', 'Incomplete preprocessing pipeline'),
(5, 17, 59.00, 'D', '2026-03-20', 'Overfitting not handled'),
(5, 18, 63.00, 'C', '2026-06-10', 'Average submission');

-- Populate students 6, 7, 8 with standard varied scores
INSERT INTO student_scores (student_id, assessment_id, marks_obtained, letter_grade, submission_date, remarks) VALUES
(6, 1, 82.00, 'B+', '2026-01-20', 'Good'),
(6, 2, 85.00, 'A', '2026-03-05', 'Good'),
(6, 4, 88.00, 'A', '2026-05-25', 'Strong'),
(6, 5, 86.00, 'A', '2026-01-22', 'Strong'),
(6, 6, 84.00, 'A', '2026-03-08', 'Good'),
(6, 8, 87.00, 'A', '2026-05-28', 'Solid'),
(6, 9, 81.00, 'B+', '2026-01-25', 'Good'),
(6, 12, 83.00, 'A', '2026-06-02', 'Good'),
(6, 15, 82.00, 'B+', '2026-06-05', 'Solid'),
(6, 18, 85.00, 'A', '2026-06-10', 'Strong'),

(7, 1, 74.00, 'B', '2026-01-20', 'Fair'),
(7, 2, 72.00, 'B', '2026-03-05', 'Fair'),
(7, 4, 75.00, 'B', '2026-05-25', 'Fair'),
(7, 5, 78.00, 'B', '2026-01-22', 'Good'),
(7, 6, 76.00, 'B', '2026-03-08', 'Fair'),
(7, 8, 79.00, 'B', '2026-05-28', 'Good'),
(7, 9, 73.00, 'B', '2026-01-25', 'Fair'),
(7, 12, 77.00, 'B', '2026-06-02', 'Fair'),
(7, 15, 74.00, 'B', '2026-06-05', 'Fair'),
(7, 18, 76.00, 'B', '2026-06-10', 'Fair'),

(8, 1, 88.00, 'A', '2026-01-20', 'Great'),
(8, 2, 90.00, 'A+', '2026-03-05', 'Excellent'),
(8, 4, 91.00, 'A+', '2026-05-25', 'Great'),
(8, 5, 87.00, 'A', '2026-01-22', 'Good'),
(8, 6, 89.00, 'A', '2026-03-08', 'Great'),
(8, 8, 92.00, 'A+', '2026-05-28', 'Excellent'),
(8, 9, 86.00, 'A', '2026-01-25', 'Solid'),
(8, 12, 88.00, 'A', '2026-06-02', 'Great'),
(8, 15, 89.00, 'A', '2026-06-05', 'Great'),
(8, 18, 91.00, 'A+', '2026-06-10', 'Great');

-- 6. Insert Topic Evaluations (Granular diagnostic skill records)
INSERT INTO topic_evaluations (student_id, topic_id, mastery_percentage, last_evaluated) VALUES
-- Sachin Gurjar
(1, 1, 92.00, '2026-05-20'), -- BST
(1, 2, 88.00, '2026-05-20'), -- Graphs
(1, 3, 82.00, '2026-05-20'), -- DP
(1, 5, 98.00, '2026-05-20'), -- Relational & SQL
(1, 6, 95.00, '2026-05-20'), -- Normalization
(1, 7, 94.00, '2026-05-20'), -- Transactions
(1, 8, 96.00, '2026-05-20'), -- Query Optimization
(1, 10, 72.00, '2026-05-20'), -- Deadlocks
(1, 11, 79.00, '2026-05-20'), -- Virtual Memory
(1, 12, 70.00, '2026-05-20'), -- Semaphores (Target for AI plan)
(1, 14, 88.00, '2026-05-20'), -- Subnetting
(1, 16, 91.00, '2026-05-20'), -- TCP Handshake
(1, 17, 95.00, '2026-05-20'), -- Regression
(1, 20, 93.00, '2026-05-20'), -- Model Eval

-- Rohan Verma (Multiple weak areas)
(3, 1, 60.00, '2026-05-20'),
(3, 2, 54.00, '2026-05-20'),
(3, 3, 48.00, '2026-05-20'), -- Weak: DP
(3, 5, 68.00, '2026-05-20'),
(3, 6, 52.00, '2026-05-20'), -- Weak: Normalization
(3, 7, 64.00, '2026-05-20'),
(3, 10, 45.00, '2026-05-20'), -- Weak: Deadlocks
(3, 11, 50.00, '2026-05-20'), -- Weak: Virtual Memory
(3, 12, 42.00, '2026-05-20'), -- Weak: Semaphores
(3, 14, 58.00, '2026-05-20'), -- Weak: Subnetting
(3, 17, 65.00, '2026-05-20'),
(3, 20, 56.00, '2026-05-20'), -- Weak: Evaluation metrics

-- Vikram Singh (High risk student)
(5, 1, 45.00, '2026-05-20'),
(5, 2, 40.00, '2026-05-20'),
(5, 3, 35.00, '2026-05-20'),
(5, 5, 55.00, '2026-05-20'),
(5, 6, 48.00, '2026-05-20'),
(5, 10, 40.00, '2026-05-20'),
(5, 11, 44.00, '2026-05-20'),
(5, 12, 38.00, '2026-05-20'),
(5, 14, 50.00, '2026-05-20'),
(5, 17, 52.00, '2026-05-20');

-- 7. Insert Attendance Records (Multi-date samples)
INSERT INTO attendance (student_id, subject_id, attendance_date, status, session_topic) VALUES
-- Sachin: 95% attendance
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

-- Priya: 98% attendance
(2, 1, '2026-01-15', 'Present', 'Introduction & Complexity Analysis'),
(2, 1, '2026-01-18', 'Present', 'Binary Trees'),
(2, 1, '2026-01-22', 'Present', 'AVL Balance Factor'),
(2, 1, '2026-01-26', 'Present', 'Graph DFS/BFS'),
(2, 2, '2026-01-16', 'Present', 'Relational Model & Keys'),
(2, 2, '2026-01-20', 'Present', 'Advanced SQL Joins'),
(2, 3, '2026-01-17', 'Present', 'CPU Scheduling Algorithms'),
(2, 3, '2026-01-21', 'Present', 'Process Synchronization Semaphores'),

-- Rohan: 75% attendance (Several absences)
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

-- Vikram: 52% attendance (Critical attendance issue)
(5, 1, '2026-01-15', 'Absent', 'Introduction & Complexity Analysis'),
(5, 1, '2026-01-18', 'Absent', 'Binary Trees'),
(5, 1, '2026-01-22', 'Present', 'AVL Balance Factor'),
(5, 1, '2026-01-26', 'Absent', 'Graph DFS/BFS'),
(5, 2, '2026-01-16', 'Present', 'Relational Model & Keys'),
(5, 2, '2026-01-20', 'Absent', 'Advanced SQL Joins'),
(5, 3, '2026-01-17', 'Absent', 'CPU Scheduling Algorithms'),
(5, 3, '2026-01-21', 'Absent', 'Process Synchronization Semaphores'),
(5, 3, '2026-01-28', 'Absent', 'Bankers Algorithm & Deadlocks');
