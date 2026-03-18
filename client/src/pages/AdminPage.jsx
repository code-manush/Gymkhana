import { useState } from 'react'
import { Users, Calendar, Shield, CheckCircle2, XCircle, Clock, Archive, Settings, AlertCircle } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'

const pendingEvents = [
  { id: 1, name: 'Photography Contest',  club: 'Fine Arts Club',  date: '2025-04-28', coordinator: 'Meera Joshi', status: 'pending' },
  { id: 2, name: 'E-Sports Tournament',  club: 'Technical Club',  date: '2025-05-05', coordinator: 'Raj Mehta',   status: 'pending' },
  { id: 3, name: 'Classical Music Night',club: 'Music Society',   date: '2025-05-12', coordinator: 'Aarav Shah',  status: 'pending' },
]
const recentUsers = [
  { name: 'Anmol Kumar Jha', email: 'anmol@iiitv.ac.in',  role: 'Student',     joined: '2 days ago'  },
  { name: 'Bhawesh Rao',     email: 'bhawesh@iiitv.ac.in', role: 'Student',     joined: '3 days ago'  },
  { name: 'Harsh Gohel',     email: 'harsh@iiitv.ac.in',   role: 'Coordinator', joined: '5 days ago'  },
  { name: 'Manush Patel',    email: 'manush@iiitv.ac.in',  role: 'Student',     joined: '1 week ago'  },
]
const adminStats = [
  { label: 'Total Users',        value: '487', icon: Users,    color: '#7C74FF' },
  { label: 'Active Events',      value: '12',  icon: Calendar, color: '#10B981' },
  { label: 'Pending Approvals',  value: '3',   icon: Clock,    color: '#F59E0B' },
  { label: 'Clubs',              value: '8',   icon: Shield,   color: '#FF6584' },
]

const tabs = [
  { id: 'approvals', label: 'Event Approvals',  icon: CheckCircle2 },
  { id: 'users',     label: 'User Management',  icon: Users         },
  { id: 'clubs',     label: 'Club Management',  icon: Shield        },
  { id: 'archive',   label: 'Archive',           icon: Archive       },
]

