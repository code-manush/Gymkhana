import { useState } from 'react'
import { Calendar, Users, CheckCircle2, XCircle, Clock, Plus, BarChart3, Edit3 } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'

const myEvents = [
  { id: 1, name: 'Photography Contest',  date: '2025-04-28', status: 'pending',  registered: 45, capacity: 60  },
  { id: 2, name: 'E-Sports Tournament',  date: '2025-05-05', status: 'approved', registered: 88, capacity: 120 },
  { id: 3, name: 'Classical Music Night',date: '2025-05-12', status: 'approved', registered: 62, capacity: 150 },
]

const coordStats = [
  { label: 'My Events',    value: '3',  icon: Calendar,   color: '#8880FF' },
  { label: 'Registrations',value: '195',icon: Users,      color: '#10B981' },
  { label: 'Pending Review',value: '1', icon: Clock,      color: '#F59E0B' },
  { label: 'Completed',    value: '2',  icon: CheckCircle2,color: '#4ECDC4' },
]

const tabs = [
  { id: 'events',    label: 'My Events',   icon: Calendar  },
  { id: 'propose',   label: 'Propose New', icon: Plus      },
  { id: 'analytics', label: 'Analytics',   icon: BarChart3 },
]

const statusConfig = {
  pending:  { label: 'Pending Review', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.2)'  },
  approved: { label: 'Approved',       color: '#10B981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.2)'  },
  rejected: { label: 'Rejected',       color: '#FF6584', bg: 'rgba(255,101,132,0.1)', border: 'rgba(255,101,132,0.2)' },
}

