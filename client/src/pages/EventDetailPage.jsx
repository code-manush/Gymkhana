import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, MapPin, Users, ArrowLeft, Clock, Trophy, CheckCircle2, Share2, BookmarkPlus } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'

const eventsData = {
  1: {
    id: 1, eventName: 'Hackathon 2025',
    description: 'Annual 24-hour coding competition. Build innovative solutions for real-world problems. Form teams of 2–4 members and compete for exciting prizes.',
    longDescription: `Gymkhana Hackathon 2025 is our flagship technical event where students get to showcase their coding skills and creativity.\n\nOver 24 hours, teams of 2–4 will work on problem statements released at the start of the event. Mentors from industry will be available to guide you throughout.\n\nPast participants have gone on to build startups, win national competitions, and secure internships from their Hackathon projects. This is YOUR chance to build something that matters.\n\nPrizes worth ₹50,000 await the top 3 teams!`,
    eventDate: '2025-04-10', endDate: '2025-04-11',
    location: 'Main Auditorium, Block A',
    capacity: 200, registered: 145,
    status: 'registration_open', club: 'Technical Club', clubId: 1,
    category: 'Technical', coordinator: 'Raj Mehta', teamSize: '2–4 members',
    prizes: ['₹20,000 — 1st Place', '₹15,000 — 2nd Place', '₹10,000 — 3rd Place'],
    schedule: [
      { time: '09:00 AM', event: 'Registration & Check-in' },
      { time: '10:00 AM', event: 'Problem Statement Release' },
      { time: '10:30 AM', event: 'Hacking Begins!' },
      { time: '10:30 AM (D+1)', event: 'Submission Deadline' },
      { time: '12:00 PM (D+1)', event: 'Final Presentations' },
      { time: '03:00 PM (D+1)', event: 'Results & Prize Distribution' },
    ],
  },
}

