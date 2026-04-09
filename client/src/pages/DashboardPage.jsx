import { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { Calendar, Users, Trophy, Bell, ArrowRight, Clock, CheckCircle2, Star, Eye } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import StatCard from '../components/StatCard'
import EventCard from '../components/EventCard'
import { useApi } from '../lib/api'

const quickActions = [
  { label: 'Browse Events', to: '/events',  color: '#7C74FF', icon: Calendar },
  { label: 'Explore Clubs', to: '/clubs',   color: '#FF6584', icon: Users    },
  { label: 'View Results',  to: '/results', color: '#F5C842', icon: Trophy   },
  { label: 'My Profile',    to: '/profile', color: '#4ECDC4', icon: Star     },
]

const roleDescriptions = {
  admin:       { label: 'Admin',             color: '#FF6584', bg: 'rgba(255,101,132,0.1)', desc: 'You have full platform access.' },
  coordinator: { label: 'Event Coordinator', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  desc: 'Manage your assigned event(s).' },
  student:     { label: 'Student',           color: '#7C74FF', bg: 'rgba(108,99,255,0.1)',  desc: 'Discover and register for events.' },
  visitor:     { label: 'Visitor',           color: '#4ECDC4', bg: 'rgba(78,205,196,0.1)',  desc: 'You can join open visitor events.' },
}

export default function DashboardPage() {
  const { user } = useUser()
  const api = useApi()

  const [dbUser, setDbUser]           = useState(null)
  const [upcomingEvents, setUpcoming] = useState([])
  const [myRegs, setMyRegs]           = useState([])
  const [loading, setLoading]         = useState(true)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  useEffect(() => {
    async function load() {
      try {
        const [u, ev, regs] = await Promise.all([
          api.get('/api/users/me'),
          api.get('/api/events'),
          api.get('/api/registrations/my'),
        ])
        setDbUser(u)
        setUpcoming(ev.slice(0, 3))
        setMyRegs(regs.slice(0, 3))
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    load()
  }, [])

  const role = dbUser?.role || 'student'
  const roleInfo = roleDescriptions[role] || roleDescriptions.student
  const isVisitor = role === 'visitor'

  const statusColor = { confirmed: '#10B981', cancelled: '#FF6584', waitlisted: '#F59E0B' }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="page-header dash-page-header">
        <p className="page-header__greeting">{greeting} 👋</p>
        <h1 className="page-header__title">
          {user?.firstName ? `Hello, ${user.firstName}!` : 'Welcome back!'}
        </h1>
        <p className="page-header__sub">Here's what's happening in Gymkhana today.</p>

        {/* Role badge */}
        {dbUser && (
          <div className="role-badge-row">
            <span className="role-badge-inline" style={{ color: roleInfo.color, background: roleInfo.bg }}>
              {roleInfo.label}
            </span>
            <span className="role-badge-desc">{roleInfo.desc}</span>
            {isVisitor && (
              <span className="visitor-notice">
                <Eye size={11} /> Only visitor-open events are shown to you.
              </span>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard icon={Calendar} label="Upcoming Events" value={upcomingEvents.length.toString()} sub="Events available"   color="#7C74FF" delay={0.05} />
        <StatCard icon={CheckCircle2} label="My Registrations" value={myRegs.length.toString()} sub="Active"           color="#10B981" delay={0.10} />
        <StatCard icon={Trophy}   label="Achievements"    value="0"  sub="This semester"  color="#F5C842" delay={0.15} />
        <StatCard icon={Bell}     label="Notifications"   value="0"  sub="No notifications"       color="#4ECDC4" delay={0.20} />
      </div>

      {/* Mid grid */}
      <div className="dash-mid-grid">
        {/* My Registrations */}
        <div className="glass-card">
          <div className="glass-card__header">
            <h2 className="glass-card__title">My Registrations</h2>
            <Link to="/events" className="glass-card__link">View all</Link>
          </div>
          {loading && <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Loading…</p>}
          {!loading && myRegs.length === 0 && (
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              No registrations yet. <Link to="/events" style={{ color: '#7C74FF' }}>Browse events →</Link>
            </p>
          )}
          <div className="item-list">
            {myRegs.map((r, i) => {
              const sc = statusColor[r.status] || '#6B6B8A'
              return (
                <div key={i} className="item-row">
                  <div className="item-row__dot" style={{ background: sc }} />
                  <div className="item-row__body">
                    <p className="item-row__name">{r.event_name}</p>
                    <p className="item-row__sub">{new Date(r.event_date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
                  </div>
                  <span className="item-row__badge" style={{ color: sc, background: `${sc}15` }}>
                    {r.status}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Role-specific shortcut */}
        <div className="glass-card">
          <h2 className="glass-card__title" style={{ marginBottom: 14 }}>
            {role === 'admin' ? 'Admin Panel' : role === 'coordinator' ? 'Coordinator Panel' : 'Quick Actions'}
          </h2>
          {(role === 'admin' || role === 'coordinator') && (
            <div className="quick-actions" style={{ marginBottom: 12 }}>
              {role === 'admin' && (
                <Link to="/admin" className="quick-action">
                  <div className="quick-action__icon" style={{ background: 'rgba(255,101,132,0.15)' }}>
                    <Star size={15} style={{ color: '#FF6584' }} />
                  </div>
                  <span className="quick-action__label">Admin Dashboard</span>
                  <ArrowRight size={14} className="quick-action__arrow" />
                </Link>
              )}
              {(role === 'admin' || role === 'coordinator') && (
                <Link to="/coordinator" className="quick-action">
                  <div className="quick-action__icon" style={{ background: 'rgba(245,158,11,0.15)' }}>
                    <Calendar size={15} style={{ color: '#F59E0B' }} />
                  </div>
                  <span className="quick-action__label">Coordinator Dashboard</span>
                  <ArrowRight size={14} className="quick-action__arrow" />
                </Link>
              )}
            </div>
          )}
          <div className="quick-actions">
            {quickActions.map((a, i) => (
              <Link key={i} to={a.to} className="quick-action">
                <div className="quick-action__icon" style={{ background: `${a.color}18` }}>
                  <a.icon size={15} style={{ color: a.color }} />
                </div>
                <span className="quick-action__label">{a.label}</span>
                <ArrowRight size={14} className="quick-action__arrow" />
              </Link>
            ))}
          </div>
        </div>

        {/* Visitor notice OR notifications */}
        <div className="glass-card">
          {isVisitor ? (
            <>
              <h2 className="glass-card__title" style={{ marginBottom: 12 }}>Visitor Access</h2>
              <div className="visitor-info-card">
                <Eye size={28} color="#4ECDC4" style={{ marginBottom: 10 }} />
                <p style={{ fontSize: 13.5, color: 'var(--text)', fontWeight: 600, marginBottom: 6 }}>
                  You're signed in as a Visitor
                </p>
                <p style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Visitors can participate in events that are explicitly open to the public.
                  Events marked <strong style={{ color: '#4ECDC4' }}>Open to Visitors</strong> will appear in your events list.
                  College-exclusive events are hidden.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="glass-card__header">
                <h2 className="glass-card__title">Notifications</h2>
                <span className="glass-card__meta">3 new</span>
              </div>
              <div className="item-list">
                {[
                  { text: 'Your registration is confirmed.', time: '2h ago', type: 'success' },
                  { text: 'Culturals Night registration is now open!', time: '5h ago', type: 'info' },
                  { text: 'Result for Badminton published.', time: '1d ago', type: 'result' },
                ].map((n, i) => (
                  <div key={i} className="notif-row">
                    <div className="notif-row__icon">
                      {n.type === 'success' && <CheckCircle2 size={15} color="#10B981" />}
                      {n.type === 'info'    && <Bell         size={15} color="#7C74FF" />}
                      {n.type === 'result'  && <Star         size={15} color="#F5C842" />}
                    </div>
                    <div>
                      <p className="notif-row__text">{n.text}</p>
                      <p className="notif-row__time"><Clock size={10} /> {n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="section">
        <div className="section__header">
          <h2 className="section__title">
            {isVisitor ? 'Open Events' : 'Upcoming Events'}
          </h2>
          <Link to="/events" className="section__link">View all <ArrowRight size={14} /></Link>
        </div>
        {loading && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading events…</p>}
        <div className="cards-grid-3">
          {upcomingEvents.map(event => <EventCard key={event.id} event={event} />)}
        </div>
      </div>
    </DashboardLayout>
  )
}

/* ── DashboardPage extra styles ── */
const _css = `
.role-badge-row {
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 10px;
}
.role-badge-inline {
  font-size: 11px; font-weight: 700;
  padding: 4px 12px; border-radius: 99px;
}
.role-badge-desc { font-size: 12px; color: var(--text-muted); }
.visitor-notice {
  display: flex; align-items: center; gap: 5px;
  font-size: 11px; color: #4ECDC4;
  background: rgba(78,205,196,0.1); border: 1px solid rgba(78,205,196,0.2);
  padding: 3px 10px; border-radius: 99px;
}
.visitor-info-card {
  background: var(--surface); border-radius: 14px; padding: 20px; text-align: center;
}
`