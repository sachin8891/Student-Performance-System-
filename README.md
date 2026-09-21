# AI-Powered Student Performance Tracker

**Developer:** Sachin Gurjar  
**Portfolio Project:** Resume Featured Project #1  
**Tech Stack:** Python, Pandas, SQL, MySQL, Java, React.js, Generative AI APIs  

---

## 🎯 Project Overview & Resume Alignment

This end-to-end academic analytics platform tracks student multi-subject progress, diagnoses syllabus weaknesses, calculates longitudinal assessment trajectories, correlates attendance with test performance, and leverages Generative AI to generate personalized 4-week student improvement roadmaps.

### Resume Feature Verification

| Resume Bullet Point | Architecture Implementation | Key Files |
|---|---|---|
| **1. Relational MySQL Database** | Relational schema with normalized tables for students, subjects, assessments, marks, attendance, and AI improvement plans. | `database/schema.sql`<br/>`database/seed_data.sql` |
| **2. Python & Pandas Data Processing** | Automated data cleaning, null handling, weighted GPA calculations, polynomial progress slopes, and Pearson attendance correlation. | `analytics-python/data_processor.py` |
| **3. Analytical SQL Query Suite** | Advanced SQL queries utilizing window functions (`DENSE_RANK() OVER`), aggregate statistics, risk matrix filters, and longitudinal delta analysis. | `database/analytics_queries.sql` |
| **4. Interactive React.js Dashboard** | Modern glassmorphic web dashboard with responsive SVG trajectory charts, subject comparison bars, topic mastery matrix, and student switcher. | `frontend-react/src/App.jsx`<br/>`frontend-react/src/components/` |
| **5. Generative AI Improvement Plans** | Google Gemini / GenAI integration that parses student diagnostic weaknesses and synthesizes personalized 4-week study roadmaps with weekly milestones. | `analytics-python/ai_service.py` |
| **Java Component** | Object-oriented Java 21 REST microservice with domain models (`Student`, `Subject`, `ScoreRecord`) and embedded HTTP server. | `backend-java/src/main/java/` |

---

## 🏗️ System Architecture

```
                                  +---------------------------------------+
                                  |           React.js Frontend           |
                                  |   - Interactive Analytics Dashboard   |
                                  |   - Progress Trajectory SVG Charts    |
                                  |   - AI Improvement Plan Studio        |
                                  |   - SQL Query Playground              |
                                  +-------------------+-------------------+
                                                      |
                             HTTP / REST (Port 3000 -> 5000 / 8080)
                                                      |
                         +----------------------------+----------------------------+
                         |                                                         |
                         v                                                         v
        +---------------------------------+                       +---------------------------------+
        |    Python & Pandas Analytics    |                       |      Java 21 Backend Service    |
        |       & Generative AI API       |                       |        (HTTP REST Server)       |
        |  - Pandas ETL & Aggregation     |                       |  - OOP Domain Model Hierarchy   |
        |  - Pearson Correlation Model    |                       |  - Data Access Repository Layer |
        |  - Gemini GenAI Custom Prompts  |                       |  - Student Record Ingestion     |
        |  - Flask REST API (Port 5000)   |                       |  - Port 8080                    |
        +----------------+----------------+                       +----------------+----------------+
                         |                                                         |
                         +----------------------------+----------------------------+
                                                      |
                                                      v
                                    +-----------------------------------+
                                    |        Relational Database        |
                                    |      (MySQL 8.0 & SQLite DDL)     |
                                    |  - students, subjects, scores     |
                                    |  - assessments, attendance, plans |
                                    +-----------------------------------+
```

---

## 🚀 Quick Start Guide

### Option 1: One-Click Startup (Recommended)
Double-click `run_project.bat` or run in PowerShell:
```powershell
.\start_all.ps1
```

### Option 2: Individual Service Execution

#### 1. Initialize Database
```bash
python database/db_setup.py
```

#### 2. Run Python Analytics & GenAI Service (Port 5000)
```bash
python analytics-python/app.py
```

#### 3. Run Java Backend Service (Port 8080)
```bash
java -cp backend-java/bin com.tracker.JavaBackendApplication
```

#### 4. Run React Dashboard (Port 3000)
```bash
cd frontend-react
npm run dev
```

Visit **`http://localhost:3000`** in your browser.

---

## 📊 Analytical SQL Highlights (`database/analytics_queries.sql`)

### Cohort Ranking with Window Functions
```sql
SELECT 
    s.student_id,
    s.roll_number,
    CONCAT(s.first_name, ' ', s.last_name) AS full_name,
    ROUND(AVG(sc.marks_obtained), 2) AS cumulative_avg_percentage,
    DENSE_RANK() OVER (ORDER BY AVG(sc.marks_obtained) DESC) AS cohort_rank
FROM students s
JOIN student_scores sc ON s.student_id = sc.student_id
GROUP BY s.student_id, s.roll_number, s.first_name, s.last_name
ORDER BY cohort_rank ASC;
```

### Attendance vs Exam Score Correlation
```sql
WITH StudentAttendance AS (
    SELECT student_id,
           ROUND((SUM(CASE WHEN status = 'Present' THEN 1.0 WHEN status = 'Late' THEN 0.5 ELSE 0.0 END) * 100.0) / COUNT(attendance_id), 2) AS attendance_rate
    FROM attendance GROUP BY student_id
)
SELECT s.student_id, CONCAT(s.first_name, ' ', s.last_name) AS student_name, sa.attendance_rate, ROUND(AVG(sc.marks_obtained), 2) AS avg_score
FROM students s
JOIN StudentAttendance sa ON s.student_id = sa.student_id
JOIN student_scores sc ON s.student_id = sc.student_id
GROUP BY s.student_id, s.first_name, s.last_name, sa.attendance_rate
ORDER BY sa.attendance_rate DESC;
```

---

## 💡 Generative AI Configuration
To connect directly to Google Gemini live API, set your API key in your terminal or environment:
```powershell
$env:GEMINI_API_KEY = "your_actual_gemini_api_key"
```
*Note: If no API key is provided, the system automatically uses its built-in Intelligent Analytical Synthesis Engine to deliver instant, customized 4-week roadmaps based on real student metrics!*
