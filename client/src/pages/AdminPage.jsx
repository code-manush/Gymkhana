import { useState, useEffect } from 'react'
import {
  Users, Calendar, Clock, CheckCircle2, XCircle,
  Shield, UserPlus, Eye, EyeOff, BarChart3, Edit3, Trash2,
} from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { useApi } from '../lib/api'

const tabs = [
  { id: 'overview',     label: 'Overview',      icon: BarChart3  },
  { id: 'events',       label: 'Manage Events', icon: Calendar   },
  { id: 'users',        label: 'Users',         icon: Users      },
  { id: 'proposals',    label: 'Proposals',     icon: Clock      },
]

const roleColors = {
  admin:       { color: '#FF6584', bg: 'rgba(255,101,132,0.1)', border: 'rgba(255,101,132,0.2)' },
  coordinator: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)'  },
  student:     { color: '#7C74FF', bg: 'rgba(108,99,255,0.1)', border: 'rgba(108,99,255,0.2)'  },
  visitor:     { color: '#4ECDC4', bg: 'rgba(78,205,196,0.1)', border: 'rgba(78,205,196,0.2)'  },
}

const statusCfg = {
  pending:  { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  label: 'Pending'  },
  approved: { color: '#10B981', bg: 'rgba(16,185,129,0.1)',  label: 'Approved' },
  rejected: { color: '#FF6584', bg: 'rgba(255,101,132,0.1)', label: 'Rejected' },
}

