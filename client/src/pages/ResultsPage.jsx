import { useState } from 'react'
import { Trophy } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'

const results = [
  {
    id: 1, event: 'Badminton Tournament', date: '2025-03-15', category: 'Sports',
    standings: [
      { position: 1, name: 'Aditya Kumar',    department: 'CSE',     score: null, team: null },
      { position: 2, name: 'Rohan Mehta',     department: 'ECE',     score: null, team: null },
      { position: 3, name: 'Vikram Singh',    department: 'ME',      score: null, team: null },
    ],
  },
  {
    id: 2, event: 'Quiz Championship', date: '2025-03-10', category: 'Literary',
    standings: [
      { position: 1, name: 'Team Quizzards', department: 'CSE/ECE', score: 480, team: 'Anmol J, Bhawesh R' },
      { position: 2, name: 'Brain Busters',  department: 'ME/CE',   score: 420, team: 'Harsh G, Manush P'  },
      { position: 3, name: 'Think Tank',     department: 'EE',      score: 380, team: 'Riya S, Arjun T'    },
    ],
  },
  {
    id: 3, event: 'Photography Contest', date: '2025-03-20', category: 'Cultural',
    standings: [
      { position: 1, name: 'Sneha Patel',  department: 'Design', score: 95, team: null },
      { position: 2, name: 'Karan Shah',   department: 'CSE',    score: 91, team: null },
      { position: 3, name: 'Priya Nair',   department: 'ECE',    score: 87, team: null },
    ],
  },
]

const podiumConfig = {
  1: { icon: '🥇', color: '#F5C842', bg: 'rgba(245,200,66,0.12)',  border: 'rgba(245,200,66,0.25)'  },
  2: { icon: '🥈', color: '#9CA3AF', bg: 'rgba(156,163,175,0.1)',  border: 'rgba(156,163,175,0.2)'  },
  3: { icon: '🥉', color: '#92400E', bg: 'rgba(146,64,14,0.12)',   border: 'rgba(146,64,14,0.25)'   },
}

const categories = ['All', 'Technical', 'Cultural', 'Sports', 'Literary']