export default function AdminPage() {
  const [events, setEvents] = useState(pendingEvents)
  const [activeTab, setActiveTab] = useState('approvals')

  const handleApprove = (id) => setEvents(prev => prev.map(e => e.id === id ? { ...e, status: 'approved' } : e))
  const handleReject  = (id) => setEvents(prev => prev.map(e => e.id === id ? { ...e, status: 'rejected' } : e))

  return (
    <DashboardLayout>
      <div className="page-header">
        <div className="admin-header-row">
          <div className="admin-header-icon">
            <Shield size={17} color="#7C74FF" />
          </div>
          <h1 className="page-header__title">Admin Panel</h1>
        </div>
        <p className="page-header__sub">System-level management for Gymkhana IIITV.</p>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        {adminStats.map((s, i) => (
          <div key={i} className="admin-stat-card">
            <div className="admin-stat-card__icon" style={{ background: `${s.color}18`, border: `1px solid ${s.color}25` }}>
              <s.icon size={16} style={{ color: s.color }} />
            </div>
            <p className="admin-stat-card__value" style={{ color: s.color }}>{s.value}</p>
            <p className="admin-stat-card__label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tab bar */}
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

      {/* ── Approvals ── */}
      {activeTab === 'approvals' && (
        <div className="glass-card">
          <h2 className="section-heading">Pending Event Proposals</h2>
          {events.filter(e => e.status === 'pending').length === 0 && (
            <div className="empty-state" style={{ padding: '32px 0' }}>
              <CheckCircle2 size={40} color="#10B981" style={{ margin: '0 auto 10px', display: 'block' }} />
              <p style={{ color: 'var(--text)', fontWeight: 600 }}>All caught up!</p>
              <p className="empty-state__sub">No pending approvals.</p>
            </div>
          )}
          <div className="approval-list">
            {events.map(e => (
              <div
                key={e.id}
                className={`approval-item${e.status === 'approved' ? ' approval-item--approved' : e.status === 'rejected' ? ' approval-item--rejected' : ''}`}
              >
                <div className="approval-item__body">
                  <div className="approval-item__title-row">
                    <p className="approval-item__name">{e.name}</p>
                    {e.status !== 'pending' && (
                      <span className={`approval-item__status-badge approval-item__status-badge--${e.status}`}>
                        {e.status.charAt(0).toUpperCase() + e.status.slice(1)}
                      </span>
                    )}
                  </div>
                  <p className="approval-item__meta">{e.club} · Coordinator: {e.coordinator}</p>
                  <p className="approval-item__date">Proposed: {new Date(e.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
                </div>
                {e.status === 'pending' && (
                  <div className="approval-item__actions">
                    <button onClick={() => handleApprove(e.id)} className="btn-success"><CheckCircle2 size={13} /> Approve</button>
                    <button onClick={() => handleReject(e.id)}  className="btn-danger"><XCircle  size={13} /> Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Users ── */}
      {activeTab === 'users' && (
        <div className="glass-card">
          <h2 className="section-heading">Recent Users</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  {['Name','Email','Role','Joined','Actions'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u, i) => (
                  <tr key={i}>
                    <td>
                      <div className="user-cell">
                        <div className="user-cell__avatar">{u.name[0]}</div>
                        <span>{u.name}</span>
                      </div>
                    </td>
                    <td className="muted-cell">{u.email}</td>
                    <td>
                      <span className={`role-badge${u.role === 'Coordinator' ? ' role-badge--coord' : ''}`}>{u.role}</span>
                    </td>
                    <td className="muted-cell">{u.joined}</td>
                    <td><button className="table-action">Edit Role</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Clubs ── */}
      {activeTab === 'clubs' && (
        <div className="glass-card">
          <h2 className="section-heading">Club Management</h2>
          <div className="mgmt-list">
            {[
              { name: 'Technical Club', coordinator: 'Raj Mehta',   members: 120 },
              { name: 'Cultural Club',  coordinator: 'Priya Sharma', members: 95  },
              { name: 'Sports Club',    coordinator: 'Arjun Singh',  members: 110 },
              { name: 'Literary Club',  coordinator: 'Sneha Patel',  members: 65  },
            ].map((c, i) => (
              <div key={i} className="mgmt-item">
                <div>
                  <p className="mgmt-item__name">{c.name}</p>
                  <p className="mgmt-item__meta">Coordinator: {c.coordinator} · {c.members} members</p>
                </div>
                <div className="mgmt-item__right">
                  <span className="status-dot-badge">Active</span>
                  <button className="btn-icon"><Settings size={14} /></button>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-primary" style={{ marginTop: 20 }}>+ Create New Club</button>
        </div>
      )}

      {/* ── Archive ── */}
      {activeTab === 'archive' && (
        <div className="glass-card">
          <h2 className="section-heading">Academic Year Archive</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Archive past academic year data to maintain performance.</p>
          <div className="mgmt-list" style={{ marginBottom: 20 }}>
            {['2023–24','2022–23','2021–22'].map((y, i) => (
              <div key={i} className="mgmt-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Archive size={15} color="var(--text-muted)" />
                  <div>
                    <p className="mgmt-item__name">Academic Year {y}</p>
                    <p className="mgmt-item__meta">Archived</p>
                  </div>
                </div>
                <button className="table-action">View Archive</button>
              </div>
            ))}
          </div>
          <div className="alert-warn">
            <AlertCircle size={15} color="#F59E0B" style={{ flexShrink: 0, marginTop: 1 }} />
            <p>Archiving the current year (2024–25) will move all event, registration, and result data to read-only storage. This action cannot be undone.</p>
          </div>
          <button className="btn-ghost" style={{ marginTop: 14, color: '#F59E0B', borderColor: 'rgba(245,158,11,0.3)' }}>
            Archive Current Year (2024–25)
          </button>
        </div>
      )}
    </DashboardLayout>
  )
}

/* ── AdminPage Styles ── */
const _css = `
.admin-header-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}
.admin-header-icon {
  width: 36px; height: 36px;
  border-radius: 10px;
  background: rgba(108,99,255,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}
.admin-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 28px;
  animation: fadeUp 0.5s 0.05s var(--ease) both;
}
.admin-stat-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 20px;
}
.admin-stat-card__icon {
  width: 36px; height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
}
.admin-stat-card__value {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 32px;
  line-height: 1;
}
.admin-stat-card__label { font-size: 12px; color: var(--text-muted); margin-top: 6px; }
.tab-bar {
  display: flex;
  gap: 4px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 5px;
  width: fit-content;
  margin-bottom: 24px;
  animation: fadeUp 0.5s 0.1s var(--ease) both;
}
.tab-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.18s;
  font-family: 'DM Sans', sans-serif;
}
.tab-btn:hover { color: var(--text); }
.tab-btn--active { background: #6C63FF; color: #fff; }
.approval-list { display: flex; flex-direction: column; gap: 12px; }
.approval-item {
  padding: 18px 20px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: var(--surface);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  transition: border-color 0.2s;
}
.approval-item--approved { border-color: rgba(16,185,129,0.3); background: rgba(16,185,129,0.04); }
.approval-item--rejected { border-color: rgba(255,101,132,0.3); background: rgba(255,101,132,0.04); }
.approval-item__title-row { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.approval-item__name { font-size: 14px; font-weight: 600; color: var(--text); }
.approval-item__status-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 99px;
}
.approval-item__status-badge--approved { color: #10B981; background: rgba(16,185,129,0.12); }
.approval-item__status-badge--rejected { color: #FF6584; background: rgba(255,101,132,0.12); }
.approval-item__meta  { font-size: 12px; color: var(--text-muted); }
.approval-item__date  { font-size: 11px; color: var(--text-muted); margin-top: 3px; }
.approval-item__actions { display: flex; gap: 8px; flex-shrink: 0; }
.admin-table-wrap { overflow-x: auto; }
.admin-table { width: 100%; border-collapse: collapse; }
.admin-table th {
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
  padding-right: 16px;
}
.admin-table td {
  padding: 14px 16px 14px 0;
  border-bottom: 1px solid var(--border);
  font-size: 13px;
}
.admin-table tr:last-child td { border-bottom: none; }
.admin-table tr:hover td { background: rgba(255,255,255,0.01); }
.user-cell { display: flex; align-items: center; gap: 10px; }
.user-cell__avatar {
  width: 32px; height: 32px;
  border-radius: 9px;
  background: rgba(108,99,255,0.15);
  color: #7C74FF;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.muted-cell { color: var(--text-muted) !important; }
.role-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 99px;
  background: var(--surface-2);
  color: var(--text-muted);
}
.role-badge--coord { color: #7C74FF; background: rgba(108,99,255,0.12); }
.table-action {
  font-size: 12px;
  color: #7C74FF;
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
}
.table-action:hover { text-decoration: underline; }
.mgmt-list { display: flex; flex-direction: column; gap: 8px; }
.mgmt-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: var(--surface);
  border-radius: 12px;
}
.mgmt-item__name { font-size: 14px; font-weight: 600; color: var(--text); }
.mgmt-item__meta { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
.mgmt-item__right { display: flex; align-items: center; gap: 10px; }
.status-dot-badge {
  font-size: 11px;
  font-weight: 600;
  color: #10B981;
  background: rgba(16,185,129,0.1);
  padding: 3px 9px;
  border-radius: 99px;
}
.alert-warn {
  display: flex;
  gap: 10px;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid rgba(245,158,11,0.2);
  background: rgba(245,158,11,0.05);
  font-size: 12px;
  color: rgba(245,158,11,0.85);
  line-height: 1.55;
}
@media (max-width: 900px) {
  .admin-stats { grid-template-columns: repeat(2, 1fr); }
}
`