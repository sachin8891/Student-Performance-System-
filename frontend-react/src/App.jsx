import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import OverviewCards from './components/OverviewCards';
import PerformanceChart from './components/PerformanceChart';
import ProgressTrajectory from './components/ProgressTrajectory';
import TopicMastery from './components/TopicMastery';
import AIPlanStudio from './components/AIPlanStudio';
import SQLPlayground from './components/SQLPlayground';
import AddScoreModal from './components/AddScoreModal';
import { 
  BarChart3, 
  Sparkles, 
  Database, 
  Layers, 
  Users, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  Code2
} from 'lucide-react';

export default function App() {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(1);
  const [overview, setOverview] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddScoreOpen, setIsAddScoreOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedStudentId) {
      loadStudentProfile(selectedStudentId);
    }
  }, [selectedStudentId]);

  const loadInitialData = async () => {
    try {
      // 1. Fetch Students
      const sRes = await fetch('http://localhost:5000/api/analytics/students');
      if (sRes.ok) {
        const sData = await sRes.json();
        setStudents(sData);
        if (sData.length > 0 && !selectedStudentId) {
          setSelectedStudentId(sData[0].student_id);
        }
      }

      // 2. Fetch Overview
      const oRes = await fetch('http://localhost:5000/api/analytics/overview');
      if (oRes.ok) {
        const oData = await oRes.json();
        setOverview(oData);
      }
    } catch (e) {
      console.error("Error fetching initial data", e);
    } finally {
      setLoading(false);
    }
  };

  const loadStudentProfile = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/analytics/student/${id}`);
      if (res.ok) {
        const data = await res.json();
        setStudentProfile(data);
      }
    } catch (e) {
      console.error("Error fetching student profile", e);
    }
  };

  const handleScoreAdded = () => {
    loadInitialData();
    loadStudentProfile(selectedStudentId);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Header */}
      <Header
        students={students}
        selectedStudentId={selectedStudentId}
        onSelectStudent={(id) => setSelectedStudentId(id)}
        onOpenAddScore={() => setIsAddScoreOpen(true)}
      />

      <main className="container" style={{ flex: 1 }}>
        {/* Navigation Tabs */}
        <div className="tabs-nav">
          <button 
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <BarChart3 size={16} />
            Student Deep-Dive & AI Roadmap
          </button>
          <button 
            className={`tab-btn ${activeTab === 'cohort' ? 'active' : ''}`}
            onClick={() => setActiveTab('cohort')}
          >
            <Users size={16} />
            Cohort Analytics & Standings
          </button>
          <button 
            className={`tab-btn ${activeTab === 'sql' ? 'active' : ''}`}
            onClick={() => setActiveTab('sql')}
          >
            <Database size={16} />
            Relational SQL Query Suite
          </button>
          <button 
            className={`tab-btn ${activeTab === 'tech' ? 'active' : ''}`}
            onClick={() => setActiveTab('tech')}
          >
            <Code2 size={16} />
            Tech Stack Architecture
          </button>
        </div>

        {/* Top KPI Metrics Overview */}
        <OverviewCards overview={overview} />

        {/* Tab 1: Student Deep-Dive & AI Plan */}
        {activeTab === 'dashboard' && studentProfile && (
          <div>
            {/* Student Profile Quick Banner */}
            <div className="glass-panel" style={{
              padding: '18px 24px',
              marginBottom: 24,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 16,
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(17, 24, 39, 0.9))'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                    {studentProfile.student_info.full_name}
                  </h2>
                  <span className="badge badge-indigo">
                    Roll: {studentProfile.student_info.roll_number}
                  </span>
                  <span className={`badge ${studentProfile.risk_level === 'High' ? 'badge-rose' : (studentProfile.risk_level === 'Moderate' ? 'badge-amber' : 'badge-emerald')}`}>
                    {studentProfile.risk_level} Risk Standing
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                  {studentProfile.student_info.department} • Semester {studentProfile.student_info.semester} • {studentProfile.student_info.email}
                </div>
              </div>

              {/* Quick Metrics */}
              <div style={{ display: 'flex', gap: 20 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CUMULATIVE GPA</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>
                    {studentProfile.cumulative_percentage}%
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ATTENDANCE RATE</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>
                    {studentProfile.attendance_percentage}%
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Analytics Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
              gap: 24,
              marginBottom: 24
            }}>
              {/* Subject Breakdown Chart */}
              <PerformanceChart
                subjectRadar={studentProfile.subject_radar}
                studentName={studentProfile.student_info.full_name}
              />

              {/* Assessment Progress Trajectory */}
              <ProgressTrajectory
                timeline={studentProfile.timeline_progression}
                trendDirection={studentProfile.trend_direction}
                trendSlope={studentProfile.trend_slope}
              />
            </div>

            {/* Topic Mastery Matrix */}
            <TopicMastery
              topics={studentProfile.all_topics}
              weakTopics={studentProfile.weak_topics}
            />

            {/* Generative AI Improvement Plan Studio */}
            <AIPlanStudio
              studentId={selectedStudentId}
              studentName={studentProfile.student_info.full_name}
              studentProfile={studentProfile}
              onPlanGenerated={() => loadStudentProfile(selectedStudentId)}
            />
          </div>
        )}

        {/* Tab 2: Cohort Analytics & Rankings Table */}
        {activeTab === 'cohort' && overview && (
          <div className="glass-panel" style={{ padding: 28 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Users size={22} color="var(--accent-indigo)" />
              Class Cohort Rankings & Academic Standings
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 20 }}>
              Aggregated across all semesters using SQL window functions (DENSE_RANK) and Pandas statistics
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-secondary)' }}>Rank</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-secondary)' }}>Student Name</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-secondary)' }}>Roll Number</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-secondary)' }}>Cumulative Avg</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-secondary)' }}>Attendance</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-secondary)' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text-secondary)' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {overview.student_rankings?.map((s) => {
                    const att = overview.attendance_vs_grades?.find(a => a.student_id === s.student_id)?.effective_attendance_pct || 80.0;
                    const isAtRisk = s.avg_score < 65 || att < 75;

                    return (
                      <tr 
                        key={s.student_id}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                          background: s.student_id === selectedStudentId ? 'rgba(99, 102, 241, 0.08)' : 'transparent'
                        }}
                      >
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: s.rank <= 3 ? '#fbbf24' : 'var(--text-secondary)' }}>
                          #{s.rank}
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {s.full_name}
                        </td>
                        <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {s.roll_number}
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: s.avg_score >= 80 ? '#34d399' : (s.avg_score < 65 ? '#fb7185' : '#fbbf24') }}>
                          {s.avg_score}%
                        </td>
                        <td style={{ padding: '12px 16px', color: att >= 80 ? '#34d399' : '#fb7185' }}>
                          {att}%
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span className={`badge ${isAtRisk ? 'badge-rose' : (s.avg_score >= 85 ? 'badge-emerald' : 'badge-indigo')}`}>
                            {isAtRisk ? 'At-Risk' : (s.avg_score >= 85 ? 'Distinction' : 'Good Standing')}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <button
                            className="btn btn-secondary"
                            onClick={() => {
                              setSelectedStudentId(s.student_id);
                              setActiveTab('dashboard');
                            }}
                            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                          >
                            Inspect Profile
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Relational SQL Query Lab */}
        {activeTab === 'sql' && <SQLPlayground />}

        {/* Tab 4: Tech Stack Architecture View */}
        {activeTab === 'tech' && (
          <div className="glass-panel" style={{ padding: 28 }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Layers size={22} color="var(--accent-indigo)" />
              Resume Tech Stack Implementation Mapping
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: 24 }}>
              Demonstrating the exact technologies from Sachin Gurjar's resume in a cohesive end-to-end architecture:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: 18, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span className="badge badge-indigo" style={{ marginBottom: 10 }}>Python & Pandas</span>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 6 }}>Analytics & Data Cleaning</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Utilizes <code>data_processor.py</code> with Pandas DataFrames and NumPy to clean missing scores, compute class percentiles, calculate polynomial progress trajectories, and correlate attendance with grades.
                </p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: 18, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span className="badge badge-cyan" style={{ marginBottom: 10 }}>SQL & MySQL</span>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 6 }}>Relational Database & DDL</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Production relational schema (<code>schema.sql</code>) and query catalog (<code>analytics_queries.sql</code>) utilizing <code>DENSE_RANK()</code>, aggregate statistics, joins, and foreign key cascades.
                </p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: 18, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span className="badge badge-emerald" style={{ marginBottom: 10 }}>Java 21</span>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 6 }}>Backend REST Microservice</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Compiled Java service with OOP domain models (<code>Student</code>, <code>Subject</code>, <code>ScoreRecord</code>) and embedded HTTP REST server running on port 8080.
                </p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: 18, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span className="badge badge-amber" style={{ marginBottom: 10 }}>React.js & CSS</span>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 6 }}>Interactive UI & Visualizations</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Modern Vite + React frontend styled with custom glassmorphism, responsive SVG line and multi-bar charts, modal forms, and real-time state management.
                </p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: 18, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span className="badge badge-rose" style={{ marginBottom: 10 }}>Generative AI APIs</span>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 6 }}>Personalized Improvement Plans</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Integrates Google Gemini / Generative AI APIs in <code>ai_service.py</code> to formulate 4-week tailored study roadmaps and diagnose root causes from structured weak-topic performance data.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal for adding/updating scores */}
      <AddScoreModal
        isOpen={isAddScoreOpen}
        onClose={() => setIsAddScoreOpen(false)}
        students={students}
        onScoreAdded={handleScoreAdded}
      />
    </div>
  );
}
