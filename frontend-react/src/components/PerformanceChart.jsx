import React, { useState } from 'react';
import { BarChart3, Info } from 'lucide-react';

export default function PerformanceChart({ subjectRadar, studentName }) {
  const [activeSubject, setActiveSubject] = useState(null);

  if (!subjectRadar || subjectRadar.length === 0) return null;

  return (
    <div className="glass-panel" style={{ padding: 24, height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChart3 size={20} color="var(--accent-indigo)" />
            Subject Performance vs Class Average
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Comparing {studentName}'s average marks with department cohort mean
          </p>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: 'linear-gradient(135deg, #6366f1, #38bdf8)' }}></span>
            <span style={{ color: 'var(--text-secondary)' }}>Student Score</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(255, 255, 255, 0.2)' }}></span>
            <span style={{ color: 'var(--text-secondary)' }}>Class Average</span>
          </div>
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 12 }}>
        {subjectRadar.map((sub, idx) => {
          const studentScore = sub.student_avg;
          const classAvg = sub.class_avg;
          const delta = (studentScore - classAvg).toFixed(1);
          const isAbove = Number(delta) >= 0;

          return (
            <div 
              key={sub.subject_id || idx}
              onMouseEnter={() => setActiveSubject(sub)}
              onMouseLeave={() => setActiveSubject(null)}
              style={{
                background: activeSubject?.subject_code === sub.subject_code ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                transition: 'background var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: '#a5b4fc',
                    padding: '2px 6px',
                    borderRadius: 4
                  }}>
                    {sub.subject_code}
                  </span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {sub.subject_name}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: studentScore >= 80 ? '#34d399' : (studentScore < 65 ? '#fb7185' : '#fbbf24') }}>
                    {studentScore}%
                  </span>
                  <span className={`badge ${isAbove ? 'badge-emerald' : 'badge-rose'}`} style={{ fontSize: '0.72rem', padding: '2px 6px' }}>
                    {isAbove ? `+${delta}%` : `${delta}%`}
                  </span>
                </div>
              </div>

              {/* Multi-track Progress Bar */}
              <div style={{ position: 'relative', height: 14, background: 'rgba(255, 255, 255, 0.06)', borderRadius: 8, overflow: 'hidden' }}>
                {/* Class Average Reference Bar */}
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: `${classAvg}%`,
                    background: 'rgba(255, 255, 255, 0.18)',
                    borderRadius: 8
                  }}
                  title={`Class Average: ${classAvg}%`}
                />
                {/* Student Score Bar */}
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: `${studentScore}%`,
                    background: studentScore >= 85 
                      ? 'linear-gradient(90deg, #6366f1, #10b981)' 
                      : (studentScore >= 70 ? 'linear-gradient(90deg, #6366f1, #38bdf8)' : 'linear-gradient(90deg, #f43f5e, #fb923c)'),
                    borderRadius: 8,
                    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <span>Class Benchmark: {classAvg}%</span>
                <span>Exams: {sub.exam_count} assessments</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