const statusConfig = {
  registration_open: { label: 'Registration Open', color: '#7C74FF', bg: 'rgba(108,99,255,0.1)', border: 'rgba(108,99,255,0.2)' },
  upcoming:          { label: 'Upcoming',           color: '#10B981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' },
  ongoing:           { label: 'Ongoing',            color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
  completed:         { label: 'Completed',          color: '#6B6B8A', bg: 'rgba(107,107,138,0.1)',border: 'rgba(107,107,138,0.2)'},
}

export default function EventDetailPage() {
  const { id } = useParams()
  const event = eventsData[id] || eventsData[1]
  const [registered, setRegistered] = useState(false)
  const [loading, setLoading] = useState(false)
  const fillPct = Math.round((event.registered / event.capacity) * 100)
  const cfg = statusConfig[event.status] || statusConfig.upcoming

  const handleRegister = () => {
    setLoading(true)
    setTimeout(() => { setRegistered(true); setLoading(false) }, 1200)
  }

  return (
    <DashboardLayout>
      <Link to="/events" className="back-link"><ArrowLeft size={15} /> Back to Events</Link>

      <div className="detail-grid">
        {/* Main */}
        <div className="detail-main">
          {/* Header card */}
          <div className="glass-card">
            <div className="detail-badges">
              <span className="detail-status-badge" style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>{cfg.label}</span>
              <span className="detail-cat-badge">{event.category}</span>
            </div>
            <h1 className="detail-title">{event.eventName}</h1>
            <p className="detail-desc">{event.description}</p>
            <div className="detail-meta-grid">
              {[
                { icon: Calendar, label: 'Date',      value: new Date(event.eventDate).toLocaleDateString('en-IN', { dateStyle: 'long' }) },
                { icon: MapPin,   label: 'Location',  value: event.location },
                { icon: Users,    label: 'Capacity',  value: `${event.registered}/${event.capacity} registered` },
                { icon: Clock,    label: 'Team Size', value: event.teamSize },
              ].map((m, i) => (
                <div key={i} className="detail-meta-item">
                  <m.icon size={15} color="#7C74FF" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <p className="detail-meta-label">{m.label}</p>
                    <p className="detail-meta-value">{m.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* About */}
          <div className="glass-card">
            <h2 className="section-heading">About this Event</h2>
            <p className="prose-text">{event.longDescription}</p>
          </div>

          {/* Schedule */}
          <div className="glass-card">
            <h2 className="section-heading">Schedule</h2>
            <div className="timeline">
              {event.schedule.map((s, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-item__track">
                    <div className="timeline-item__dot" />
                    {i < event.schedule.length - 1 && <div className="timeline-item__line" />}
                  </div>
                  <div className="timeline-item__content">
                    <p className="timeline-item__time">{s.time}</p>
                    <p className="timeline-item__label">{s.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prizes */}
          <div className="glass-card">
            <h2 className="section-heading">Prizes</h2>
            <div className="prize-list">
              {event.prizes.map((p, i) => (
                <div key={i} className="prize-item">
                  <Trophy size={15} color={i === 0 ? '#F5C842' : i === 1 ? '#9CA3AF' : '#92400E'} />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="detail-sidebar">
          <div className="glass-card detail-reg-card">
            <h3 className="section-heading" style={{ fontSize: 17, marginBottom: 16 }}>Registration</h3>
            <div className="reg-bar">
              <div className="reg-bar__labels">
                <span>{event.registered} registered</span>
                <span>{event.capacity - event.registered} spots left</span>
              </div>
              <div className="reg-bar__track">
                <div
                  className="reg-bar__fill"
                  style={{
                    width: `${fillPct}%`,
                    background: fillPct > 80 ? 'linear-gradient(90deg,#FF6584,#FF8C94)' : 'linear-gradient(90deg,#6C63FF,#9B94FF)',
                  }}
                />
              </div>
              <p className="reg-bar__pct">{fillPct}% full</p>
            </div>

            {registered ? (
              <div className="reg-success">
                <CheckCircle2 size={36} color="#10B981" />
                <p className="reg-success__title">You're registered!</p>
                <p className="reg-success__sub">Check your notifications for confirmation.</p>
              </div>
            ) : (
              <button
                onClick={handleRegister}
                disabled={loading || event.status === 'completed'}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {loading ? (
                  <><div className="spinner" /> Registering...</>
                ) : event.status === 'completed' ? 'Event Completed' : 'Register Now'}
              </button>
            )}

            <div className="reg-actions">
              <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center', gap: 6 }}>
                <Share2 size={13} /> Share
              </button>
              <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center', gap: 6 }}>
                <BookmarkPlus size={13} /> Save
              </button>
            </div>
          </div>

          <div className="glass-card">
            <p className="eyebrow-label">Organized By</p>
            <Link to={`/clubs/${event.clubId}`} className="organizer-link">{event.club}</Link>
            <p className="organizer-coord">Coordinator: {event.coordinator}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

/* ── EventDetailPage Styles ── */
const _css = `
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-muted);
  text-decoration: none;
  margin-bottom: 24px;
  transition: color 0.18s;
}
.back-link:hover { color: var(--text); }
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 20px;
  align-items: start;
}
.detail-main { display: flex; flex-direction: column; gap: 16px; }
.detail-badges { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
.detail-status-badge {
  font-size: 11px; font-weight: 600;
  padding: 4px 11px; border-radius: 99px;
}
.detail-cat-badge {
  font-size: 11px; color: var(--text-muted);
  border: 1px solid var(--border);
  padding: 4px 11px; border-radius: 99px;
}
.detail-title {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 36px;
  color: var(--text);
  letter-spacing: -0.03em;
  margin-bottom: 10px;
}
.detail-desc {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 20px;
}
.detail-meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.detail-meta-item {
  display: flex;
  gap: 10px;
  padding: 10px 14px;
  background: var(--surface);
  border-radius: 12px;
}
.detail-meta-label { font-size: 11px; color: var(--text-muted); }
.detail-meta-value { font-size: 13px; font-weight: 600; color: var(--text); margin-top: 2px; }
.section-heading {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 19px;
  color: var(--text);
  margin-bottom: 18px;
}
.prose-text {
  font-size: 13.5px;
  color: var(--text-muted);
  line-height: 1.75;
  white-space: pre-line;
}
.timeline { display: flex; flex-direction: column; }
.timeline-item { display: flex; gap: 14px; }
.timeline-item__track {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 10px;
}
.timeline-item__dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #7C74FF;
  margin-top: 4px;
  flex-shrink: 0;
}
.timeline-item__line { flex: 1; width: 1px; background: var(--border); margin-top: 4px; min-height: 24px; }
.timeline-item__content { padding-bottom: 20px; }
.timeline-item__time { font-size: 11px; color: var(--text-muted); margin-bottom: 2px; }
.timeline-item__label { font-size: 13.5px; font-weight: 600; color: var(--text); }
.prize-list { display: flex; flex-direction: column; gap: 8px; }
.prize-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px;
  background: var(--surface);
  border-radius: 12px;
  font-size: 13.5px;
  color: var(--text);
}
.detail-sidebar { display: flex; flex-direction: column; gap: 14px; position: sticky; top: 24px; }
.detail-reg-card { }
.reg-bar { margin-bottom: 16px; }
.reg-bar__labels {
  display: flex; justify-content: space-between;
  font-size: 11px; color: var(--text-muted);
  margin-bottom: 6px;
}
.reg-bar__track {
  height: 6px;
  background: var(--border);
  border-radius: 99px;
  overflow: hidden;
}
.reg-bar__fill { height: 100%; border-radius: 99px; transition: width 0.7s; }
.reg-bar__pct { font-size: 11px; color: var(--text-muted); margin-top: 4px; }
.reg-success {
  text-align: center;
  padding: 16px 0;
}
.reg-success > svg { margin: 0 auto 10px; display: block; }
.reg-success__title {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 4px;
}
.reg-success__sub { font-size: 12px; color: var(--text-muted); }
.reg-actions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}
.spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
.eyebrow-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 8px;
}
.organizer-link {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: var(--text);
  text-decoration: none;
  transition: color 0.18s;
}
.organizer-link:hover { color: #9B94FF; }
.organizer-coord { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
@media (max-width: 900px) {
  .detail-grid { grid-template-columns: 1fr; }
  .detail-sidebar { position: static; }
}
`