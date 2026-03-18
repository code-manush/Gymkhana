import { useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { Calendar, Users, Trophy, Bell, ArrowRight, Clock, CheckCircle2, Star } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import StatCard from '../components/StatCard'
import EventCard from '../components/EventCard'

const upcomingEvents = [
  { id: 1, eventName: 'Hackathon 2025', description: 'Annual 24-hour coding competition. Build innovative solutions for real-world problems.', eventDate: '2025-04-10', location: 'Main Auditorium', capacity: 200, registered: 145, status: 'registration_open', club: 'Technical Club', category: 'Technical' },
  { id: 2, eventName: 'Culturals Night', description: 'An evening celebrating art, music, dance and theatre performances.', eventDate: '2025-04-18', location: 'Open Air Theatre', capacity: 500, registered: 310, status: 'upcoming', club: 'Cultural Club', category: 'Cultural' },
  { id: 3, eventName: 'Inter-College Cricket', description: 'Inter-college cricket tournament with teams from 8 colleges.', eventDate: '2025-04-25', location: 'Sports Ground', capacity: 80, registered: 72, status: 'upcoming', club: 'Sports Club', category: 'Sports' },
]

const notifications = [
  { id: 1, text: 'Your registration for Hackathon 2025 is confirmed.', time: '2h ago', type: 'success' },
  { id: 2, text: 'Culturals Night registration is now open!',          time: '5h ago', type: 'info' },
  { id: 3, text: 'Result for Badminton Tournament published.',          time: '1d ago', type: 'result' },
]

const myRegistrations = [
  { event: 'Hackathon 2025',      status: 'Confirmed', date: 'Apr 10', color: '#10B981' },
  { event: 'Photography Contest', status: 'Pending',   date: 'Mar 28', color: '#F59E0B' },
  { event: 'Quiz Championship',   status: 'Completed', date: 'Mar 15', color: '#6B6B8A' },
]

const quickActions = [
  { label: 'Browse Events',  to: '/events',  color: '#7C74FF', icon: Calendar },
  { label: 'Explore Clubs',  to: '/clubs',   color: '#FF6584', icon: Users },
  { label: 'View Results',   to: '/results', color: '#F5C842', icon: Trophy },
  { label: 'My Profile',     to: '/profile', color: '#4ECDC4', icon: Star },
]

export default function DashboardPage() {
  const { user } = useUser()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="page-header dash-page-header">
        <p className="page-header__greeting">{greeting} 👋</p>
        <h1 className="page-header__title">
          {user?.firstName ? `Hello, ${user.firstName}!` : 'Welcome back!'}
        </h1>
        <p className="page-header__sub">Here's what's happening in Gymkhana today.</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard icon={Calendar} label="Upcoming Events" value="8"  sub="Next: Apr 10"   color="#7C74FF" delay={0.05} />
        <StatCard icon={Users}    label="My Clubs"        value="3"  sub="Active member"  color="#FF6584" delay={0.10} />
        <StatCard icon={Trophy}   label="Achievements"    value="5"  sub="This semester"  color="#F5C842" delay={0.15} />
        <StatCard icon={Bell}     label="Notifications"   value="3"  sub="2 unread"       color="#4ECDC4" delay={0.20} />
      </div>

      {/* Mid grid */}
      <div className="dash-mid-grid">
        {/* My Registrations */}
        <div className="glass-card">
          <div className="glass-card__header">
            <h2 className="glass-card__title">My Registrations</h2>
            <Link to="/events" className="glass-card__link">View all</Link>
          </div>
          <div className="item-list">
            {myRegistrations.map((r, i) => (
              <div key={i} className="item-row">
                <div className="item-row__dot" style={{ background: r.color }} />
                <div className="item-row__body">
                  <p className="item-row__name">{r.event}</p>
                  <p className="item-row__sub">{r.date}</p>
                </div>
                <span className="item-row__badge" style={{ color: r.color, background: `${r.color}15` }}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-card">
          <div className="glass-card__header">
            <h2 className="glass-card__title">Notifications</h2>
            <span className="glass-card__meta">3 new</span>
          </div>
          <div className="item-list">
            {notifications.map((n) => (
              <div key={n.id} className="notif-row">
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
        </div>

        {/* Quick Actions */}
        <div className="glass-card">
          <h2 className="glass-card__title" style={{ marginBottom: 16 }}>Quick Actions</h2>
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
      </div>

      {/* Upcoming Events */}
      <div className="section">
        <div className="section__header">
          <h2 className="section__title">Upcoming Events</h2>
          <Link to="/events" className="section__link">View all <ArrowRight size={14} /></Link>
        </div>
        <div className="cards-grid-3">
          {upcomingEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

/* ── DashboardPage Styles ── */
const _css = `
.page-header { margin-bottom: 36px; animation: fadeUp 0.5s var(--ease) both; }
.page-header__greeting { font-size: 13px; color: var(--text-muted); margin-bottom: 6px; }
.page-header__title {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 32px;
  color: var(--text);
  letter-spacing: -0.02em;
  line-height: 1.15;
}
.page-header__sub { font-size: 14px; color: var(--text-muted); margin-top: 6px; }
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}
.dash-mid-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 36px;
}
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 24px;
  animation: fadeUp 0.5s var(--ease) both;
}
.glass-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}
.glass-card__title {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: var(--text);
}
.glass-card__link {
  font-size: 12px;
  color: #7C74FF;
  text-decoration: none;
}
.glass-card__link:hover { text-decoration: underline; }
.glass-card__meta { font-size: 12px; color: var(--text-muted); }
.item-list { display: flex; flex-direction: column; gap: 8px; }
.item-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: var(--surface);
  border-radius: 12px;
}
.item-row__dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}
.item-row__body { flex: 1; min-width: 0; }
.item-row__name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item-row__sub { font-size: 11px; color: var(--text-muted); }
.item-row__badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 99px;
  white-space: nowrap;
}
.notif-row {
  display: flex;
  gap: 10px;
  padding: 10px 12px;
  background: var(--surface);
  border-radius: 12px;
}
.notif-row__icon { flex-shrink: 0; margin-top: 2px; }
.notif-row__text { font-size: 13px; color: var(--text); line-height: 1.4; }
.notif-row__time {
  font-size: 11px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}
.quick-actions { display: flex; flex-direction: column; gap: 8px; }
.quick-action {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: var(--surface);
  border-radius: 12px;
  text-decoration: none;
  transition: background 0.18s;
}
.quick-action:hover { background: var(--card); }
.quick-action__icon {
  width: 32px; height: 32px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.quick-action__label { font-size: 13px; color: var(--text); flex: 1; }
.quick-action__arrow { color: var(--text-muted); transition: color 0.2s, transform 0.2s; }
.quick-action:hover .quick-action__arrow { color: #7C74FF; transform: translateX(2px); }
.section { }
.section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.section__title {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 22px;
  color: var(--text);
  letter-spacing: -0.01em;
}
.section__link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #7C74FF;
  text-decoration: none;
}
.section__link:hover { text-decoration: underline; }
.cards-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}
@media (max-width: 1100px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .dash-mid-grid { grid-template-columns: 1fr; }
  .cards-grid-3 { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 680px) {
  .cards-grid-3 { grid-template-columns: 1fr; }
}
`