import { useState, useEffect } from 'react'
import {
  Users, Calendar, Clock, CheckCircle2, XCircle,
  Shield, UserPlus, Eye, EyeOff, BarChart3, Edit3, Trash2, Search,
} from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { useApi } from '../lib/api'

const tabs = [
  { id: 'overview',  label: 'Overview',      icon: BarChart3 },
  { id: 'events',    label: 'Manage Events', icon: Calendar  },
  { id: 'users',     label: 'Users',         icon: Users     },
  { id: 'proposals', label: 'Proposals',     icon: Clock     },
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
  const [activeTab, setActiveTab]   = useState('overview')
  const [stats, setStats]           = useState(null)
  const [users, setUsers]           = useState([])
  const [events, setEvents]         = useState([])
  const [proposals, setProposals]   = useState([])
  const [loading, setLoading]       = useState(false)

  // Coordinator assignment modal
  const [assignModal, setAssignModal]   = useState(null) // event object or null
  const [assignSearch, setAssignSearch] = useState('')
  const [assignUserId, setAssignUserId] = useState('')
  const [assignMsg, setAssignMsg]       = useState('')

  // Create event form
  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState({
    event_name: '', description: '', event_date: '', location: '',
    capacity: '', category: 'Technical', status: 'upcoming', visitor_open: false,
  })
  const [createMsg, setCreateMsg] = useState('')

  // User search
  const [userSearch, setUserSearch] = useState('')

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

  async function changeRole(userId, newRole) {
    try {
      await api.patch(`/api/admin/users/${userId}/role`, { role: newRole })
      setUsers(u => u.map(x => x.id === userId ? { ...x, role: newRole } : x))
    } catch (err) {
      alert(err.message)
    }
  }

  async function toggleVisitorAccess(eventId, current) {
    try {
      await api.patch(`/api/admin/events/${eventId}/visitor-access`, { visitor_open: !current })
      setEvents(ev => ev.map(e => e.id === eventId ? { ...e, visitor_open: !current } : e))
    } catch (err) {
      alert(err.message)
    }
  }

  async function assignCoordinator() {
    if (!assignUserId) return setAssignMsg('❌ Please select a user.')
    try {
      await api.post(`/api/admin/events/${assignModal.id}/coordinator`, { userId: assignUserId })
      setAssignMsg('✅ Coordinator assigned successfully!')
      setAssignUserId('')
      setAssignSearch('')
      await fetchAll()
      setTimeout(() => { setAssignModal(null); setAssignMsg('') }, 1800)
    } catch (err) {
      setAssignMsg(`❌ ${err.message}`)
    }
  }

  async function removeCoordinator(eventId, userId) {
    if (!window.confirm('Remove this coordinator from the event?')) return
    try {
      await api.delete(`/api/admin/events/${eventId}/coordinator/${userId}`)
      await fetchAll()
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleProposal(id, status) {
    try {
      await api.patch(`/api/admin/proposals/${id}`, { status })
      setProposals(p => p.map(x => x.id === id ? { ...x, status } : x))
    } catch (err) {
      alert(err.message)
    }
  }

  async function deleteEvent(eventId) {
    if (!window.confirm('Delete this event permanently?')) return
    try {
      await api.delete(`/api/events/${eventId}`)
      setEvents(ev => ev.filter(e => e.id !== eventId))
    } catch (err) {
      alert(err.message)
    }
  }

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

  // Users eligible to be coordinators (college email only)
  const eligibleUsers = users.filter(u =>
    u.email.endsWith('@iiitvadodara.ac.in') &&
    (assignSearch === '' ||
      `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(assignSearch.toLowerCase()))
  )

  const filteredUsers = users.filter(u =>
    userSearch === '' ||
    `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(userSearch.toLowerCase())
  )

  const adminStats = stats ? [
    { label: 'Total Users',   value: stats.users,   color: '#7C74FF', icon: Users    },
    { label: 'Students',      value: stats.students, color: '#8880FF', icon: Users    },
    { label: 'Visitors',      value: stats.visitors, color: '#4ECDC4', icon: Eye      },
    { label: 'Active Events', value: stats.events,   color: '#10B981', icon: Calendar },
    { label: 'Pending',       value: stats.pending,  color: '#F59E0B', icon: Clock    },
    { label: 'Active Clubs',  value: stats.clubs,    color: '#FF6584', icon: Shield   },
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
          <h2 className="section-heading">Role Permissions</h2>
          <div className="role-legend">
            {[
              { role: 'admin',       desc: 'Full access. Manage users, events, clubs, proposals, and results.' },
              { role: 'coordinator', desc: 'Manages their assigned event only. Can propose new events for review.' },
              { role: 'student',     desc: 'Browse and register for events. Must have an @iiitvadodara.ac.in email.' },
              { role: 'visitor',     desc: 'External users. Can only register for visitor-open events.' },
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

          <div style={{ marginTop: 28 }}>
            <h2 className="section-heading">How to Assign a Coordinator</h2>
            <div className="how-to-steps">
              <div className="how-to-step"><span className="how-to-step__num">1</span><p>Go to <strong>Manage Events</strong> tab and find the event.</p></div>
              <div className="how-to-step"><span className="how-to-step__num">2</span><p>Click <strong>Assign Coordinator</strong> — a panel will appear.</p></div>
              <div className="how-to-step"><span className="how-to-step__num">3</span><p>Search and select a student with an <strong>@iiitvadodara.ac.in</strong> email.</p></div>
              <div className="how-to-step"><span className="how-to-step__num">4</span><p>Their role is automatically promoted to <strong>coordinator</strong>.</p></div>
            </div>
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

          {showCreate && (
            <form onSubmit={createEvent} className="propose-form" style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Event Name *</label>
                  <input className="form-input" required placeholder="e.g. Hackathon 2026" value={createForm.event_name} onChange={ev => setCreateForm({ ...createForm, event_name: ev.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <input className="form-input" type="datetime-local" required value={createForm.event_date} onChange={ev => setCreateForm({ ...createForm, event_date: ev.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input className="form-input" placeholder="Main Auditorium" value={createForm.location} onChange={ev => setCreateForm({ ...createForm, location: ev.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Capacity *</label>
                  <input className="form-input" type="number" required placeholder="100" value={createForm.capacity} onChange={ev => setCreateForm({ ...createForm, capacity: ev.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-input" value={createForm.category} onChange={ev => setCreateForm({ ...createForm, category: ev.target.value })}>
                    {['Technical', 'Cultural', 'Sports', 'Literary'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-input" value={createForm.status} onChange={ev => setCreateForm({ ...createForm, status: ev.target.value })}>
                    {['upcoming', 'registration_open', 'ongoing', 'completed'].map(s => <option key={s}>{s}</option>)}
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
              {createMsg && <p style={{ fontSize: 13, color: createMsg.startsWith('✅') ? '#10B981' : '#FF6584', marginTop: 8 }}>{createMsg}</p>}
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button type="submit" className="btn-primary">Create Event</button>
                <button type="button" className="btn-ghost" onClick={() => setShowCreate(false)}>Cancel</button>
              </div>
            </form>
          )}

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Visitors</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map(ev => (
                  <tr key={ev.id}>
                    <td className="admin-table__name">{ev.event_name}</td>
                    <td className="admin-table__meta">{new Date(ev.event_date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</td>
                    <td className="admin-table__meta">{ev.category}</td>
                    <td>
                      <span className="status-pill">{ev.status?.replace(/_/g, ' ')}</span>
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
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <button
                          onClick={() => { setAssignModal(ev); setAssignMsg(''); setAssignSearch(''); setAssignUserId('') }}
                          className="btn-ghost btn--sm"
                          style={{ gap: 5 }}
                        >
                          <UserPlus size={12} /> Assign
                        </button>
                        <button
                          onClick={() => deleteEvent(ev.id)}
                          className="btn-ghost btn--sm"
                          style={{ gap: 5, color: '#FF6584' }}
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 24 }}>No events yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Users ── */}
      {activeTab === 'users' && (
        <div className="glass-card">
          <div className="glass-card__header">
            <h2 className="section-heading">All Users ({users.length})</h2>
          </div>

          {/* Search */}
          <div className="search-wrap" style={{ marginBottom: 16 }}>
            <Search size={14} className="search-wrap__icon" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={userSearch}
              onChange={e => setUserSearch(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Current Role</th><th>Change Role</th><th>Joined</th></tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => {
                  const cfg = roleColors[u.role] || roleColors.student
                  return (
                    <tr key={u.id}>
                      <td className="admin-table__name">{u.first_name} {u.last_name}</td>
                      <td className="admin-table__meta">{u.email}</td>
                      <td>
                        <span style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, display: 'inline-block' }}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <select
                          className="role-select"
                          value={u.role}
                          onChange={e => changeRole(u.id, e.target.value)}
                        >
                          {['student', 'coordinator', 'admin', 'visitor'].map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </td>
                      <td className="admin-table__meta">
                        {new Date(u.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                      </td>
                    </tr>
                  )
                })}
                {filteredUsers.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 24 }}>No users found.</td></tr>
                )}
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
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No proposals submitted yet.</p>
            )}
            {proposals.map(p => {
              const cfg = statusCfg[p.status] || statusCfg.pending
              return (
                <div key={p.id} className="coord-event-item">
                  <div className="coord-event-item__top">
                    <div>
                      <p className="coord-event-item__name">{p.event_name}</p>
                      <p className="coord-event-item__date">
                        Proposed by <strong>{p.coordinator || 'Unknown'}</strong>
                        {' · '}
                        {p.coordinator_email && <span style={{ color: 'var(--text-muted)' }}>{p.coordinator_email}</span>}
                      </p>
                      <p className="coord-event-item__date" style={{ marginTop: 2 }}>
                        Date: {new Date(p.proposed_date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                        {p.location && ` · ${p.location}`}
                        {p.capacity && ` · ${p.capacity} seats`}
                      </p>
                      {p.description && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.5 }}>{p.description}</p>}
                    </div>
                    <span className="coord-event-item__status" style={{ color: cfg.color, background: cfg.bg, flexShrink: 0 }}>
                      {cfg.label}
                    </span>
                  </div>
                  {p.status === 'pending' && (
                    <div className="coord-event-item__actions" style={{ marginTop: 12 }}>
                      <button onClick={() => handleProposal(p.id, 'approved')} className="btn-primary btn--sm" style={{ gap: 6 }}>
                        <CheckCircle2 size={13} /> Approve
                      </button>
                      <button onClick={() => handleProposal(p.id, 'rejected')} className="btn-ghost btn--sm" style={{ gap: 6, color: '#FF6584' }}>
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
          <div className="modal modal--wide" onClick={e => e.stopPropagation()}>
            <h3 className="modal__title">Assign Coordinator</h3>
            <p className="modal__sub">
              Assigning for: <strong style={{ color: '#7C74FF' }}>{assignModal.event_name}</strong>
            </p>
            <p className="modal__sub" style={{ marginTop: 4 }}>
              Only users with <strong>@iiitvadodara.ac.in</strong> emails are listed below. Selecting a student will promote them to coordinator.
            </p>

            {/* Search */}
            <div className="search-wrap" style={{ marginTop: 16, marginBottom: 12 }}>
              <Search size={14} className="search-wrap__icon" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={assignSearch}
                onChange={e => { setAssignSearch(e.target.value); setAssignUserId('') }}
                className="search-input"
              />
            </div>

            {/* User list */}
            <div className="assign-user-list">
              {eligibleUsers.length === 0 && (
                <p style={{ fontSize: 12, color: 'var(--text-muted)', padding: '12px 0', textAlign: 'center' }}>
                  No @iiitvadodara.ac.in users found.
                </p>
              )}
              {eligibleUsers.slice(0, 8).map(u => (
                <label
                  key={u.id}
                  className={`assign-user-row${assignUserId === u.id ? ' assign-user-row--selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="assignUser"
                    value={u.id}
                    checked={assignUserId === u.id}
                    onChange={() => setAssignUserId(u.id)}
                    style={{ display: 'none' }}
                  />
                  <div className="assign-user-row__avatar">
                    {u.first_name?.[0]}{u.last_name?.[0]}
                  </div>
                  <div className="assign-user-row__info">
                    <p className="assign-user-row__name">{u.first_name} {u.last_name}</p>
                    <p className="assign-user-row__email">{u.email}</p>
                  </div>
                  <span
                    className="assign-user-row__role"
                    style={{
                      color: roleColors[u.role]?.color,
                      background: roleColors[u.role]?.bg,
                    }}
                  >
                    {u.role}
                  </span>
                </label>
              ))}
              {eligibleUsers.length > 8 && (
                <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', paddingTop: 8 }}>
                  Showing 8 of {eligibleUsers.length}. Type to filter.
                </p>
              )}
            </div>

            {assignMsg && (
              <p style={{ fontSize: 13, marginTop: 12, color: assignMsg.startsWith('✅') ? '#10B981' : '#FF6584' }}>
                {assignMsg}
              </p>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <button
                onClick={assignCoordinator}
                className="btn-primary"
                disabled={!assignUserId}
                style={{ opacity: assignUserId ? 1 : 0.5 }}
              >
                Assign Coordinator
              </button>
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
.admin-table td { padding: 12px 14px; border-bottom: 1px solid var(--border); vertical-align: middle; }
.admin-table tr:last-child td { border-bottom: none; }
.admin-table tr:hover td { background: rgba(255,255,255,0.02); }
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
  font-size: 13px; color: var(--text-muted); cursor: pointer; margin-bottom: 8px;
}
.visitor-toggle-label input { accent-color: #6C63FF; width: 15px; height: 15px; }
.role-legend { display: flex; flex-direction: column; gap: 10px; }
.role-legend-item {
  display: flex; align-items: center; gap: 14px;
  padding: 12px 16px; border-radius: 12px;
}
.role-badge-sm { font-size: 11px; font-weight: 700; min-width: 80px; text-align: center; }
.role-legend-desc { font-size: 13px; color: var(--text-muted); }
.how-to-steps { display: flex; flex-direction: column; gap: 10px; margin-top: 12px; }
.how-to-step {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 10px 14px; background: var(--surface); border-radius: 12px;
  font-size: 13px; color: var(--text-muted);
}
.how-to-step__num {
  width: 22px; height: 22px; border-radius: 50%;
  background: rgba(108,99,255,0.15); color: #7C74FF;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; flex-shrink: 0;
}
/* Modal */
.modal-backdrop {
  position: fixed; inset: 0; z-index: 999;
  background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; padding: 24px;
}
.modal {
  background: var(--card); border: 1px solid var(--border);
  border-radius: 20px; padding: 28px; max-width: 440px; width: 100%;
  animation: fadeUp 0.3s var(--ease) both;
  max-height: 80vh; overflow-y: auto;
}
.modal--wide { max-width: 540px; }
.modal__title {
  font-family: 'Syne', sans-serif; font-weight: 700; font-size: 20px;
  color: var(--text); margin-bottom: 8px;
}
.modal__sub { font-size: 13px; color: var(--text-muted); line-height: 1.55; }
/* Assign user list */
.assign-user-list {
  display: flex; flex-direction: column; gap: 6px;
  max-height: 280px; overflow-y: auto;
}
.assign-user-row {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 14px; border-radius: 12px;
  border: 1px solid var(--border); cursor: pointer;
  transition: border-color 0.18s, background 0.18s;
  background: var(--surface);
}
.assign-user-row:hover { border-color: rgba(108,99,255,0.3); background: rgba(108,99,255,0.04); }
.assign-user-row--selected { border-color: #7C74FF; background: rgba(108,99,255,0.1); }
.assign-user-row__avatar {
  width: 34px; height: 34px; border-radius: 50%;
  background: rgba(108,99,255,0.15); color: #7C74FF;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700; flex-shrink: 0;
}
.assign-user-row__info { flex: 1; min-width: 0; }
.assign-user-row__name { font-size: 13px; font-weight: 600; color: var(--text); }
.assign-user-row__email { font-size: 11px; color: var(--text-muted); margin-top: 1px; }
.assign-user-row__role {
  font-size: 10px; font-weight: 700;
  padding: 3px 9px; border-radius: 99px;
  flex-shrink: 0;
}
/* Coordinator event items */
.coord-event-list { display: flex; flex-direction: column; gap: 12px; }
.coord-event-item {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 14px; padding: 16px 18px;
  transition: border-color 0.2s;
}
.coord-event-item:hover { border-color: rgba(108,99,255,0.2); }
.coord-event-item__top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.coord-event-item__name { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 3px; }
.coord-event-item__date { font-size: 12px; color: var(--text-muted); }
.coord-event-item__status {
  font-size: 11px; font-weight: 600;
  padding: 4px 11px; border-radius: 99px; flex-shrink: 0;
}
.coord-event-item__actions { display: flex; gap: 8px; margin-top: 12px; }
@media (max-width: 900px) {
  .admin-stats-6 { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 600px) {
  .admin-stats-6 { grid-template-columns: repeat(2, 1fr); }
}
`