export default function AdminPage() {
  const api = useApi()
  const [activeTab, setActiveTab]     = useState('overview')
  const [stats, setStats]             = useState(null)
  const [users, setUsers]             = useState([])
  const [events, setEvents]           = useState([])
  const [proposals, setProposals]     = useState([])
  const [loading, setLoading]         = useState(false)

  // Coordinator assignment modal state
  const [assignModal, setAssignModal] = useState(null)  // eventId or null
  const [assignUserId, setAssignUserId] = useState('')
  const [assignMsg, setAssignMsg]     = useState('')

  // Create event form
  const [showCreate, setShowCreate]   = useState(false)
  const [createForm, setCreateForm]   = useState({
    event_name: '', description: '', event_date: '', location: '',
    capacity: '', category: 'Technical', status: 'upcoming', visitor_open: false,
  })
  const [createMsg, setCreateMsg]     = useState('')

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    try {
      const [s, u, e, p] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/admin/users'),
        api.get('/api/events'),
        api.get('/api/admin/proposals'),
      ])
      setStats(s); setUsers(u); setEvents(e); setProposals(p)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  // ── Role change ───────────────────────────────────────────
  async function changeRole(userId, newRole) {
    try {
      await api.patch(`/api/admin/users/${userId}/role`, { role: newRole })
      setUsers(u => u.map(x => x.id === userId ? { ...x, role: newRole } : x))
    } catch (err) {
      alert(err.message)
    }
  }

  // ── Visitor toggle ────────────────────────────────────────
  async function toggleVisitorAccess(eventId, current) {
    try {
      await api.patch(`/api/admin/events/${eventId}/visitor-access`, { visitor_open: !current })
      setEvents(ev => ev.map(e => e.id === eventId ? { ...e, visitor_open: !current } : e))
    } catch (err) {
      alert(err.message)
    }
  }

  // ── Assign coordinator ────────────────────────────────────
  async function assignCoordinator() {
    if (!assignUserId.trim()) return
    try {
      await api.post(`/api/admin/events/${assignModal}/coordinator`, { userId: assignUserId.trim() })
      setAssignMsg('✅ Coordinator assigned!')
      setAssignUserId('')
      await fetchAll()
      setTimeout(() => { setAssignModal(null); setAssignMsg('') }, 1500)
    } catch (err) {
      setAssignMsg(`❌ ${err.message}`)
    }
  }

  // ── Proposal action ───────────────────────────────────────
  async function handleProposal(id, status) {
    try {
      await api.patch(`/api/admin/proposals/${id}`, { status })
      setProposals(p => p.map(x => x.id === id ? { ...x, status } : x))
    } catch (err) {
      alert(err.message)
    }
  }

  // ── Create event ──────────────────────────────────────────
  async function createEvent(e) {
    e.preventDefault()
    try {
      await api.post('/api/events', {
        ...createForm,
        capacity: Number(createForm.capacity),
        visitor_open: createForm.visitor_open ? 1 : 0,
      })
      setCreateMsg('✅ Event created!')
      setCreateForm({ event_name: '', description: '', event_date: '', location: '', capacity: '', category: 'Technical', status: 'upcoming', visitor_open: false })
      await fetchAll()
      setTimeout(() => { setShowCreate(false); setCreateMsg('') }, 1500)
    } catch (err) {
      setCreateMsg(`❌ ${err.message}`)
    }
  }

  const adminStats = stats ? [
    { label: 'Total Users',   value: stats.users,    color: '#7C74FF', icon: Users    },
    { label: 'Students',      value: stats.students,  color: '#8880FF', icon: Users    },
    { label: 'Visitors',      value: stats.visitors,  color: '#4ECDC4', icon: Eye      },
    { label: 'Active Events', value: stats.events,    color: '#10B981', icon: Calendar },
    { label: 'Pending',       value: stats.pending,   color: '#F59E0B', icon: Clock    },
    { label: 'Clubs',         value: stats.clubs,     color: '#FF6584', icon: Shield   },
  ] : []

  return (
    <DashboardLayout>
      <div className="page-header">
        <div className="admin-header-row">
          <div className="admin-header-icon"><Shield size={17} color="#FF6584" /></div>
          <h1 className="page-header__title">Admin Dashboard</h1>
        </div>
        <p className="page-header__sub">Manage users, events, coordinators, and proposals.</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="admin-stats-6">
          {adminStats.map((s, i) => (
            <div key={i} className="admin-stat-card">
              <div className="admin-stat-card__icon" style={{ background: `${s.color}18`, border: `1px solid ${s.color}25` }}>
                <s.icon size={15} style={{ color: s.color }} />
              </div>
              <p className="admin-stat-card__value" style={{ color: s.color }}>{s.value}</p>
              <p className="admin-stat-card__label">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="tab-bar">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`tab-btn${activeTab === t.id ? ' tab-btn--active' : ''}`}
          >
            <t.icon size={14} /><span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {activeTab === 'overview' && (
        <div className="glass-card">
          <h2 className="section-heading">Role Legend</h2>
          <div className="role-legend">
            {[
              { role: 'admin',       desc: 'Full access. Manages users, events, clubs, proposals.'             },
              { role: 'coordinator', desc: 'Manages one assigned event. Can propose new events.'               },
              { role: 'student',     desc: 'Registers for all events. Must have @iiitvadodara.ac.in email.'    },
              { role: 'visitor',     desc: 'Any email. Can only register for visitor-open events.'             },
            ].map((r, i) => {
              const cfg = roleColors[r.role]
              return (
                <div key={i} className="role-legend-item" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                  <span className="role-badge-sm" style={{ color: cfg.color }}>{r.role}</span>
                  <p className="role-legend-desc">{r.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Manage Events ── */}
      {activeTab === 'events' && (
        <div className="glass-card">
          <div className="glass-card__header">
            <h2 className="section-heading">All Events</h2>
            <button onClick={() => setShowCreate(!showCreate)} className="btn-primary" style={{ fontSize: 12, padding: '7px 14px' }}>
              + New Event
            </button>
          </div>

          {/* Create form */}
          {showCreate && (
            <div className="create-event-form">
              <form onSubmit={createEvent} className="propose-form" style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Event Name</label>
                    <input className="form-input" required placeholder="e.g. Hackathon 2026" value={createForm.event_name} onChange={ev => setCreateForm({ ...createForm, event_name: ev.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input className="form-input" type="date" required value={createForm.event_date} onChange={ev => setCreateForm({ ...createForm, event_date: ev.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input className="form-input" placeholder="Main Auditorium" value={createForm.location} onChange={ev => setCreateForm({ ...createForm, location: ev.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Capacity</label>
                    <input className="form-input" type="number" required placeholder="100" value={createForm.capacity} onChange={ev => setCreateForm({ ...createForm, capacity: ev.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-input" value={createForm.category} onChange={ev => setCreateForm({ ...createForm, category: ev.target.value })}>
                      {['Technical','Cultural','Sports','Literary'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-input" value={createForm.status} onChange={ev => setCreateForm({ ...createForm, status: ev.target.value })}>
                      {['upcoming','registration_open','ongoing','completed'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input form-textarea" rows={3} placeholder="Describe the event..." value={createForm.description} onChange={ev => setCreateForm({ ...createForm, description: ev.target.value })} />
                </div>
                <label className="visitor-toggle-label">
                  <input type="checkbox" checked={createForm.visitor_open} onChange={ev => setCreateForm({ ...createForm, visitor_open: ev.target.checked })} />
                  <span>Open to Visitors (non-college emails)</span>
                </label>
                {createMsg && <p style={{ fontSize: 13, color: createMsg.startsWith('✅') ? '#10B981' : '#FF6584' }}>{createMsg}</p>}
                <button type="submit" className="btn-primary" style={{ marginTop: 8 }}>Create Event</button>
              </form>
            </div>
          )}

          {/* Events table */}
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Event</th><th>Date</th><th>Status</th><th>Visitors</th><th>Coordinator</th>
                </tr>
              </thead>
              <tbody>
                {events.map(ev => (
                  <tr key={ev.id}>
                    <td className="admin-table__name">{ev.event_name}</td>
                    <td className="admin-table__meta">{new Date(ev.event_date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</td>
                    <td>
                      <span className="status-pill">{ev.status.replace('_', ' ')}</span>
                    </td>
                    <td>
                      <button
                        onClick={() => toggleVisitorAccess(ev.id, ev.visitor_open)}
                        className={`visitor-toggle-btn${ev.visitor_open ? ' visitor-toggle-btn--on' : ''}`}
                        title={ev.visitor_open ? 'Click to restrict to college only' : 'Click to open to visitors'}
                      >
                        {ev.visitor_open ? <Eye size={13} /> : <EyeOff size={13} />}
                        {ev.visitor_open ? 'Open' : 'Closed'}
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => { setAssignModal(ev.id); setAssignMsg('') }}
                        className="btn-ghost btn--sm"
                        style={{ gap: 5 }}
                      >
                        <UserPlus size={12} /> Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Users ── */}
      {activeTab === 'users' && (
        <div className="glass-card">
          <h2 className="section-heading">All Users</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Change Role</th></tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const cfg = roleColors[u.role] || roleColors.student
                  return (
                    <tr key={u.id}>
                      <td className="admin-table__name">{u.first_name} {u.last_name}</td>
                      <td className="admin-table__meta">{u.email}</td>
                      <td>
                        <span className="role-badge-sm" style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, padding: '3px 10px', borderRadius: 99 }}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <select
                          className="role-select"
                          value={u.role}
                          onChange={e => changeRole(u.id, e.target.value)}
                        >
                          {['student','coordinator','admin','visitor'].map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Proposals ── */}
      {activeTab === 'proposals' && (
        <div className="glass-card">
          <h2 className="section-heading">Event Proposals</h2>
          <div className="coord-event-list">
            {proposals.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No proposals yet.</p>
            )}
            {proposals.map(p => {
              const cfg = statusCfg[p.status] || statusCfg.pending
              return (
                <div key={p.id} className="coord-event-item">
                  <div className="coord-event-item__top">
                    <div>
                      <p className="coord-event-item__name">{p.event_name}</p>
                      <p className="coord-event-item__date">
                        By {p.coordinator} · {new Date(p.proposed_date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                      </p>
                      {p.description && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{p.description}</p>}
                    </div>
                    <span className="coord-event-item__status" style={{ color: cfg.color, background: cfg.bg }}>
                      {cfg.label}
                    </span>
                  </div>
                  {p.status === 'pending' && (
                    <div className="coord-event-item__actions">
                      <button onClick={() => handleProposal(p.id, 'approved')} className="btn-primary btn--sm" style={{ gap: 6 }}>
                        <CheckCircle2 size={13} /> Approve
                      </button>
                      <button onClick={() => handleProposal(p.id, 'rejected')} className="btn-ghost btn--sm" style={{ gap: 6 }}>
                        <XCircle size={13} /> Reject
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Assign Coordinator Modal ── */}
      {assignModal !== null && (
        <div className="modal-backdrop" onClick={() => setAssignModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 className="modal__title">Assign Coordinator</h3>
            <p className="modal__sub">Enter the Clerk User ID of the student to promote as coordinator for this event. They must have an @iiitvadodara.ac.in email.</p>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Student User ID</label>
              <input
                className="form-input"
                placeholder="Paste Clerk userId here"
                value={assignUserId}
                onChange={e => setAssignUserId(e.target.value)}
              />
            </div>
            {assignMsg && <p style={{ fontSize: 13, marginTop: 8, color: assignMsg.startsWith('✅') ? '#10B981' : '#FF6584' }}>{assignMsg}</p>}
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <button onClick={assignCoordinator} className="btn-primary">Assign</button>
              <button onClick={() => setAssignModal(null)} className="btn-ghost">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

/* ── AdminPage Styles ── */
const _css = `
.admin-stats-6 {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  margin-bottom: 24px;
  animation: fadeUp 0.5s var(--ease) both;
}
.admin-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
.admin-stat-card {
  background: var(--glass-bg); backdrop-filter: blur(16px);
  border: 1px solid var(--border); border-radius: 16px;
  padding: 16px; text-align: center;
}
.admin-stat-card__icon {
  width: 34px; height: 34px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 10px;
}
.admin-stat-card__value {
  font-family: 'Syne', sans-serif; font-weight: 700; font-size: 26px; line-height: 1;
}
.admin-stat-card__label { font-size: 11px; color: var(--text-muted); margin-top: 4px; }
.admin-header-row { display: flex; align-items: center; gap: 12px; margin-bottom: 6px; }
.admin-header-icon {
  width: 36px; height: 36px; border-radius: 10px;
  background: rgba(255,101,132,0.12); border: 1px solid rgba(255,101,132,0.2);
  display: flex; align-items: center; justify-content: center;
}
.tab-bar {
  display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 24px;
  background: var(--glass-bg); border: 1px solid var(--border);
  border-radius: 16px; padding: 6px;
  animation: fadeUp 0.5s 0.1s var(--ease) both;
}
.tab-btn {
  display: flex; align-items: center; gap: 7px;
  padding: 8px 14px; border-radius: 11px;
  font-size: 13px; font-weight: 500; color: var(--text-muted);
  cursor: pointer; transition: all 0.18s;
  font-family: 'DM Sans', sans-serif; border: none; background: none;
}
.tab-btn:hover { color: var(--text); }
.tab-btn--active { background: var(--surface); color: var(--text); font-weight: 600; }
.admin-table-wrap { overflow-x: auto; }
.admin-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.admin-table th {
  text-align: left; padding: 10px 14px;
  font-size: 11px; font-weight: 600; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.06em;
  border-bottom: 1px solid var(--border);
}
.admin-table td { padding: 12px 14px; border-bottom: 1px solid var(--border); }
.admin-table tr:last-child td { border-bottom: none; }
.admin-table__name { font-weight: 600; color: var(--text); }
.admin-table__meta { color: var(--text-muted); }
.role-select {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 8px; padding: 5px 10px;
  font-size: 12px; color: var(--text);
  font-family: 'DM Sans', sans-serif; cursor: pointer; outline: none;
}
.status-pill {
  font-size: 11px; font-weight: 600; text-transform: capitalize;
  padding: 3px 10px; border-radius: 99px;
  background: rgba(108,99,255,0.1); color: #7C74FF;
}
.visitor-toggle-btn {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 99px;
  border: 1px solid var(--border); background: var(--surface);
  color: var(--text-muted); cursor: pointer; transition: all 0.18s;
  font-family: 'DM Sans', sans-serif;
}
.visitor-toggle-btn--on { color: #10B981; border-color: rgba(16,185,129,0.3); background: rgba(16,185,129,0.08); }
.visitor-toggle-label {
  display: flex; align-items: center; gap: 9px;
  font-size: 13px; color: var(--text-muted); cursor: pointer;
}
.visitor-toggle-label input { accent-color: #6C63FF; width: 15px; height: 15px; }
.role-legend { display: flex; flex-direction: column; gap: 10px; }
.role-legend-item {
  display: flex; align-items: center; gap: 14px;
  padding: 12px 16px; border-radius: 12px;
}
.role-badge-sm { font-size: 11px; font-weight: 700; min-width: 80px; text-align: center; }
.role-legend-desc { font-size: 13px; color: var(--text-muted); }

/* Modal */
.modal-backdrop {
  position: fixed; inset: 0; z-index: 999;
  background: rgba(0,0,0,0.55); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; padding: 24px;
}
.modal {
  background: var(--card); border: 1px solid var(--border);
  border-radius: 20px; padding: 28px; max-width: 440px; width: 100%;
  animation: fadeUp 0.3s var(--ease) both;
}
.modal__title {
  font-family: 'Syne', sans-serif; font-weight: 700; font-size: 20px;
  color: var(--text); margin-bottom: 8px;
}
.modal__sub { font-size: 13px; color: var(--text-muted); line-height: 1.55; }
@media (max-width: 900px) {
  .admin-stats-6 { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 600px) {
  .admin-stats-6 { grid-template-columns: repeat(2, 1fr); }
}
`