import React, { useState } from 'react';
import { LineChart, TrendingUp, TrendingDown, Minus, CheckCircle } from 'lucide-react';

export default function ProgressTrajectory({ timeline, trendDirection, trendSlope }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!timeline || timeline.length === 0) return null;

  // Compute SVG viewBox dimensions
  const width = 640;
  const height = 240;
  const paddingX = 45;
  const paddingY = 40;

  const minScore = 40;
  const maxScore = 100;

  const points = timeline.map((item, idx) => {
    const x = paddingX + (idx / Math.max(timeline.length - 1, 1)) * (width - 2 * paddingX);
    const y = height - paddingY - ((item.percentage - minScore) / (maxScore - minScore)) * (height - 2 * paddingY);
    return { ...item, x, y };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  // Fill area under curve
  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
    : '';

  return (
    <div className="glass-panel" style={{ padding: 24, height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <LineChart size={20} color="var(--accent-cyan)" />
            Assessment Score Progression Trajectory
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Longitudinal trend across semester quizzes, midterms, and finals
          </p>
        </div>

        {/* Trend Indicator Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className={`badge ${
            trendDirection === 'Improving' ? 'badge-emerald' : (trendDirection === 'Declining' ? 'badge-rose' : 'badge-indigo')
          }`}>
            {trendDirection === 'Improving' && <TrendingUp size={14} />}
            {trendDirection === 'Declining' && <TrendingDown size={14} />}
            {trendDirection === 'Stable' && <Minus size={14} />}
            {trendDirection} ({trendSlope > 0 ? `+${trendSlope}` : trendSlope}/exam)
          </span>
        </div>
      </div>

      {/* SVG Interactive Line Chart */}
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[50, 70, 90].map((score) => {
            const y = height - paddingY - ((score - minScore) / (maxScore - minScore)) * (height - 2 * paddingY);
            return (
              <g key={score}>
                <line 
                  x1={paddingX} 
                  y1={y} 
                  x2={width - paddingX} 
                  y2={y} 
                  stroke="rgba(255, 255, 255, 0.08)" 
                  strokeDasharray="4 4" 
                />
                <text 
                  x={paddingX - 10} 
                  y={y + 4} 
                  fill="var(--text-muted)" 
                  fontSize="10" 
                  textAnchor="end" 
                  fontFamily="var(--font-mono)"
                >
                  {score}%
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaD} fill="url(#areaGradient)" />

          {/* Line Path */}
          <path 
            d={pathD} 
            fill="none" 
            stroke="url(#strokeGradient)" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Data Points */}
          {points.map((p, idx) => (
            <g key={idx}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredPoint?.assessment_id === p.assessment_id ? 7 : 5}
                fill={p.percentage >= 80 ? '#10b981' : (p.percentage < 65 ? '#f43f5e' : '#f59e0b')}
                stroke="#ffffff"
                strokeWidth="2"
                style={{ cursor: 'pointer', transition: 'r 0.2s' }}
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            </g>
          ))}
        </svg>

        {/* Floating Tooltip */}
        {hoveredPoint && (
          <div style={{
            position: 'absolute',
            top: 10,
            right: 15,
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid var(--accent-indigo)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
            fontSize: '0.78rem',
            pointerEvents: 'none',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{ fontWeight: 700, color: '#f8fafc' }}>{hoveredPoint.title}</div>
            <div style={{ color: 'var(--text-secondary)' }}>
              Subject: {hoveredPoint.subject_code} • {hoveredPoint.date}
            </div>
            <div style={{ color: hoveredPoint.percentage >= 80 ? '#34d399' : '#fb7185', fontWeight: 700, marginTop: 4 }}>
              Score: {hoveredPoint.percentage}% ({hoveredPoint.letter_grade})
            </div>
          </div>
        )}
      </div>

      {/* Timeline Footnotes */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
        <span>Early Semester Quizzes</span>
        <span>Midterm Assessments</span>
        <span>Comprehensive Finals</span>
      </div>
    </div>
  );
}
