import { useState, useEffect } from 'react'
import { Calendar, Users, CheckCircle2, Clock, Plus, BarChart3, Edit3, List } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { useApi } from '../lib/api'

const tabs = [
  { id: 'events',    label: 'My Events',      icon: Calendar  },
  { id: 'registrations', label: 'Registrants', icon: List    },
  { id: 'propose',   label: 'Propose New',    icon: Plus      },
  { id: 'analytics', label: 'Analytics',      icon: BarChart3 },
]

const statusConfig = {
  pending:           { label: 'Pending Review',    color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.2)'  },
  approved:          { label: 'Approved',           color: '#10B981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.2)'  },
  rejected:          { label: 'Rejected',           color: '#FF6584', bg: 'rgba(255,101,132,0.1)', border: 'rgba(255,101,132,0.2)' },
  upcoming:          { label: 'Upcoming',           color: '#7C74FF', bg: 'rgba(108,99,255,0.1)',  border: 'rgba(108,99,255,0.2)'  },
  registration_open: { label: 'Registration Open', color: '#7C74FF', bg: 'rgba(108,99,255,0.1)',  border: 'rgba(108,99,255,0.2)'  },
  ongoing:           { label: 'Ongoing',            color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.2)'  },
  completed:         { label: 'Completed',          color: '#6B6B8A', bg: 'rgba(107,107,138,0.1)', border: 'rgba(107,107,138,0.2)' },
}