export default function ResultsPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeResult, setActiveResult] = useState(results[0])

  const filtered = activeCategory === 'All' ? results : results.filter(r => r.category === activeCategory)

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-header__title">Results</h1>
        <p className="page-header__sub">Published results and leaderboards for all Gymkhana events.</p>
      </div>

      <div className="pill-row">
        {categories.map(c => (
          <button key={c} onClick={() => setActiveCategory(c)} className={`pill${activeCategory === c ? ' pill--active' : ''}`}>{c}</button>
        ))}
      </div>

      <div className="results-layout">
        {/* Event list */}
        <div className="results-list">
          <p className="eyebrow-label" style={{ marginBottom: 14 }}>Select Event</p>
          {filtered.map(r => (
            <button
              key={r.id}
              onClick={() => setActiveResult(r)}
              className={`result-item${activeResult?.id === r.id ? ' result-item--active' : ''}`}
            >
              <div className="result-item__top">
                <div>
                  <p className="result-item__name">{r.event}</p>
                  <p className="result-item__date">{new Date(r.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
                </div>
                <span className="result-item__cat">{r.category}</span>
              </div>
              <div className="result-item__medals">
                {['🥇','🥈','🥉'].map((m,i) => <span key={i}>{m}</span>)}
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>No results in this category yet.</p>
          )}
        </div>

        {/* Result detail */}
        {activeResult && (
          <div className="result-detail glass-card">
            <div className="result-detail__head">
              <div>
                <h2 className="result-detail__title">{activeResult.event}</h2>
                <p className="result-detail__meta">
                  {new Date(activeResult.date).toLocaleDateString('en-IN', { dateStyle: 'long' })} · {activeResult.category}
                </p>
              </div>
              <Trophy size={28} color="#F5C842" />
            </div>

            {/* Podium visual */}
            <div className="podium">
              {activeResult.standings[1] && (
                <div className="podium-slot">
                  <span className="podium-slot__emoji">🥈</span>
                  <div className="podium-slot__bar podium-slot__bar--2" />
                </div>
              )}
              {activeResult.standings[0] && (
                <div className="podium-slot podium-slot--1">
                  <span className="podium-slot__emoji">🥇</span>
                  <div className="podium-slot__bar podium-slot__bar--1" />
                </div>
              )}
              {activeResult.standings[2] && (
                <div className="podium-slot">
                  <span className="podium-slot__emoji">🥉</span>
                  <div className="podium-slot__bar podium-slot__bar--3" />
                </div>
              )}
            </div>

            {/* Standings */}
            <div className="standings">
              {activeResult.standings.map(s => {
                const pc = podiumConfig[s.position] || podiumConfig[3]
                return (
                  <div
                    key={s.position}
                    className="standing-row"
                    style={{ background: pc.bg, border: `1px solid ${pc.border}` }}
                  >
                    <span className="standing-row__icon">{pc.icon}</span>
                    <div className="standing-row__body">
                      <p className="standing-row__name">{s.name}</p>
                      <p className="standing-row__dept">{s.department}{s.team ? ` · ${s.team}` : ''}</p>
                    </div>
                    {s.score && (
                      <div className="standing-row__score" style={{ color: pc.color }}>
                        {s.score}
                        <span className="standing-row__score-unit">pts</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

/* ── ResultsPage Styles ── */
const _css = `
.results-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 20px;
  align-items: start;
}
.results-list { display: flex; flex-direction: column; gap: 8px; }
.result-item {
  width: 100%;
  text-align: left;
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 14px 16px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  font-family: 'DM Sans', sans-serif;
}
.result-item:hover { border-color: rgba(108,99,255,0.2); }
.result-item--active {
  border-color: rgba(108,99,255,0.5);
  background: rgba(108,99,255,0.06);
}
.result-item__top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 8px; }
.result-item__name { font-family: 'Syne', sans-serif; font-weight: 600; font-size: 13px; color: var(--text); }
.result-item__date { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
.result-item__cat {
  font-size: 10px;
  font-weight: 600;
  color: #7C74FF;
  background: rgba(108,99,255,0.1);
  padding: 3px 8px;
  border-radius: 99px;
  white-space: nowrap;
}
.result-item__medals { font-size: 16px; }
.result-detail { }
.result-detail__head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 32px; }
.result-detail__title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 28px; color: var(--text); letter-spacing: -0.02em; margin-bottom: 4px; }
.result-detail__meta { font-size: 13px; color: var(--text-muted); }
.podium {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 12px;
  height: 140px;
  margin-bottom: 32px;
}
.podium-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.podium-slot__emoji { font-size: 28px; }
.podium-slot--1 .podium-slot__emoji { font-size: 36px; }
.podium-slot__bar {
  width: 80px;
  border-radius: 8px 8px 0 0;
}
.podium-slot__bar--1 { height: 88px; background: linear-gradient(to top, rgba(245,200,66,0.25), rgba(245,200,66,0.06)); }
.podium-slot__bar--2 { height: 60px; background: linear-gradient(to top, rgba(156,163,175,0.22), rgba(156,163,175,0.05)); }
.podium-slot__bar--3 { height: 44px; background: linear-gradient(to top, rgba(146,64,14,0.22), rgba(146,64,14,0.05)); }
.standings { display: flex; flex-direction: column; gap: 10px; }
.standing-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border-radius: 14px;
}
.standing-row__icon { font-size: 26px; width: 32px; text-align: center; flex-shrink: 0; }
.standing-row__body { flex: 1; }
.standing-row__name { font-size: 14px; font-weight: 600; color: var(--text); }
.standing-row__dept { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
.standing-row__score {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 22px;
  line-height: 1;
  text-align: right;
}
.standing-row__score-unit { display: block; font-size: 10px; color: var(--text-muted); font-family: 'DM Sans', sans-serif; margin-top: 2px; }
@media (max-width: 900px) {
  .results-layout { grid-template-columns: 1fr; }
}
`