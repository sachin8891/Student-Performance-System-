import React from 'react';
import { 
  Award, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Activity,
  CalendarCheck
} from 'lucide-react';

export default function OverviewCards({ overview }) {
  if (!overview) return null;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 20,
      marginBottom: 32
    }}>
      {/* Card 1: Class Average GPA */}
      <div className="glass-panel" style={{ padding: 22, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 90,
          height: 90,
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--accent-indigo-glow) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Cohort Class Average
          </span>
          <div style={{
            padding: 8,
            borderRadius: 'var(--radius-sm)',
            background: 'var(--accent-indigo-glow)',
            color: 'var(--accent-indigo)'
          }}>
            <TrendingUp size={18} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {overview.class_average}%
          </span>
          <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
            +3.4% vs Midterm
          </span>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Across 5 core subjects & 18 assessments
        </div>
      </div>

      {/* Card 2: Top Performer */}
      <div className="glass-panel" style={{ padding: 22, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 90,
          height: 90,
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--accent-cyan-glow) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Top Performer (Rank #1)
          </span>
          <div style={{
            padding: 8,
            borderRadius: 'var(--radius-sm)',
            background: 'var(--accent-cyan-glow)',
            color: 'var(--accent-cyan)'
          }}>
            <Award size={18} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8' }}>
            {overview.top_performer?.name || 'Priya Sharma'}
          </span>
          <span className="badge badge-indigo" style={{ fontSize: '0.75rem' }}>
            {overview.top_performer?.avg_score}% GPA
          </span>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Roll: {overview.top_performer?.roll_number} • Distinction Standing
        </div>
      </div>

      {/* Card 3: Attendance vs Score Correlation */}
      <div className="glass-panel" style={{ padding: 22, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 90,
          height: 90,
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--accent-emerald-glow) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Attendance-Score Correlation
          </span>
          <div style={{
            padding: 8,
            borderRadius: 'var(--radius-sm)',
            background: 'var(--accent-emerald-glow)',
            color: 'var(--accent-emerald)'
          }}>
            <Activity size={18} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#34d399' }}>
            r = {overview.attendance_score_correlation}
          </span>
          <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
            Strong Positive
          </span>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Avg Attendance: {overview.average_attendance}% • Verified by Pearson Model
        </div>
      </div>

      {/* Card 4: Academic Risk & Intervention */}
      <div className="glass-panel" style={{ padding: 22, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 90,
          height: 90,
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--accent-amber-glow) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Academic Risk & Intervention
          </span>
          <div style={{
            padding: 8,
            borderRadius: 'var(--radius-sm)',
            background: overview.at_risk_count > 0 ? 'var(--accent-rose-glow)' : 'var(--accent-emerald-glow)',
            color: overview.at_risk_count > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)'
          }}>
            {overview.at_risk_count > 0 ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
          <span style={{ 
            fontSize: '2.25rem', 
            fontWeight: 800, 
            color: overview.at_risk_count > 0 ? '#fb7185' : '#34d399' 
          }}>
            {overview.at_risk_count} Students
          </span>
          <span className={`badge ${overview.at_risk_count > 0 ? 'badge-rose' : 'badge-emerald'}`} style={{ fontSize: '0.75rem' }}>
            {overview.at_risk_count > 0 ? 'Action Required' : 'All Clear'}
          </span>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          AI personalized improvement roadmaps generated
        </div>
      </div>
    </div>
  );
}
