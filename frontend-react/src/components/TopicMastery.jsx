import React, { useState } from 'react';
import { Target, AlertCircle, CheckCircle, Filter } from 'lucide-react';

export default function TopicMastery({ topics, weakTopics }) {
  const [filterWeakOnly, setFilterWeakOnly] = useState(false);

  if (!topics || topics.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: 24 }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Target size={20} color="var(--accent-indigo)" />
          Diagnostic Topic Mastery Matrix
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          No topic evaluation data recorded for this student yet.
        </p>
      </div>
    );
  }

  const displayedTopics = filterWeakOnly ? weakTopics : topics;

  return (
    <div className="glass-panel" style={{ padding: 24, height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Target size={20} color="var(--accent-indigo)" />
            Diagnostic Topic Mastery Matrix
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Granular competency ratings across syllabus units (Weak: &lt;65%)
          </p>
        </div>

        {/* Filter Toggle */}
        <button
          className="btn btn-secondary"
          onClick={() => setFilterWeakOnly(!filterWeakOnly)}
          style={{
            padding: '6px 12px',
            fontSize: '0.75rem',
            background: filterWeakOnly ? 'var(--accent-rose-glow)' : 'rgba(255, 255, 255, 0.05)',
            borderColor: filterWeakOnly ? 'rgba(244, 63, 94, 0.4)' : 'var(--border-subtle)',
            color: filterWeakOnly ? '#fb7185' : 'var(--text-secondary)'
          }}
        >
          <Filter size={13} />
          {filterWeakOnly ? `Showing Weak Only (${weakTopics.length})` : `Show Weak Only (${weakTopics.length})`}
        </button>
      </div>

      {/* Topics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 14,
        maxHeight: 380,
        overflowY: 'auto',
        paddingRight: 6
      }}>
        {displayedTopics.map((t) => {
          const isWeak = t.is_weak;
          const score = t.mastery_percentage;

          return (
            <div
              key={t.topic_id}
              style={{
                background: isWeak ? 'rgba(244, 63, 94, 0.06)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${isWeak ? 'rgba(244, 63, 94, 0.25)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <span style={{
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)',
                    display: 'block'
                  }}>
                    {t.subject_code} • {t.difficulty}
                  </span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
                    {t.topic_name}
                  </div>
                </div>

                {isWeak ? (
                  <span className="badge badge-rose" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                    <AlertCircle size={11} /> Weak Area
                  </span>
                ) : (
                  <span className="badge badge-emerald" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                    <CheckCircle size={11} /> Mastered
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                <div style={{ flex: 1, height: 6, background: 'rgba(255, 255, 255, 0.08)', borderRadius: 3, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${score}%`,
                      background: isWeak ? 'linear-gradient(90deg, #f43f5e, #fb923c)' : 'linear-gradient(90deg, #6366f1, #10b981)',
                      borderRadius: 3
                    }}
                  />
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  color: isWeak ? '#fb7185' : '#34d399'
                }}>
                  {score}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
