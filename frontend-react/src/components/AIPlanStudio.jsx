import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Calendar, 
  BookOpen, 
  HeartHandshake, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  History,
  Zap,
  RefreshCw
} from 'lucide-react';

export default function AIPlanStudio({ studentId, studentName, studentProfile, onPlanGenerated }) {
  const [loading, setLoading] = useState(false);
  const [activePlan, setActivePlan] = useState(null);
  const [savedPlans, setSavedPlans] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // Fetch saved plans on load or student switch
  useEffect(() => {
    fetchSavedPlans();
    setActivePlan(null);
  }, [studentId]);

  const fetchSavedPlans = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/analytics/student/${studentId}/plans`);
      if (res.ok) {
        const data = await res.json();
        setSavedPlans(data);
        if (data.length > 0 && !activePlan) {
          // Format latest saved plan
          const latest = data[0];
          setActivePlan({
            overall_summary: latest.status,
            root_cause_analysis: latest.feedback,
            weak_topics_targeted: latest.weak_topics ? latest.weak_topics.split('\n').map(s => s.replace('- ', '')) : [],
            weekly_action_plan: latest.action_plan,
            recommended_resources: latest.resources,
            motivational_note: latest.feedback,
            generated_timestamp: latest.generated_at
          });
        }
      }
    } catch (e) {
      console.error("Could not fetch saved plans", e);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setLoadingStep(1);

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 700);

    try {
      const res = await fetch(`http://localhost:5000/api/analytics/generate-plan/${studentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      clearInterval(stepInterval);
      if (res.ok) {
        const data = await res.json();
        setActivePlan(data.plan);
        fetchSavedPlans();
        if (onPlanGenerated) onPlanGenerated(data.plan);
      } else {
        alert("Failed to generate plan. Please verify Python analytics service is active.");
      }
    } catch (err) {
      clearInterval(stepInterval);
      alert("Error contacting AI analytics API: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: 28, marginTop: 24, position: 'relative', overflow: 'hidden' }}>
      {/* Background Ambient Glow */}
      <div style={{
        position: 'absolute',
        top: -60,
        right: -60,
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              padding: 8,
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              color: '#ffffff'
            }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                Generative AI Improvement Plan Studio
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                Synthesizing multi-subject grades, syllabus weak spots, and attendance into custom roadmaps
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {savedPlans.length > 0 && (
            <button
              className="btn btn-secondary"
              onClick={() => setShowHistory(!showHistory)}
              style={{ padding: '8px 14px', fontSize: '0.8rem' }}
            >
              <History size={15} />
              Saved Plans ({savedPlans.length})
            </button>
          )}

          <button
            className="btn btn-ai"
            onClick={handleGenerate}
            disabled={loading}
            style={{ padding: '10px 22px', fontSize: '0.9rem', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <>
                <RefreshCw size={16} className="pulse-animation" />
                Generating Plan...
              </>
            ) : (
              <>
                <Zap size={16} />
                Generate AI Improvement Plan
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading Progress State */}
      {loading && (
        <div style={{
          padding: 32,
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: 'var(--radius-md)',
          border: '1px dashed var(--border-accent)',
          marginBottom: 24
        }}>
          <div style={{
            width: 50,
            height: 50,
            borderRadius: '50%',
            border: '3px solid var(--accent-indigo)',
            borderTopColor: 'transparent',
            margin: '0 auto 16px auto',
            animation: 'spin 1s linear infinite'
          }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {loadingStep === 1 && "1/3 Analyzing student scores, historical trends & attendance records..."}
            {loadingStep === 2 && "2/3 Identifying syllabus knowledge gaps & weak topic evaluations..."}
            {loadingStep === 3 && "3/3 Calling Generative AI engine to synthesize 4-week structured milestones..."}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 6 }}>
            Applying pedagogical learning theory and personalized timeline planning
          </div>
        </div>
      )}

      {/* Plan History Drawer */}
      {showHistory && savedPlans.length > 0 && (
        <div style={{
          marginBottom: 24,
          padding: 16,
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)'
        }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 12, color: 'var(--text-secondary)' }}>
            Previously Saved Improvement Plans
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {savedPlans.map(p => (
              <div 
                key={p.plan_id}
                onClick={() => {
                  setActivePlan({
                    overall_summary: p.status,
                    root_cause_analysis: p.feedback,
                    weak_topics_targeted: p.weak_topics ? p.weak_topics.split('\n').map(s => s.replace('- ', '')) : [],
                    weekly_action_plan: p.action_plan,
                    recommended_resources: p.resources,
                    motivational_note: p.feedback,
                    generated_timestamp: p.generated_at
                  });
                  setShowHistory(false);
                }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  border: '1px solid transparent',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-indigo)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
              >
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {p.status}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 12 }}>
                    Generated: {p.generated_at}
                  </span>
                </div>
                <span className={`badge ${p.risk_level === 'High' ? 'badge-rose' : 'badge-emerald'}`}>
                  {p.risk_level} Risk
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plan Display Area */}
      {activePlan ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Summary & Diagnosis Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 16
          }}>
            <div style={{
              background: 'rgba(99, 102, 241, 0.05)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: 20
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: '#a5b4fc', fontWeight: 700, fontSize: '0.85rem' }}>
                <CheckCircle2 size={16} />
                OVERALL DIAGNOSTIC ASSESSMENT
              </div>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                {activePlan.overall_summary}
              </p>
            </div>

            <div style={{
              background: 'rgba(6, 182, 212, 0.05)',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: 20
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: '#67e8f9', fontWeight: 700, fontSize: '0.85rem' }}>
                <AlertCircle size={16} />
                ROOT CAUSE SYNTHESIS
              </div>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                {activePlan.root_cause_analysis || activePlan.overall_summary}
              </p>
            </div>
          </div>

          {/* 4-Week Action Roadmap */}
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calendar size={18} color="var(--accent-indigo)" />
              4-Week Structured Improvement Roadmap
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 16
            }}>
              {activePlan.weekly_action_plan?.map((week) => (
                <div
                  key={week.week}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: 18,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <span className="badge badge-indigo" style={{ fontSize: '0.75rem' }}>
                        Week {week.week}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>7-Day Sprint</span>
                    </div>

                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
                      {week.theme}
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {week.daily_milestones?.map((m, mIdx) => (
                        <div key={mIdx} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', gap: 6, lineHeight: 1.4 }}>
                          <span style={{ color: 'var(--accent-cyan)' }}>•</span>
                          <span>{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{
                    marginTop: 14,
                    paddingTop: 10,
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    fontSize: '0.75rem',
                    color: '#34d399',
                    fontWeight: 600
                  }}>
                    🎯 Target: {week.expected_outcome}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Learning Resources */}
          {activePlan.recommended_resources?.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <BookOpen size={18} color="var(--accent-cyan)" />
                Curated Practice Resources & References
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 12
              }}>
                {activePlan.recommended_resources.map((res, rIdx) => (
                  <div
                    key={rIdx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: 12,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <span className="badge badge-cyan" style={{ fontSize: '0.68rem', marginBottom: 6 }}>
                        {res.type}
                      </span>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {res.title}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>
                      Focus: {res.focus_area}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Motivational Closing Remark */}
          {activePlan.motivational_note && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(6, 182, 212, 0.08))',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: 18,
              display: 'flex',
              alignItems: 'center',
              gap: 14
            }}>
              <HeartHandshake size={28} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.88rem', color: '#e2e8f0', fontStyle: 'italic', lineHeight: 1.5 }}>
                "{activePlan.motivational_note}"
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.01)',
          borderRadius: 'var(--radius-md)',
          border: '1px dashed var(--border-subtle)'
        }}>
          <Sparkles size={36} color="var(--accent-indigo)" style={{ margin: '0 auto 12px auto', opacity: 0.8 }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 6 }}>
            Ready to generate personalized improvement plan for {studentName}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto 20px auto' }}>
            Click the button above to synthesize subject grades, attendance records, and syllabus topic diagnostics into a customized 4-week roadmap.
          </p>
        </div>
      )}
    </div>
  );
}
