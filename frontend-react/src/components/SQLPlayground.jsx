import React, { useState, useEffect } from 'react';
import { Database, Play, Copy, Check, Terminal, Code2 } from 'lucide-react';

export default function SQLPlayground() {
  const [queries, setQueries] = useState([]);
  const [activeQueryIndex, setActiveQueryIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/analytics/sql-queries');
      if (res.ok) {
        const data = await res.json();
        setQueries(data);
      }
    } catch (e) {
      console.error("Could not fetch SQL queries", e);
    } finally {
      setLoading(false);
    }
  };

  const currentQuery = queries[activeQueryIndex];

  const handleCopy = () => {
    if (currentQuery) {
      navigator.clipboard.writeText(currentQuery.sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="glass-panel" style={{ padding: 32, textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading SQL Analytical Suite...</p>
      </div>
    );
  }

  if (!queries || queries.length === 0) return null;

  return (
    <div className="glass-panel" style={{ padding: 28, marginTop: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10, margin: 0 }}>
            <Database size={22} color="var(--accent-cyan)" />
            Relational SQL Analytics Engine & Query Lab
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Inspect and execute live relational database queries designed for academic KPI extraction
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={handleCopy} style={{ padding: '8px 14px', fontSize: '0.8rem' }}>
            {copied ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy Query'}
          </button>
        </div>
      </div>

      {/* Query Selector Tabs */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10, marginBottom: 16 }}>
        {queries.map((q, idx) => (
          <button
            key={q.id}
            onClick={() => setActiveQueryIndex(idx)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: idx === activeQueryIndex ? 'var(--accent-indigo)' : 'rgba(255, 255, 255, 0.04)',
              color: idx === activeQueryIndex ? '#ffffff' : 'var(--text-secondary)',
              border: `1px solid ${idx === activeQueryIndex ? 'var(--accent-indigo)' : 'var(--border-subtle)'}`,
              transition: 'all 0.2s'
            }}
          >
            {q.title}
          </button>
        ))}
      </div>

      {currentQuery && (
        <div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
            {currentQuery.description}
          </p>

          {/* SQL Code Box */}
          <div style={{
            background: '#090d16',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: 18,
            marginBottom: 20,
            overflowX: 'auto'
          }}>
            <pre style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              color: '#38bdf8',
              lineHeight: 1.6,
              margin: 0
            }}>
              {currentQuery.sql}
            </pre>
          </div>

          {/* Live Result Table */}
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Terminal size={16} color="var(--accent-emerald)" />
            Live Query Execution Output ({currentQuery.data?.length || 0} rows returned)
          </h4>

          <div style={{
            overflowX: 'auto',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border-subtle)' }}>
                  {currentQuery.data && currentQuery.data.length > 0 && Object.keys(currentQuery.data[0]).map((col) => (
                    <th key={col} style={{
                      padding: '10px 14px',
                      textAlign: 'left',
                      color: 'var(--text-secondary)',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentQuery.data?.map((row, rIdx) => (
                  <tr 
                    key={rIdx}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {Object.values(row).map((val, cIdx) => (
                      <td key={cIdx} style={{
                        padding: '10px 14px',
                        color: 'var(--text-primary)'
                      }}>
                        {String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