export default function CoordinatorPage() {
  const api = useApi()
  const [activeTab, setActiveTab]   = useState('events')
  const [myEvents, setMyEvents]     = useState([])
  const [proposals, setProposals]   = useState([])
  const [loading, setLoading]       = useState(false)

  // Registrations
  const [selectedEventId, setSelectedEventId] = useState(null)
  const [registrants, setRegistrants]         = useState([])
  const [regsLoading, setRegsLoading]         = useState(false)

  const [form, setForm]           = useState({ name: '', date: '', location: '', capacity: '', description: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitErr, setSubmitErr] = useState('')

  // Edit inline
  const [editId, setEditId]     = useState(null)
  const [editForm, setEditForm] = useState({})
  const [saveMsg, setSaveMsg]   = useState('')

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [ev, pr] = await Promise.all([
        api.get('/api/coordinator/events'),
        api.get('/api/coordinator/proposals'),
      ])
      setMyEvents(ev)
      setProposals(pr)
      // Auto-select first event for registrations
      if (ev.length > 0 && !selectedEventId) setSelectedEventId(ev[0].id)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  async function loadRegistrants(eventId) {
    setRegsLoading(true)
    try {
      const data = await api.get(`/api/coordinator/events/${eventId}/registrations`)
      setRegistrants(data)
    } catch (err) {
      console.error(err)
    }
    setRegsLoading(false)
  }

  useEffect(() => {
    if (activeTab === 'registrations' && selectedEventId) {
      loadRegistrants(selectedEventId)
    }
  }, [activeTab, selectedEventId])

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitErr('')
    try {
      await api.post('/api/coordinator/proposals', {
        event_name:    form.name,
        description:   form.description,
        proposed_date: form.date,
        location:      form.location,
        capacity:      Number(form.capacity),
      })
      setSubmitted(true)
      setForm({ name: '', date: '', location: '', capacity: '', description: '' })
      await loadData()
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      setSubmitErr(err.message)
    }
  }

  async function saveEdit(eventId) {
    setSaveMsg('')
    try {
      await api.put(`/api/coordinator/events/${eventId}`, editForm)
      setSaveMsg('✅ Saved!')
      setEditId(null)
      await loadData()
    } catch (err) {
      setSaveMsg(`❌ ${err.message}`)
    }
  }

  const coordStats = [
    { label: 'My Events',     value: myEvents.length,                                                  icon: Calendar,    color: '#8880FF' },
    { label: 'Registrations', value: myEvents.reduce((a, e) => a + (e.registered || 0), 0),           icon: Users,       color: '#10B981' },
    { label: 'Pending',       value: proposals.filter(p => p.status === 'pending').length,             icon: Clock,       color: '#F59E0B' },
    { label: 'Proposals',     value: proposals.length,                                                 icon: CheckCircle2,color: '#4ECDC4' },
  ]

  return (
    <DashboardLayout>
      <div className="page-header">
        <div className="admin-header-row">
          <div className="admin-header-icon" style={{ background: 'rgba(136,128,255,0.12)', border: '1px solid rgba(136,128,255,0.2)' }}>
            <Edit3 size={17} color="#8880FF" />
          </div>
          <h1 className="page-header__title">Coordinator Dashboard</h1>
        </div>
        <p className="page-header__sub">Manage your assigned event(s) and submit proposals.</p>
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
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`tab-btn${activeTab === t.id ? ' tab-btn--active' : ''}`}>
            <t.icon size={14} /><span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── My Events ── */}
      {activeTab === 'events' && (
        <div className="glass-card">
          <h2 className="section-heading">My Events</h2>
          {loading && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading…</p>}
          {!loading && myEvents.length === 0 && (
            <div className="empty-state" style={{ padding: '32px 0' }}>
              <div className="empty-state__emoji">📋</div>
              <h3 className="empty-state__title">No events assigned</h3>
              <p className="empty-state__sub">Ask the admin to assign you to an event.</p>
            </div>
          )}
          <div className="coord-event-list">
            {myEvents.map(e => {
              const cfg = statusConfig[e.status] || statusConfig.upcoming
              const fill = Math.round(((e.registered || 0) / e.capacity) * 100)
              const isEditing = editId === e.id

              return (
                <div key={e.id} className="coord-event-item">
                  {isEditing ? (
                    <div className="propose-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Event Name</label>
                          <input className="form-input" value={editForm.event_name || ''} onChange={ev => setEditForm({ ...editForm, event_name: ev.target.value })} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Date</label>
                          <input className="form-input" type="datetime-local" value={editForm.event_date ? editForm.event_date.slice(0, 16) : ''} onChange={ev => setEditForm({ ...editForm, event_date: ev.target.value })} />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Location</label>
                          <input className="form-input" value={editForm.location || ''} onChange={ev => setEditForm({ ...editForm, location: ev.target.value })} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Capacity</label>
                          <input className="form-input" type="number" value={editForm.capacity || ''} onChange={ev => setEditForm({ ...editForm, capacity: ev.target.value })} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea className="form-input form-textarea" rows={3} value={editForm.description || ''} onChange={ev => setEditForm({ ...editForm, description: ev.target.value })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Status</label>
                        <select className="form-input" value={editForm.status || 'upcoming'} onChange={ev => setEditForm({ ...editForm, status: ev.target.value })}>
                          {['upcoming', 'registration_open', 'ongoing', 'completed'].map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                      {saveMsg && <p style={{ fontSize: 13, color: saveMsg.startsWith('✅') ? '#10B981' : '#FF6584' }}>{saveMsg}</p>}
                      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <button className="btn-primary btn--sm" onClick={() => saveEdit(e.id)}>Save Changes</button>
                        <button className="btn-ghost btn--sm" onClick={() => { setEditId(null); setSaveMsg('') }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="coord-event-item__top">
                        <div>
                          <p className="coord-event-item__name">{e.event_name}</p>
                          <p className="coord-event-item__date">
                            {new Date(e.event_date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                            {e.location && ` · ${e.location}`}
                            {e.club_name && ` · ${e.club_name}`}
                          </p>
                        </div>
                        <span className="coord-event-item__status" style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                          {cfg.label}
                        </span>
                      </div>
                      <div className="coord-event-item__bar-wrap">
                        <div className="reg-bar__labels">
                          <span>{e.registered || 0} registered</span>
                          <span>{e.capacity} capacity</span>
                        </div>
                        <div className="reg-bar__track">
                          <div className="reg-bar__fill" style={{
                            width: `${fill}%`,
                            background: fill > 80 ? 'linear-gradient(90deg,#FF6584,#FF8C94)' : 'linear-gradient(90deg,#6C63FF,#9B94FF)',
                          }} />
                        </div>
                        <p className="reg-bar__pct">{fill}% full</p>
                      </div>
                      <div className="coord-event-item__actions">
                        <button
                          className="btn-ghost btn--sm"
                          onClick={() => {
                            setEditId(e.id)
                            setEditForm({ event_name: e.event_name, event_date: e.event_date, location: e.location, capacity: e.capacity, status: e.status, description: e.description || '' })
                            setSaveMsg('')
                          }}
                        >
                          Edit Details
                        </button>
                        <button
                          className="btn-ghost btn--sm"
                          style={{ color: '#7C74FF' }}
                          onClick={() => { setSelectedEventId(e.id); setActiveTab('registrations') }}
                        >
                          <List size={12} /> View Registrants
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Registrations ── */}
      {activeTab === 'registrations' && (
        <div className="glass-card">
          <div className="glass-card__header">
            <h2 className="section-heading">Registrants</h2>
          </div>

          {/* Event selector */}
          {myEvents.length > 1 && (
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Select Event</label>
              <select
                className="form-input"
                value={selectedEventId || ''}
                onChange={e => setSelectedEventId(Number(e.target.value))}
                style={{ maxWidth: 360 }}
              >
                {myEvents.map(e => (
                  <option key={e.id} value={e.id}>{e.event_name}</option>
                ))}
              </select>
            </div>
          )}

          {myEvents.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No assigned events.</p>
          )}

          {regsLoading ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading registrants…</p>
          ) : (
            <>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
                {registrants.length} confirmed registrant{registrants.length !== 1 ? 's' : ''}
              </p>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Registered At</th></tr>
                  </thead>
                  <tbody>
                    {registrants.map((r, i) => (
                      <tr key={r.id}>
                        <td className="admin-table__meta">{i + 1}</td>
                        <td className="admin-table__name">{r.first_name} {r.last_name}</td>
                        <td className="admin-table__meta">{r.email}</td>
                        <td>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: 'rgba(108,99,255,0.1)', color: '#7C74FF' }}>
                            {r.user_role}
                          </span>
                        </td>
                        <td className="admin-table__meta">
                          {new Date(r.registered_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                        </td>
                      </tr>
                    ))}
                    {registrants.length === 0 && (
                      <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 24 }}>No registrations yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
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
                <label className="form-label">Event Name *</label>
                <input type="text" placeholder="e.g. Annual Coding Hackathon" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="form-input" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Proposed Date *</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Capacity *</label>
                  <input type="number" placeholder="e.g. 100" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} className="form-input" required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Location / Venue</label>
                <input type="text" placeholder="e.g. Main Auditorium" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea rows={4} placeholder="Describe the event…" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="form-input form-textarea" required />
              </div>
              {submitErr && <p style={{ fontSize: 13, color: '#FF6584' }}>{submitErr}</p>}
              <button type="submit" className="btn-primary" style={{ marginTop: 8 }}>Submit Proposal</button>
            </form>
          )}

          {/* Proposal history */}
          {proposals.length > 0 && (
            <div style={{ marginTop: 32 }}>
              <p className="section-heading" style={{ fontSize: 15 }}>My Proposals</p>
              <div className="coord-event-list" style={{ marginTop: 12 }}>
                {proposals.map(p => {
                  const cfg = {
                    pending:  { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  label: 'Pending'  },
                    approved: { color: '#10B981', bg: 'rgba(16,185,129,0.1)',  label: 'Approved' },
                    rejected: { color: '#FF6584', bg: 'rgba(255,101,132,0.1)', label: 'Rejected' },
                  }[p.status] || {}
                  return (
                    <div key={p.id} className="coord-event-item">
                      <div className="coord-event-item__top">
                        <div>
                          <p className="coord-event-item__name">{p.event_name}</p>
                          <p className="coord-event-item__date">
                            {new Date(p.proposed_date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                            {p.location && ` · ${p.location}`}
                          </p>
                          {p.admin_notes && (
                            <p style={{ fontSize: 12, color: '#F59E0B', marginTop: 4 }}>
                              Admin note: {p.admin_notes}
                            </p>
                          )}
                        </div>
                        <span className="coord-event-item__status" style={{ color: cfg.color, background: cfg.bg }}>{cfg.label}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Analytics ── */}
      {activeTab === 'analytics' && (
        <div className="glass-card">
          <h2 className="section-heading">Registration Breakdown</h2>
          {myEvents.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No events to analyse yet.</p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {myEvents.map(e => {
              const fill = Math.round(((e.registered || 0) / e.capacity) * 100)
              const cfg = statusConfig[e.status] || statusConfig.upcoming
              return (
                <div key={e.id} className="analytics-event-row">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <p className="analytics-event-row__name">{e.event_name}</p>
                    <span style={{ fontSize: 11, fontWeight: 600, color: cfg.color, background: cfg.bg, padding: '3px 10px', borderRadius: 99 }}>
                      {cfg.label}
                    </span>
                  </div>
                  <div className="analytics-event-row__bar-wrap">
                    <div className="reg-bar__track" style={{ flex: 1, height: 8, borderRadius: 99 }}>
                      <div className="reg-bar__fill" style={{
                        width: `${fill}%`,
                        background: fill > 80 ? 'linear-gradient(90deg,#FF6584,#FF8C94)' : 'linear-gradient(90deg,#6C63FF,#9B94FF)',
                      }} />
                    </div>
                    <span className="analytics-event-row__pct">{fill}%</span>
                  </div>
                  <p className="analytics-event-row__count">{e.registered || 0} / {e.capacity} registered</p>
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
.admin-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 24px;
  animation: fadeUp 0.5s var(--ease) both;
}
.propose-form { display: flex; flex-direction: column; gap: 14px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label {
  font-size: 11px; font-weight: 600;
  color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em;
}
.form-input {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 10px; padding: 10px 14px;
  font-size: 13px; color: var(--text);
  font-family: 'DM Sans', sans-serif;
  outline: none; transition: border-color 0.18s;
}
.form-input:focus { border-color: rgba(108,99,255,0.5); }
.form-textarea { resize: vertical; min-height: 80px; }
.coord-event-list { display: flex; flex-direction: column; gap: 12px; }
.coord-event-item {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 14px; padding: 16px 18px; transition: border-color 0.2s;
}
.coord-event-item:hover { border-color: rgba(108,99,255,0.2); }
.coord-event-item__top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
.coord-event-item__name { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 3px; }
.coord-event-item__date { font-size: 12px; color: var(--text-muted); }
.coord-event-item__status { font-size: 11px; font-weight: 600; padding: 4px 11px; border-radius: 99px; flex-shrink: 0; }
.coord-event-item__bar-wrap { margin-bottom: 12px; }
.coord-event-item__actions { display: flex; gap: 8px; }
.analytics-event-row {
  background: var(--surface); border-radius: 12px; padding: 14px 16px;
}
.analytics-event-row__name {
  font-size: 13px; font-weight: 600; color: var(--text);
}
.analytics-event-row__bar-wrap {
  display: flex; align-items: center; gap: 10px; margin: 8px 0 4px;
}
.analytics-event-row__pct { font-size: 12px; font-weight: 600; color: var(--text-muted); min-width: 36px; text-align: right; }
.analytics-event-row__count { font-size: 11px; color: var(--text-muted); }
@media (max-width: 600px) {
  .form-row { grid-template-columns: 1fr; }
  .admin-stats { grid-template-columns: repeat(2, 1fr); }
}
`