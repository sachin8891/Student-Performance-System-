import React from 'react';
import { 
  GraduationCap, 
  UserCheck, 
  PlusCircle, 
  Database, 
  Cpu, 
  Sparkles,
  ChevronDown
} from 'lucide-react';

export default function Header({ 
  students, 
  selectedStudentId, 
  onSelectStudent, 
  onOpenAddScore,
  apiStatus 
}) {
  const currentStudent = students.find(s => s.student_id === Number(selectedStudentId));

  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      backgroundColor: 'rgba(10, 14, 23, 0.85)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '16px 32px'
    }}>
      <div style={{
        maxWidth: 1440,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        {/* Brand & Project Metadata */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
          }}>
            <GraduationCap size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                EduTrack <span className="text-gradient">AI</span>
              </h1>
              <span className="badge badge-indigo">
                <Sparkles size={12} /> B.Tech CSE
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              AI-Powered Student Performance & Diagnostic Analytics
            </p>
          </div>
        </div>

        {/* Runtime Stack Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
            Python & Pandas
          </div>
          <div className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>
            <Cpu size={12} /> Java 21 REST
          </div>
          <div className="badge badge-cyan" style={{ fontSize: '0.72rem', background: 'var(--accent-cyan-glow)', color: '#22d3ee', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
            <Database size={12} /> MySQL Relational DB
          </div>
        </div>

        {/* Controls: Student Switcher & Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Student Selector */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '4px 12px'
          }}>
            <UserCheck size={16} color="var(--accent-indigo)" style={{ marginRight: 8 }} />
            <select
              value={selectedStudentId}
              onChange={(e) => onSelectStudent(Number(e.target.value))}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer',
                paddingRight: 20
              }}
            >
              {students.map(s => (
                <option key={s.student_id} value={s.student_id} style={{ background: '#111827', color: '#f8fafc' }}>
                  {s.full_name} ({s.roll_number})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Record Score Button */}
          <button 
            className="btn btn-secondary"
            onClick={onOpenAddScore}
            style={{ padding: '8px 14px', fontSize: '0.8rem' }}
          >
            <PlusCircle size={15} />
            Add Score Record
          </button>
        </div>
      </div>
    </header>
  );
}