export default function CoordinatorPage() {
  const [activeTab, setActiveTab] = useState('events')
  const [form, setForm] = useState({ name: '', date: '', location: '', capacity: '', description: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setForm({ name: '', date: '', location: '', capacity: '', description: '' })
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div className="admin-header-row">
          <div className="admin-header-icon">
            <Edit3 size={17} color="#8880FF" />
          </div>
          <h1 className="page-header__title">Coordinator Dashboard</h1>
        </div>
        <p className="page-header__sub">Manage your club's events and proposals.</p>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        {coordStats.map((s, i) => (
          <div key={i} className="admin-stat-card">
            <div className="admin-stat-card__icon" style={{ background: `${s.color}18`, border: `1px solid ${s.color}25` }}>
              <s.icon size={16} style={{ color: s.color }} />
            </div>
            <p className="admin-stat-card__value" style={{ color: s.color }}>{s.value}</p>
            <p className="admin-stat-card__label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`tab-btn${activeTab === t.id ? ' tab-btn--active' : ''}`}
          >
            <t.icon size={14} />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── My Events ── */}
      {activeTab === 'events' && (
        <div className="glass-card">
          <h2 className="section-heading">My Events</h2>
          <div className="coord-event-list">
            {myEvents.map(e => {
              const cfg = statusConfig[e.status] || statusConfig.pending
              const fill = Math.round((e.registered / e.capacity) * 100)
              return (
                <div key={e.id} className="coord-event-item">
                  <div className="coord-event-item__top">
                    <div>
                      <p className="coord-event-item__name">{e.name}</p>
                      <p className="coord-event-item__date">{new Date(e.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
                    </div>
                    <span
                      className="coord-event-item__status"
                      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
                    >
                      {cfg.label}
                    </span>
                  </div>
                  <div className="coord-event-item__bar-wrap">
                    <div className="reg-bar__labels">
                      <span>{e.registered} registered</span>
                      <span>{e.capacity} capacity</span>
                    </div>
                    <div className="reg-bar__track">
                      <div
                        className="reg-bar__fill"
                        style={{
                          width: `${fill}%`,
                          background: fill > 80
                            ? 'linear-gradient(90deg,#FF6584,#FF8C94)'
                            : 'linear-gradient(90deg,#6C63FF,#9B94FF)',
                        }}
                      />
                    </div>
                    <p className="reg-bar__pct">{fill}% full</p>
                  </div>
                  <div className="coord-event-item__actions">
                    <button className="btn-ghost btn--sm">Edit</button>
                    <button className="btn-ghost btn--sm">View Registrations</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Propose ── */}
      {activeTab === 'propose' && (
        <div className="glass-card">
          <h2 className="section-heading">Propose a New Event</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
            Submit an event proposal for admin review. You'll be notified once it's approved.
          </p>
          {submitted ? (
            <div className="reg-success" style={{ padding: '28px 0' }}>
              <CheckCircle2 size={40} color="#10B981" />
              <p className="reg-success__title">Proposal Submitted!</p>
              <p className="reg-success__sub">Admin will review and respond within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="propose-form">
              <div className="form-group">
                <label className="form-label">Event Name</label>
                <input
                  type="text"
                  placeholder="e.g. Annual Coding Hackathon"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Proposed Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Capacity</label>
                  <input
                    type="number"
                    placeholder="e.g. 100"
                    value={form.capacity}
                    onChange={e => setForm({ ...form, capacity: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Location / Venue</label>
                <input
                  type="text"
                  placeholder="e.g. Main Auditorium"
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows={4}
                  placeholder="Describe the event, its goals, and what participants can expect..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="form-input form-textarea"
                  required
                />
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: 8 }}>
                Submit Proposal
              </button>
            </form>
          )}
        </div>
      )}

      {/* ── Analytics ── */}
      {activeTab === 'analytics' && (
        <div className="glass-card">
          <h2 className="section-heading">Event Analytics</h2>
          <div className="analytics-grid">
            {[
              { label: 'Total Registrations', value: '195', change: '+12%', positive: true  },
              { label: 'Avg. Fill Rate',       value: '73%', change: '+8%',  positive: true  },
              { label: 'Events This Semester', value: '3',   change: '0',    positive: null  },
              { label: 'Cancelled Events',     value: '0',   change: '—',    positive: null  },
            ].map((m, i) => (
              <div key={i} className="analytics-card">
                <p className="analytics-card__label">{m.label}</p>
                <p className="analytics-card__value">{m.value}</p>
                {m.change !== '—' && m.change !== '0' && (
                  <span className={`analytics-card__change${m.positive ? ' analytics-card__change--up' : ' analytics-card__change--down'}`}>
                    {m.change}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="analytics-events">
            <p className="section-heading" style={{ fontSize: 15, marginTop: 28, marginBottom: 14 }}>Registration Breakdown</p>
            {myEvents.map(e => {
              const fill = Math.round((e.registered / e.capacity) * 100)
              return (
                <div key={e.id} className="analytics-event-row">
                  <p className="analytics-event-row__name">{e.name}</p>
                  <div className="analytics-event-row__bar-wrap">
                    <div className="reg-bar__track" style={{ flex: 1, height: 6 }}>
                      <div
                        className="reg-bar__fill"
                        style={{
                          width: `${fill}%`,
                          background: fill > 80
                            ? 'linear-gradient(90deg,#FF6584,#FF8C94)'
                            : 'linear-gradient(90deg,#6C63FF,#9B94FF)',
                        }}
                      />
                    </div>
                    <span className="analytics-event-row__pct">{fill}%</span>
                  </div>
                  <p className="analytics-event-row__count">{e.registered}/{e.capacity}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

/* ── CoordinatorPage Styles ── */
const _css = `
.coord-event-list { display: flex; flex-direction: column; gap: 14px; }
.coord-event-item {
  padding: 16px 18px;
  background: var(--surface);
  border-radius: 14px;
  border: 1px solid var(--border);
}
.coord-event-item__top {
  display: flex; align-items: flex-start;
  justify-content: space-between; gap: 10px; margin-bottom: 12px;
}
.coord-event-item__name { font-size: 14px; font-weight: 600; color: var(--text); }
.coord-event-item__date { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
.coord-event-item__status {
  font-size: 11px; font-weight: 600;
  padding: 3px 10px; border-radius: 99px; white-space: nowrap;
}
.coord-event-item__bar-wrap { margin-bottom: 12px; }
.coord-event-item__actions { display: flex; gap: 8px; }

/* Propose form */
.propose-form { display: flex; flex-direction: column; gap: 18px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: 12px; font-weight: 600; color: var(--text-sub); letter-spacing: 0.01em; }
.form-input {
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 13.5px;
  color: var(--text);
  outline: none;
  font-family: 'DM Sans', sans-serif;
  transition: border-color 0.16s, box-shadow 0.16s, background 0.16s;
  resize: none;
}
.form-input::placeholder { color: var(--text-muted); }
.form-input:focus {
  border-color: rgba(108,99,255,0.48);
  box-shadow: 0 0 0 3px rgba(108,99,255,0.08);
  background: var(--surface-2);
}
.form-textarea { line-height: 1.6; }

/* Analytics */
.analytics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.analytics-card {
  background: var(--surface); border-radius: 14px;
  padding: 16px; border: 1px solid var(--border);
}
.analytics-card__label { font-size: 12px; color: var(--text-muted); margin-bottom: 6px; }
.analytics-card__value {
  font-family: 'Syne', sans-serif; font-weight: 700;
  font-size: 26px; color: var(--text); line-height: 1;
}
.analytics-card__change {
  display: inline-block; font-size: 11px; font-weight: 600;
  padding: 2px 7px; border-radius: 99px; margin-top: 6px;
}
.analytics-card__change--up   { color: #10B981; background: rgba(16,185,129,0.12); }
.analytics-card__change--down { color: #FF6584; background: rgba(255,101,132,0.12); }

.analytics-events { }
.analytics-event-row {
  display: flex; align-items: center; gap: 12px; margin-bottom: 10px;
}
.analytics-event-row__name {
  font-size: 13px; font-weight: 500; color: var(--text);
  width: 200px; flex-shrink: 0;
}
.analytics-event-row__bar-wrap {
  flex: 1; display: flex; align-items: center; gap: 10px;
}
.analytics-event-row__pct {
  font-size: 12px; font-weight: 600; color: var(--text-muted);
  width: 36px; text-align: right; flex-shrink: 0;
}
.analytics-event-row__count { font-size: 12px; color: var(--text-muted); width: 60px; text-align: right; }
@media (max-width: 900px) {
  .analytics-grid { grid-template-columns: repeat(2, 1fr); }
  .form-row { grid-template-columns: 1fr; }
}
`