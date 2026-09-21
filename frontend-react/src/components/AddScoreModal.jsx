import React, { useState } from 'react';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';

export default function AddScoreModal({ isOpen, onClose, students, onScoreAdded }) {
  const [studentId, setStudentId] = useState(students[0]?.student_id || 1);
  const [assessmentId, setAssessmentId] = useState(1);
  const [marks, setMarks] = useState(85);
  const [remarks, setRemarks] = useState('Manual submission entry');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (marks < 0 || marks > 100) {
      setError('Marks obtained must be between 0 and 100.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/analytics/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: Number(studentId),
          assessment_id: Number(assessmentId),
          marks_obtained: Number(marks),
          remarks: remarks
        })
      });

      if (res.ok) {
        onScoreAdded();
        onClose();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save score.');
      }
    } catch (err) {
      setError('Network error contacting backend: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const assessments = [
    { id: 1, title: 'DSA Quiz 1 (Trees & Sorts)' },
    { id: 2, title: 'DSA Midterm Examination' },
    { id: 3, title: 'DSA Quiz 2 (Graphs & DP)' },
    { id: 4, title: 'DSA Final Examination' },
    { id: 5, title: 'DBMS Quiz 1 (SQL & Rel. Algebra)' },
    { id: 6, title: 'DBMS Midterm Examination' },
    { id: 7, title: 'DBMS Quiz 2 (Normalization & Concurrency)' },
    { id: 8, title: 'DBMS Final Examination' },
    { id: 9, title: 'OS Quiz 1 (Processes & Scheduling)' },
    { id: 10, title: 'OS Midterm Examination' },
    { id: 11, title: 'OS Quiz 2 (Memory & Deadlocks)' },
    { id: 12, title: 'OS Final Examination' },
    { id: 13, title: 'CN Quiz 1 (Protocols & Physical Layer)' },
    { id: 14, title: 'CN Midterm Examination' },
    { id: 15, title: 'CN Final Examination' },
    { id: 16, title: 'ML Lab Assignment 1 (Regression & Prep)' },
    { id: 17, title: 'ML Midterm Examination' },
    { id: 18, title: 'ML Final Project Evaluation' }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: 16
    }}>
      <div className="glass-panel" style={{
        maxWidth: 480,
        width: '100%',
        padding: 28,
        background: '#111827',
        border: '1px solid var(--border-accent)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Record Student Assessment Score</h3>
          <button 
            onClick={onClose} 
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{
            background: 'var(--accent-rose-glow)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
            fontSize: '0.82rem',
            color: '#fb7185',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <AlertTriangle size={15} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Student Field */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Select Student
            </label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem'
              }}
            >
              {students.map(s => (
                <option key={s.student_id} value={s.student_id} style={{ background: '#111827' }}>
                  {s.full_name} ({s.roll_number})
                </option>
              ))}
            </select>
          </div>

          {/* Assessment Field */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Select Assessment
            </label>
            <select
              value={assessmentId}
              onChange={(e) => setAssessmentId(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem'
              }}
            >
              {assessments.map(a => (
                <option key={a.id} value={a.id} style={{ background: '#111827' }}>
                  {a.title}
                </option>
              ))}
            </select>
          </div>

          {/* Marks Obtained */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Marks Obtained (Out of 100)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem'
              }}
            />
          </div>

          {/* Remarks */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Examiner Remarks
            </label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g., Solid tree traversal implementation"
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save & Recalculate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
