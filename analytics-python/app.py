"""
Flask REST API for AI-Powered Student Performance Tracker
Serves analytical endpoints, student score management, SQL query engine,
and Generative AI plan generation.
"""

import os
import sqlite3
from flask import Flask, jsonify, request
from flask_cors import CORS
from data_processor import StudentDataProcessor
from ai_service import StudentAIService

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

processor = StudentDataProcessor()
ai_service = StudentAIService()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'AI-Powered Student Performance Analytics API',
        'version': '1.0.0'
    })

@app.route('/api/analytics/overview', methods=['GET'])
def get_overview():
    try:
        overview_data = processor.compute_class_overview()
        return jsonify(overview_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics/students', methods=['GET'])
def get_students_list():
    try:
        data = processor.load_raw_data()
        df_students = data['students']
        students_list = df_students[['student_id', 'roll_number', 'first_name', 'last_name', 'email', 'department', 'semester']].to_dict(orient='records')
        for s in students_list:
            s['full_name'] = f"{s['first_name']} {s['last_name']}"
        return jsonify(students_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics/student/<int:student_id>', methods=['GET'])
def get_student_profile(student_id):
    try:
        profile = processor.compute_student_profile(student_id)
        if not profile:
            return jsonify({'error': f'Student with ID {student_id} not found'}), 404
        return jsonify(profile)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics/generate-plan/<int:student_id>', methods=['POST'])
def generate_ai_plan(student_id):
    try:
        profile = processor.compute_student_profile(student_id)
        if not profile:
            return jsonify({'error': f'Student with ID {student_id} not found'}), 404
        plan = ai_service.generate_personalized_plan(profile)
        return jsonify({
            'success': True,
            'plan': plan
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics/student/<int:student_id>/plans', methods=['GET'])
def get_student_plans(student_id):
    try:
        plans = ai_service.get_student_saved_plans(student_id)
        return jsonify(plans)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics/sql-queries', methods=['GET'])
def get_sql_queries_and_results():
    """
    Returns the core analytical SQL queries from the database suite
    along with their live execution results for interactive demonstration.
    """
    conn = sqlite3.connect(processor.db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    queries = [
        {
            "id": 1,
            "title": "Overall Student Cumulative Performance & Class Ranking",
            "description": "Calculates average score, standing, and rank for every student using SQL aggregation and window functions.",
            "sql": """
SELECT 
    s.student_id,
    s.roll_number,
    (s.first_name || ' ' || s.last_name) AS full_name,
    COUNT(sc.score_id) AS total_assessments,
    ROUND(AVG(sc.marks_obtained), 2) AS cumulative_avg_pct,
    DENSE_RANK() OVER (ORDER BY AVG(sc.marks_obtained) DESC) AS cohort_rank
FROM students s
JOIN student_scores sc ON s.student_id = sc.student_id
GROUP BY s.student_id, s.roll_number, s.first_name, s.last_name
ORDER BY cohort_rank ASC;
            """
        },
        {
            "id": 2,
            "title": "Subject-wise Performance & Difficulty Metrics",
            "description": "Computes subject-level average, min, max, and pass percentages across the department.",
            "sql": """
SELECT 
    sub.subject_code,
    sub.subject_name,
    sub.faculty_name,
    COUNT(sc.score_id) AS total_submissions,
    ROUND(AVG(sc.marks_obtained), 2) AS class_average,
    ROUND(MIN(sc.marks_obtained), 2) AS min_score,
    ROUND(MAX(sc.marks_obtained), 2) AS max_score
FROM subjects sub
JOIN assessments a ON sub.subject_id = a.subject_id
JOIN student_scores sc ON a.assessment_id = sc.assessment_id
GROUP BY sub.subject_id, sub.subject_code, sub.subject_name, sub.faculty_name
ORDER BY class_average ASC;
            """
        },
        {
            "id": 3,
            "title": "Attendance vs Exam Grade Correlation",
            "description": "Analyzes correlation between attendance percentages and examination scores.",
            "sql": """
WITH AttData AS (
    SELECT 
        student_id,
        ROUND((SUM(CASE WHEN status = 'Present' THEN 1.0 WHEN status = 'Late' THEN 0.5 ELSE 0.0 END) * 100.0) / COUNT(attendance_id), 2) AS attendance_pct
    FROM attendance
    GROUP BY student_id
)
SELECT 
    s.student_id,
    (s.first_name || ' ' || s.last_name) AS student_name,
    COALESCE(ad.attendance_pct, 85.0) AS attendance_rate,
    ROUND(AVG(sc.marks_obtained), 2) AS avg_score,
    CASE 
        WHEN COALESCE(ad.attendance_pct, 85.0) >= 85 THEN 'High Attendance (>=85%)'
        WHEN COALESCE(ad.attendance_pct, 85.0) >= 75 THEN 'Moderate (75-84%)'
        ELSE 'At-Risk (<75%)'
    END AS attendance_tier
FROM students s
LEFT JOIN AttData ad ON s.student_id = ad.student_id
JOIN student_scores sc ON s.student_id = sc.student_id
GROUP BY s.student_id, s.first_name, s.last_name, ad.attendance_pct
ORDER BY attendance_rate DESC;
            """
        },
        {
            "id": 4,
            "title": "Weak Topic Diagnostics (<65% Mastery)",
            "description": "Identifies granular syllabus topics where students need remediation before final exams.",
            "sql": """
SELECT 
    (s.first_name || ' ' || s.last_name) AS student_name,
    sub.subject_code,
    st.topic_name,
    st.difficulty_level,
    te.mastery_percentage
FROM topic_evaluations te
JOIN students s ON te.student_id = s.student_id
JOIN subject_topics st ON te.topic_id = st.topic_id
JOIN subjects sub ON st.subject_id = sub.subject_id
WHERE te.mastery_percentage < 65.0
ORDER BY te.mastery_percentage ASC;
            """
        }
    ]

    results = []
    try:
        for q in queries:
            cursor.execute(q['sql'])
            rows = [dict(r) for r in cursor.fetchall()]
            results.append({
                "id": q['id'],
                "title": q['title'],
                "description": q['description'],
                "sql": q['sql'].strip(),
                "data": rows
            })
        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/analytics/score', methods=['POST'])
def add_or_update_score():
    """Endpoint for ingesting and validating a student score record."""
    try:
        payload = request.get_json()
        student_id = payload.get('student_id')
        assessment_id = payload.get('assessment_id')
        marks = float(payload.get('marks_obtained', 0))
        remarks = payload.get('remarks', 'Manual update via API')

        # Validation
        if not student_id or not assessment_id:
            return jsonify({'error': 'student_id and assessment_id are required'}), 400
        if marks < 0 or marks > 100:
            return jsonify({'error': 'marks_obtained must be between 0 and 100'}), 400

        grade = 'A+' if marks >= 90 else ('A' if marks >= 80 else ('B' if marks >= 70 else ('C' if marks >= 60 else ('D' if marks >= 50 else 'F'))))

        conn = sqlite3.connect(processor.db_path)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO student_scores (student_id, assessment_id, marks_obtained, letter_grade, submission_date, remarks)
            VALUES (?, ?, ?, ?, date('now'), ?)
            ON CONFLICT(student_id, assessment_id) DO UPDATE SET
                marks_obtained = excluded.marks_obtained,
                letter_grade = excluded.letter_grade,
                remarks = excluded.remarks,
                submission_date = date('now')
        """, (student_id, assessment_id, marks, grade, remarks))
        conn.commit()
        conn.close()

        return jsonify({'success': True, 'message': 'Score saved successfully', 'grade': grade})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("[API Server] Starting Student Performance Analytics API on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=False)
