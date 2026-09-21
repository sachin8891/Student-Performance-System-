-- ============================================================================
-- AI-Powered Student Performance Tracker - Production Analytical SQL Queries
-- Purpose: Demonstrate deep SQL querying capabilities for extracting performance
-- metrics, subject trends, attendance correlation, and academic risk detection.
-- ============================================================================

USE student_performance_db;

-- ----------------------------------------------------------------------------
-- QUERY 1: Overall Student Cumulative Performance & Class Ranking
-- Uses aggregate functions and Window function DENSE_RANK()
-- ----------------------------------------------------------------------------
SELECT 
    s.student_id,
    s.roll_number,
    CONCAT(s.first_name, ' ', s.last_name) AS full_name,
    s.email,
    COUNT(sc.score_id) AS total_assessments_taken,
    ROUND(AVG(sc.marks_obtained), 2) AS cumulative_average_percentage,
    CASE 
        WHEN AVG(sc.marks_obtained) >= 90 THEN 'A+ (Distinction)'
        WHEN AVG(sc.marks_obtained) >= 80 THEN 'A (First Class with Distinction)'
        WHEN AVG(sc.marks_obtained) >= 70 THEN 'B (First Class)'
        WHEN AVG(sc.marks_obtained) >= 60 THEN 'C (Second Class)'
        ELSE 'Needs Remediation'
    END AS academic_standing,
    DENSE_RANK() OVER (ORDER BY AVG(sc.marks_obtained) DESC) AS cohort_rank
FROM students s
JOIN student_scores sc ON s.student_id = sc.student_id
GROUP BY s.student_id, s.roll_number, s.first_name, s.last_name, s.email
ORDER BY cohort_rank ASC;

-- ----------------------------------------------------------------------------
-- QUERY 2: Subject-wise Performance Metrics & Difficulty Analysis
-- Aggregates average, standard deviation, highest, lowest, and pass rates (>50%)
-- ----------------------------------------------------------------------------
SELECT 
    sub.subject_code,
    sub.subject_name,
    sub.faculty_name,
    COUNT(sc.score_id) AS total_submissions,
    ROUND(AVG(sc.marks_obtained), 2) AS subject_class_average,
    ROUND(MIN(sc.marks_obtained), 2) AS lowest_score,
    ROUND(MAX(sc.marks_obtained), 2) AS highest_score,
    ROUND(STDDEV(sc.marks_obtained), 2) AS score_standard_deviation,
    ROUND((SUM(CASE WHEN sc.marks_obtained >= 50 THEN 1 ELSE 0 END) * 100.0) / COUNT(sc.score_id), 2) AS pass_percentage
FROM subjects sub
JOIN assessments a ON sub.subject_id = a.subject_id
JOIN student_scores sc ON a.assessment_id = sc.assessment_id
GROUP BY sub.subject_id, sub.subject_code, sub.subject_name, sub.faculty_name
ORDER BY subject_class_average ASC;

-- ----------------------------------------------------------------------------
-- QUERY 3: Longitudinal Assessment Score Progression & Trajectory
-- Tracks a student's score from early quizzes to midterms and final exams
-- ----------------------------------------------------------------------------
SELECT 
    s.student_id,
    CONCAT(s.first_name, ' ', s.last_name) AS student_name,
    sub.subject_name,
    a.title AS assessment_name,
    a.assessment_type,
    a.assessment_date,
    sc.marks_obtained,
    sc.letter_grade,
    LAG(sc.marks_obtained, 1) OVER (
        PARTITION BY s.student_id, sub.subject_id 
        ORDER BY a.assessment_date
    ) AS previous_assessment_score,
    ROUND(sc.marks_obtained - LAG(sc.marks_obtained, 1) OVER (
        PARTITION BY s.student_id, sub.subject_id 
        ORDER BY a.assessment_date
    ), 2) AS score_change_delta
