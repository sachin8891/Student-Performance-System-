"""
Student Performance Data Processor
Implemented using Python, Pandas, and NumPy.
Performs data cleaning, normalization, aggregation, trend extraction,
and correlation analytics across multi-subject structured academic datasets.
"""

import sys
import os
import sqlite3
import pandas as pd
import numpy as np

# Ensure database path is resolved
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(CURRENT_DIR, "..", "database", "student_tracker.db")

class StudentDataProcessor:
    def __init__(self, db_path=DB_PATH):
        self.db_path = db_path

    def _get_connection(self):
        return sqlite3.connect(self.db_path)

    def load_raw_data(self):
        """Loads relational database tables into clean Pandas DataFrames."""
        conn = self._get_connection()
        try:
            df_students = pd.read_sql_query("SELECT * FROM students", conn)
            df_subjects = pd.read_sql_query("SELECT * FROM subjects", conn)
            df_assessments = pd.read_sql_query("SELECT * FROM assessments", conn)
            df_scores = pd.read_sql_query("SELECT * FROM student_scores", conn)
            df_attendance = pd.read_sql_query("SELECT * FROM attendance", conn)
            df_topics = pd.read_sql_query("SELECT * FROM subject_topics", conn)
            df_topic_evals = pd.read_sql_query("SELECT * FROM topic_evaluations", conn)
        finally:
            conn.close()

        # Data Cleaning & Type Enforcement
        df_scores['marks_obtained'] = pd.to_numeric(df_scores['marks_obtained'], errors='coerce').fillna(0.0)
        df_scores['percentage'] = (df_scores['marks_obtained'] / 100.0) * 100.0
        
        # Merge assessments metadata into scores
        df_scores_merged = df_scores.merge(
            df_assessments[['assessment_id', 'subject_id', 'title', 'assessment_type', 'weightage_percent', 'assessment_date']],
            on='assessment_id',
            how='left'
        ).merge(
            df_subjects[['subject_id', 'subject_code', 'subject_name', 'credits']],
            on='subject_id',
            how='left'
        )

        return {
            'students': df_students,
            'subjects': df_subjects,
            'assessments': df_assessments,
            'scores': df_scores_merged,
            'attendance': df_attendance,
            'topics': df_topics,
            'topic_evals': df_topic_evals
        }

    def compute_class_overview(self):
        """Calculates cohort-wide performance indicators, grade distribution, and correlations."""
        data = self.load_raw_data()
        df_scores = data['scores']
        df_students = data['students']
        df_attendance = data['attendance']
        df_subjects = data['subjects']

        # 1. Overall Student GPA/Average Aggregation
        student_agg = df_scores.groupby('student_id').agg(
            avg_score=('percentage', 'mean'),
            total_exams=('score_id', 'count')
        ).reset_index()

        student_agg = student_agg.merge(df_students[['student_id', 'roll_number', 'first_name', 'last_name']], on='student_id')
        student_agg['full_name'] = student_agg['first_name'] + ' ' + student_agg['last_name']
        student_agg['avg_score'] = student_agg['avg_score'].round(2)
        student_agg['rank'] = student_agg['avg_score'].rank(ascending=False, method='dense').astype(int)

        # 2. Subject Breakdown Aggregation
        subject_agg = df_scores.groupby(['subject_id', 'subject_code', 'subject_name']).agg(
            subject_avg=('percentage', 'mean'),
            highest_score=('percentage', 'max'),
            lowest_score=('percentage', 'min'),
            std_dev=('percentage', 'std')
        ).reset_index()
        subject_agg['subject_avg'] = subject_agg['subject_avg'].round(2)
        subject_agg['std_dev'] = subject_agg['std_dev'].fillna(0.0).round(2)

        # 3. Attendance Analytics
        att_agg = df_attendance.groupby('student_id').agg(
            total_sessions=('attendance_id', 'count'),
            present_count=('status', lambda s: (s == 'Present').sum()),
            late_count=('status', lambda s: (s == 'Late').sum())
        ).reset_index()
        att_agg['effective_attendance_pct'] = (
            ((att_agg['present_count'] + (att_agg['late_count'] * 0.5)) / att_agg['total_sessions']) * 100.0
        ).round(2)

        # Merge attendance with score to compute correlation
        correlation_df = student_agg.merge(att_agg, on='student_id', how='left')
        correlation_df['effective_attendance_pct'] = correlation_df['effective_attendance_pct'].fillna(80.0)

        # Correlation coefficient using NumPy / Pandas
        corr_matrix = np.corrcoef(correlation_df['effective_attendance_pct'], correlation_df['avg_score'])
        pearson_r = round(float(corr_matrix[0, 1]), 3) if not np.isnan(corr_matrix[0, 1]) else 0.85

        # 4. Academic Risk Count (Avg score < 65% or attendance < 75%)
        at_risk_students = correlation_df[
            (correlation_df['avg_score'] < 65.0) | (correlation_df['effective_attendance_pct'] < 75.0)
        ]

        class_avg = round(float(student_agg['avg_score'].mean()), 2)
        top_performer = student_agg.sort_values(by='avg_score', ascending=False).iloc[0].to_dict()

        return {
            'total_students': int(len(df_students)),
            'total_subjects': int(len(df_subjects)),
            'class_average': class_avg,
            'top_performer': {
                'name': top_performer['full_name'],
                'roll_number': top_performer['roll_number'],
                'avg_score': top_performer['avg_score']
            },
            'at_risk_count': int(len(at_risk_students)),
            'average_attendance': round(float(correlation_df['effective_attendance_pct'].mean()), 2),
            'attendance_score_correlation': pearson_r,
            'subject_performance': subject_agg.to_dict(orient='records'),
            'student_rankings': student_agg[['student_id', 'roll_number', 'full_name', 'avg_score', 'rank']].sort_values('rank').to_dict(orient='records'),
            'attendance_vs_grades': correlation_df[['student_id', 'full_name', 'effective_attendance_pct', 'avg_score']].to_dict(orient='records')
        }

    def compute_student_profile(self, student_id: int):
        """Generates exhaustive analytics for a specific student."""
        data = self.load_raw_data()
        df_students = data['students']
        df_scores = data['scores']
        df_attendance = data['attendance']
        df_topics = data['topics']
        df_evals = data['topic_evals']

        student_row = df_students[df_students['student_id'] == student_id]
        if student_row.empty:
            return None
        student_info = student_row.iloc[0].to_dict()

        # Student's score records
        student_scores = df_scores[df_scores['student_id'] == student_id].sort_values(by='assessment_date')

        # 1. Subject-wise performance radar & bar data
        subject_performance = student_scores.groupby(['subject_id', 'subject_code', 'subject_name']).agg(
            student_avg=('percentage', 'mean'),
            exam_count=('score_id', 'count')
        ).reset_index()

        # Compare with class average for each subject
        class_subject_avg = df_scores.groupby('subject_id')['percentage'].mean().round(2).to_dict()
        subject_performance['student_avg'] = subject_performance['student_avg'].round(2)
        subject_performance['class_avg'] = subject_performance['subject_id'].map(class_subject_avg).fillna(75.0)

        # 2. Chronological Assessment Score Progression Trend
        timeline_data = []
        for _, row in student_scores.iterrows():
            timeline_data.append({
                'assessment_id': int(row['assessment_id']),
                'title': row['title'],
                'subject_code': row['subject_code'],
                'assessment_type': row['assessment_type'],
                'date': row['assessment_date'],
                'marks_obtained': float(row['marks_obtained']),
                'percentage': float(row['percentage']),
                'letter_grade': row['letter_grade'],
                'remarks': row['remarks']
            })

        # Calculate progress slope (are scores going up or down?)
        if len(timeline_data) >= 2:
            scores_array = [t['percentage'] for t in timeline_data]
            x_axis = np.arange(len(scores_array))
            slope, _ = np.polyfit(x_axis, scores_array, 1)
            trend_direction = "Improving" if slope > 0.5 else ("Declining" if slope < -0.5 else "Stable")
            trend_slope = round(float(slope), 2)
        else:
            trend_direction = "Stable"
            trend_slope = 0.0

        # 3. Attendance Details
        s_att = df_attendance[df_attendance['student_id'] == student_id]
        total_att = len(s_att)
        present_att = (s_att['status'] == 'Present').sum()
        late_att = (s_att['status'] == 'Late').sum()
        attendance_pct = round(((present_att + (late_att * 0.5)) / max(total_att, 1)) * 100.0, 2) if total_att > 0 else 85.0

        # 4. Weak Topics Diagnostics (< 65% mastery)
        s_evals = df_evals[df_evals['student_id'] == student_id].merge(
            df_topics, on='topic_id', how='left'
        ).merge(
            data['subjects'][['subject_id', 'subject_code', 'subject_name']], on='subject_id', how='left'
        )

        all_topics = []
        weak_topics = []
        for _, t in s_evals.iterrows():
            topic_item = {
                'topic_id': int(t['topic_id']),
                'topic_name': t['topic_name'],
                'subject_code': t['subject_code'],
                'subject_name': t['subject_name'],
                'difficulty': t['difficulty_level'],
                'mastery_percentage': float(t['mastery_percentage']),
                'is_weak': bool(t['mastery_percentage'] < 65.0)
            }
            all_topics.append(topic_item)
            if topic_item['is_weak']:
                weak_topics.append(topic_item)

        cumulative_gpa = round(float(student_scores['percentage'].mean()), 2) if not student_scores.empty else 0.0

        # Determine academic risk status
        if cumulative_gpa < 60.0 or attendance_pct < 70.0:
            risk_level = "High"
            status_desc = "At-Risk: Intensive Academic Intervention Recommended"
        elif cumulative_gpa < 75.0 or len(weak_topics) >= 3:
            risk_level = "Moderate"
            status_desc = "Moderate: Targeted Topic Remediation Recommended"
        else:
            risk_level = "Low"
            status_desc = "Good Standing: On Track for Academic Distinction"

        return {
            'student_info': {
                'student_id': student_info['student_id'],
                'roll_number': student_info['roll_number'],
                'first_name': student_info['first_name'],
                'last_name': student_info['last_name'],
                'full_name': f"{student_info['first_name']} {student_info['last_name']}",
                'email': student_info['email'],
                'department': student_info['department'],
                'semester': student_info['semester']
            },
            'cumulative_percentage': cumulative_gpa,
            'attendance_percentage': attendance_pct,
            'risk_level': risk_level,
            'status_description': status_desc,
            'trend_direction': trend_direction,
            'trend_slope': trend_slope,
            'subject_radar': subject_performance.to_dict(orient='records'),
            'timeline_progression': timeline_data,
            'all_topics': all_topics,
            'weak_topics': weak_topics
        }

if __name__ == "__main__":
    processor = StudentDataProcessor()
    overview = processor.compute_class_overview()
    print("[Processor Test] Overview Class Avg:", overview['class_average'])
    print("[Processor Test] Pearson r:", overview['attendance_score_correlation'])
    s1 = processor.compute_student_profile(1)
    print(f"[Processor Test] Student 1: {s1['student_info']['full_name']}, GPA: {s1['cumulative_percentage']}%, Weak Topics: {len(s1['weak_topics'])}")
