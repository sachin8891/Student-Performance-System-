"""
Generative AI Integration Service for Student Improvement Roadmaps.
Combines structured performance metrics with Generative AI prompts
to generate personalized diagnostic insights, weekly action plans,
and recommended learning resources.
"""

import os
import json
import sqlite3
import datetime
import requests

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(CURRENT_DIR, "..", "database", "student_tracker.db")

class StudentAIService:
    def __init__(self, db_path=DB_PATH):
        self.db_path = db_path
        self.api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")

    def _get_connection(self):
        return sqlite3.connect(self.db_path)

    def generate_personalized_plan(self, profile: dict) -> dict:
        """
        Generates an AI-powered personalized improvement plan for a given student profile.
        If a Gemini API key is configured, queries the Gemini API.
        Otherwise, uses the built-in Intelligent Analytical Synthesis Engine.
        """
        student_info = profile['student_info']
        student_id = student_info['student_id']
        name = student_info['full_name']
        roll = student_info['roll_number']
        gpa = profile['cumulative_percentage']
        attendance = profile['attendance_percentage']
        risk_level = profile['risk_level']
        trend = profile['trend_direction']
        weak_topics = profile['weak_topics']
        subject_radar = profile['subject_radar']

        # Format weak topics summary
        if weak_topics:
            weak_topics_text = "\n".join([
                f"- {w['subject_name']} ({w['subject_code']}): {w['topic_name']} "
                f"[Mastery: {w['mastery_percentage']}%, Difficulty: {w['difficulty']}]"
                for w in weak_topics
            ])
        else:
            weak_topics_text = "No critical subject failure points. Focus on advanced mastery and competitive problem solving."

        # Attempt to call Gemini API if key is available
        if self.api_key:
            try:
                ai_result = self._call_gemini_api(name, roll, gpa, attendance, risk_level, trend, weak_topics_text, subject_radar)
                if ai_result:
                    self._save_plan_to_db(student_id, risk_level, weak_topics_text, ai_result)
                    return ai_result
            except Exception as e:
                print(f"[AI Service Warning] Gemini API call failed: {e}. Falling back to analytical synthesis.")

        # Fallback to Intelligent Analytical Synthesis Engine
        plan = self._generate_synthetic_ai_plan(name, roll, gpa, attendance, risk_level, trend, weak_topics, subject_radar)
        self._save_plan_to_db(student_id, risk_level, weak_topics_text, plan)
        return plan

    def _call_gemini_api(self, name, roll, gpa, attendance, risk_level, trend, weak_topics_text, subject_radar):
        """Calls the Gemini REST API to produce a structured JSON improvement plan."""
        prompt = f"""
You are an expert Senior Academic Advisor and AI Educational Tutor. Analyze the following structured academic performance data for a Computer Science & Engineering student:

STUDENT PROFILE:
- Name: {name} (Roll No: {roll})
- Cumulative Average: {gpa}%
- Attendance Rate: {attendance}%
- Progress Trajectory: {trend}
- Risk Level: {risk_level}

DIAGNOSTIC WEAK TOPICS:
{weak_topics_text}

SUBJECT BREAKDOWN:
{json.dumps(subject_radar, indent=2)}

TASK:
Produce a comprehensive, personalized 4-week Academic Improvement Plan.
Return ONLY valid JSON matching this exact schema:
{{
  "overall_summary": "Concise diagnostic assessment of current standing and strengths/weaknesses",
  "root_cause_analysis": "Diagnostic breakdown of why the student is struggling or how to advance further",
  "weak_topics_targeted": ["topic 1", "topic 2"],
  "weekly_action_plan": [
    {{
      "week": 1,
      "theme": "Foundation Rebuilding & Conceptual Clarity",
      "daily_milestones": ["Day 1-2: ...", "Day 3-4: ...", "Day 5-6: ...", "Day 7: Review quiz"],
      "expected_outcome": "Clear measurable target"
    }},
    {{
      "week": 2,
      "theme": "Core Problem Solving & Applied Practice",
      "daily_milestones": ["Day 8-9: ...", "Day 10-11: ...", "Day 12-13: ...", "Day 14: Checkpoint"],
      "expected_outcome": "Clear measurable target"
    }},
    {{
      "week": 3,
      "theme": "Edge Cases, Optimization & Timed Tests",
      "daily_milestones": ["Day 15-17: ...", "Day 18-20: ...", "Day 21: Full simulation"],
      "expected_outcome": "Clear measurable target"
    }},
    {{
      "week": 4,
      "theme": "Consolidation & Exam Readiness",
      "daily_milestones": ["Day 22-24: ...", "Day 25-27: ...", "Day 28: Final assessment review"],
      "expected_outcome": "Clear measurable target"
    }}
  ],
  "recommended_resources": [
    {{ "title": "Resource title", "type": "Book / Interactive Tool / Practice Problem Set", "focus_area": "Subject or Topic" }}
  ],
  "motivational_note": "Empathetic, highly encouraging closing remark tailored to the student"
}}
"""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.api_key}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"response_mime_type": "application/json"}
        }
        headers = {"Content-Type": "application/json"}
        resp = requests.post(url, json=payload, headers=headers, timeout=20)
        if resp.status_code == 200:
            data = resp.json()
            text_response = data['candidates'][0]['content']['parts'][0]['text']
            return json.loads(text_response)
        return None

    def _generate_synthetic_ai_plan(self, name, roll, gpa, attendance, risk_level, trend, weak_topics, subject_radar):
        """
        Generates a tailored academic roadmap based on student's actual performance data
        and weak topic profiles.
        """
        targeted_topics = [w['topic_name'] for w in weak_topics] if weak_topics else ["System Architecture Optimization", "Advanced Algorithmic Design"]

        if risk_level == "High":
            summary = (
                f"{name} is currently flagged as High Academic Risk with an overall score of {gpa}% "
                f"and an attendance rate of {attendance}%. Immediate systematic intervention is required "
                f"in foundational computing concepts and lecture consistency."
            )
            root_cause = (
                f"The correlation between {attendance}% attendance and low assessment scores points to missed "
                f"interactive classroom problem sessions. Misconceptions in foundational topics "
                f"({', '.join(targeted_topics[:3])}) are compounding across cumulative examinations."
            )
        elif risk_level == "Moderate":
            summary = (
                f"{name} maintains a solid baseline ({gpa}%), but is held back by specific conceptual bottlenecks "
                f"in {len(targeted_topics)} key areas. With targeted remediation, progression to distinction is achievable."
            )
            root_cause = (
                f"Performance across regular assessments is stable, but diagnostic scores drop on higher-order "
                f"topics ({', '.join(targeted_topics[:2])}). Transitioning from passive lecture reading to active "
                f"code execution and problem sets will bridge the performance gap."
            )
        else:
            summary = (
                f"{name} exhibits strong academic excellence ({gpa}% cumulative GPA) with a {trend.lower()} trajectory. "
                f"The student is ready for competitive programming, advanced research architectures, and capstone design."
            )
            root_cause = (
                f"Core foundations in {', '.join([s['subject_name'] for s in subject_radar[:2]])} are exceptional. "
                f"Focus should now shift toward distributed systems scalability, query profiling under high load, and algorithmic efficiency."
            )

        # Weekly Schedule customized to weak topics
        week1_target = targeted_topics[0] if len(targeted_topics) > 0 else "Algorithmic Efficiency"
        week2_target = targeted_topics[1] if len(targeted_topics) > 1 else "Database Transactions"
        week3_target = targeted_topics[2] if len(targeted_topics) > 2 else "Concurrency & OS Virtual Memory"

        weekly_plan = [
            {
                "week": 1,
                "theme": f"Foundational Rebuilding: {week1_target}",
                "daily_milestones": [
                    f"Day 1-2: Review core definitions, memory state diagrams, and lectures for {week1_target}.",
                    f"Day 3-4: Solve 5 beginner-to-intermediate standard problems targeting {week1_target}.",
                    f"Day 5: Implement step-by-step whiteboard tracing and edge case handling.",
                    f"Day 6-7: 30-minute self-timed diagnostic quiz and error notebook analysis."
                ],
                "expected_outcome": f"Elevate {week1_target} topic mastery from current level to >= 75%."
            },
            {
                "week": 2,
                "theme": f"Applied Practice & Deep Dive: {week2_target}",
                "daily_milestones": [
                    f"Day 8-9: Deconstruct theoretical constraints and relational schemas in {week2_target}.",
                    f"Day 10-11: Code hands-on prototypes in Python/Java verifying corner cases.",
                    f"Day 12-13: Compare alternate solutions and optimize time/space complexity.",
                    f"Day 14: Mid-sprint progress check and consultation with course teaching assistant."
                ],
                "expected_outcome": f"Eliminate syntax and logical errors in {week2_target} assessments."
            },
            {
                "week": 3,
                "theme": f"Synthesis & Multi-Subject Integration: {week3_target}",
                "daily_milestones": [
                    f"Day 15-17: Solve integrated questions combining {week1_target} and {week2_target}.",
                    f"Day 18-19: Complete full-length past semester exam questions under timed conditions.",
                    f"Day 20-21: Perform root cause post-mortem on all missed quiz questions."
                ],
                "expected_outcome": "Demonstrate sustained score above 80% on mock problem sets."
            },
            {
                "week": 4,
                "theme": "Exam Simulation & Longitudinal Mastery",
                "daily_milestones": [
                    "Day 22-24: Review high-yield summary cheat sheets and formula references.",
                    "Day 25-26: Take comprehensive 2-hour full-syllabus simulation test.",
                    "Day 27: Final faculty/advisor feedback session to address remaining queries.",
                    "Day 28: Rest, consolidate mental models, and prepare for upcoming assessments."
                ],
                "expected_outcome": "Complete confidence and projected grade boost to next letter tier."
            }
        ]

        resources = [
            {
                "title": "Interactive Visualizations for Data Structures & Algorithms (VisuAlgo)",
                "type": "Interactive Simulator",
                "focus_area": "DSA & Trees"
            },
            {
                "title": "Database Systems Concepts (Silberschatz & Korth) - Chapters 7 & 14",
                "type": "Textbook Reference",
                "focus_area": "SQL Normalization & Indexing"
            },
            {
                "title": "Operating Systems: Three Easy Pieces (OSTEP) - Concurrency & Paging",
                "type": "Open Access Course Book",
                "focus_area": "OS Semaphores & Memory Management"
            },
            {
                "title": "Kaggle & Scikit-Learn Hands-on Machine Learning Tutorials",
                "type": "Applied Coding Labs",
                "focus_area": "Machine Learning Foundations"
            }
        ]

        motivational_note = (
            f"Every master was once a beginner who refused to quit. You have already demonstrated genuine strengths "
            f"in your coursework. By executing this structured 4-week roadmap one day at a time, you will turn your "
            f"weak areas into your greatest competencies. Keep up the dedication, {name}!"
        )

        return {
            "overall_summary": summary,
            "root_cause_analysis": root_cause,
            "weak_topics_targeted": targeted_topics,
            "weekly_action_plan": weekly_plan,
            "recommended_resources": resources,
            "motivational_note": motivational_note,
            "generated_timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

    def _save_plan_to_db(self, student_id: int, risk_level: str, weak_topics_summary: str, plan_dict: dict):
        """Persists the generated plan to the relational database."""
        conn = self._get_connection()
        try:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO ai_improvement_plans (
                    student_id, overall_performance_status, predicted_risk_level,
                    weak_topics_summary, structured_action_plan, recommended_resources, ai_feedback_note
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                student_id,
                plan_dict.get('overall_summary', '')[:50],
                risk_level,
                weak_topics_summary,
                json.dumps(plan_dict.get('weekly_action_plan', [])),
                json.dumps(plan_dict.get('recommended_resources', [])),
                plan_dict.get('motivational_note', '')
            ))
            conn.commit()
        finally:
            conn.close()

    def get_student_saved_plans(self, student_id: int):
        """Retrieves stored AI plans for a given student."""
        conn = self._get_connection()
        conn.row_factory = sqlite3.Row
        try:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT * FROM ai_improvement_plans 
                WHERE student_id = ? 
                ORDER BY generated_at DESC
            """, (student_id,))
            rows = cursor.fetchall()
            plans = []
            for r in rows:
                plans.append({
                    'plan_id': r['plan_id'],
                    'generated_at': r['generated_at'],
                    'status': r['overall_performance_status'],
                    'risk_level': r['predicted_risk_level'],
                    'weak_topics': r['weak_topics_summary'],
                    'action_plan': json.loads(r['structured_action_plan']) if r['structured_action_plan'] else [],
                    'resources': json.loads(r['recommended_resources']) if r['recommended_resources'] else [],
                    'feedback': r['ai_feedback_note']
                })
            return plans
        finally:
            conn.close()

if __name__ == "__main__":
    from data_processor import StudentDataProcessor
    processor = StudentDataProcessor()
    profile = processor.compute_student_profile(3) # Test with Rohan Verma
    ai_service = StudentAIService()
    plan = ai_service.generate_personalized_plan(profile)
    print("\n--- AI Plan Generated for Rohan Verma ---")
    print("Summary:", plan['overall_summary'])
    print("Weak Topics Targeted:", plan['weak_topics_targeted'])
    print("Weeks in Plan:", len(plan['weekly_action_plan']))