FROM students s
JOIN student_scores sc ON s.student_id = sc.student_id
JOIN assessments a ON sc.assessment_id = a.assessment_id
JOIN subjects sub ON a.subject_id = sub.subject_id
ORDER BY s.student_id, sub.subject_id, a.assessment_date;

-- ----------------------------------------------------------------------------
-- QUERY 4: Attendance vs Exam Performance Correlation
-- Groups students into attendance tiers and analyzes the correlation with grades
-- ----------------------------------------------------------------------------
WITH StudentAttendance AS (
    SELECT 
        student_id,
        COUNT(attendance_id) AS total_sessions,
        SUM(CASE WHEN status = 'Present' THEN 1 WHEN status = 'Late' THEN 0.5 ELSE 0 END) AS effective_attended,
        ROUND((SUM(CASE WHEN status = 'Present' THEN 1 WHEN status = 'Late' THEN 0.5 ELSE 0 END) * 100.0) / COUNT(attendance_id), 2) AS attendance_rate
    FROM attendance
    GROUP BY student_id
),
StudentPerformance AS (
    SELECT 
        student_id,
        ROUND(AVG(marks_obtained), 2) AS avg_academic_score
    FROM student_scores
    GROUP BY student_id
)
SELECT 
    s.student_id,
    CONCAT(s.first_name, ' ', s.last_name) AS student_name,
    sa.attendance_rate,
    sp.avg_academic_score,
    CASE 
        WHEN sa.attendance_rate >= 85 THEN 'High Attendance (>= 85%)'
        WHEN sa.attendance_rate >= 75 THEN 'Moderate Attendance (75-84%)'
        ELSE 'Low / At-Risk Attendance (< 75%)'
    END AS attendance_tier
FROM students s
JOIN StudentAttendance sa ON s.student_id = sa.student_id
JOIN StudentPerformance sp ON s.student_id = sp.student_id
ORDER BY sa.attendance_rate DESC;

-- ----------------------------------------------------------------------------
-- QUERY 5: Diagnostic Weak-Topic Identifier for AI Prompt Ingestion
-- Extracts all syllabus topics where student mastery is below 65%
-- ----------------------------------------------------------------------------
SELECT 
    s.student_id,
    CONCAT(s.first_name, ' ', s.last_name) AS student_name,
    sub.subject_code,
    sub.subject_name,
    st.topic_name,
    st.difficulty_level,
    te.mastery_percentage,
    te.last_evaluated
FROM topic_evaluations te
JOIN students s ON te.student_id = s.student_id
JOIN subject_topics st ON te.topic_id = st.topic_id
JOIN subjects sub ON st.subject_id = sub.subject_id
WHERE te.mastery_percentage < 65.00
ORDER BY s.student_id, te.mastery_percentage ASC;

-- ----------------------------------------------------------------------------
-- QUERY 6: Comprehensive Academic Early Warning & Risk Matrix
-- Flags students who are at academic risk due to low GPA, low attendance, or failed assessments
-- ----------------------------------------------------------------------------
SELECT 
    s.student_id,
    s.roll_number,
    CONCAT(s.first_name, ' ', s.last_name) AS student_name,
    ROUND(AVG(sc.marks_obtained), 2) AS avg_score,
    COUNT(CASE WHEN sc.marks_obtained < 50 THEN 1 END) AS failed_assessments_count,
    CASE 
        WHEN AVG(sc.marks_obtained) < 60 OR COUNT(CASE WHEN sc.marks_obtained < 50 THEN 1 END) >= 2 
             THEN 'HIGH RISK - Immediate Intervention Required'
        WHEN AVG(sc.marks_obtained) < 75 
             THEN 'MODERATE RISK - Personalized AI Study Plan Suggested'
        ELSE 'LOW RISK - On Track'
    END AS risk_classification
FROM students s
JOIN student_scores sc ON s.student_id = sc.student_id
GROUP BY s.student_id, s.roll_number, s.first_name, s.last_name
ORDER BY avg_score ASC;
