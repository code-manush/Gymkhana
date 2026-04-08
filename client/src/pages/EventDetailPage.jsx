import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, MapPin, Users, ArrowLeft, Clock, Trophy, CheckCircle2, Share2, Loader, Eye } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { useApi } from '../lib/api'

const statusConfig = {
  registration_open: { label: 'Registration Open', color: '#7C74FF', bg: 'rgba(108,99,255,0.1)', border: 'rgba(108,99,255,0.2)' },
  upcoming:          { label: 'Upcoming',           color: '#10B981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' },
  ongoing:           { label: 'Ongoing',            color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
  completed:         { label: 'Completed',          color: '#6B6B8A', bg: 'rgba(107,107,138,0.1)',border: 'rgba(107,107,138,0.2)'},
}

export default function EventDetailPage() {
  const { id } = useParams()
  const api = useApi()

  const [event, setEvent]         = useState(null)
  const [myRegs, setMyRegs]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [registering, setRegistering] = useState(false)
  const [regMsg, setRegMsg]       = useState('')
  const [regError, setRegError]   = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [ev, regs] = await Promise.all([
          api.get(`/api/events/${id}`),
          api.get('/api/registrations/my'),
        ])
        setEvent(ev)
        setMyRegs(regs)
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    load()
  }, [id])

  const isRegistered = myRegs.some(r => r.event_id === Number(id) && r.status === 'confirmed')

  async function handleRegister() {
    setRegistering(true)
    setRegMsg('')
    setRegError('')
    try {
      await api.post(`/api/registrations/${id}`)
      setRegMsg('You\'re registered!')
      setMyRegs(prev => [...prev, { event_id: Number(id), status: 'confirmed' }])
      // Refresh event to get updated count
      const ev = await api.get(`/api/events/${id}`)
      setEvent(ev)
    } catch (err) {
      setRegError(err.message)
    }
    setRegistering(false)
  }

  async function handleCancel() {
    if (!window.confirm('Cancel your registration for this event?')) return
    setRegistering(true)
    setRegMsg('')
    setRegError('')
    try {
      await api.delete(`/api/registrations/${id}`)
      setRegMsg('Registration cancelled.')
      setMyRegs(prev => prev.filter(r => r.event_id !== Number(id)))
      const ev = await api.get(`/api/events/${id}`)
      setEvent(ev)
    } catch (err) {
      setRegError(err.message)
    }
    setRegistering(false)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="empty-state" style={{ minHeight: 400 }}>
          <Loader size={28} color="var(--text-muted)" style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'var(--text-muted)', marginTop: 12 }}>Loading event…</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!event) {
    return (
      <DashboardLayout>
        <div className="empty-state" style={{ minHeight: 400 }}>
          <div className="empty-state__emoji">😕</div>
          <h3 className="empty-state__title">Event not found</h3>
          <Link to="/events" className="btn-primary" style={{ marginTop: 16 }}>Back to Events</Link>
        </div>
      </DashboardLayout>
    )
  }

  const fillPct = Math.round(((event.registered || 0) / event.capacity) * 100)
  const cfg = statusConfig[event.status] || statusConfig.upcoming
  const isFull = (event.registered || 0) >= event.capacity
  const isCompleted = event.status === 'completed'
  const canRegister = !isCompleted && !isFull && !isRegistered

  // Parse prizes & schedule if they came as strings
  let prizes = event.prizes
  let schedule = event.schedule
  try { if (typeof prizes === 'string') prizes = JSON.parse(prizes) } catch { prizes = [] }
  try { if (typeof schedule === 'string') schedule = JSON.parse(schedule) } catch { schedule = [] }

  return (
    <DashboardLayout>
      <Link to="/events" className="back-link"><ArrowLeft size={15} /> Back to Events</Link>

      <div className="detail-grid">
        {/* Main */}
        <div className="detail-main">
          <div className="glass-card">
            <div className="detail-badges">
              <span className="detail-status-badge" style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                {cfg.label}
              </span>
              <span className="detail-cat-badge">{event.category}</span>
              {event.visitor_open === 1 && (
                <span className="detail-cat-badge" style={{ color: '#4ECDC4', border: '1px solid rgba(78,205,196,0.3)' }}>
                  <Eye size={10} style={{ display: 'inline', marginRight: 4 }} />Open to Visitors
                </span>
              )}
            </div>
            <h1 className="detail-title">{event.event_name}</h1>
            <p className="detail-desc">{event.description}</p>
            <div className="detail-meta-grid">
              {[
                { icon: Calendar, label: 'Date',      value: new Date(event.event_date).toLocaleDateString('en-IN', { dateStyle: 'long' }) },
                { icon: MapPin,   label: 'Location',  value: event.location || 'TBD' },
                { icon: Users,    label: 'Capacity',  value: `${event.registered || 0} / ${event.capacity} registered` },
                ...(event.team_size ? [{ icon: Clock, label: 'Team Size', value: event.team_size }] : []),
                ...(event.club_name ? [{ icon: Users, label: 'Club',      value: event.club_name }] : []),
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
          {event.long_description && (
            <div className="glass-card">
              <h2 className="section-heading">About this Event</h2>
              <p className="prose-text">{event.long_description}</p>
            </div>
          )}

          {/* Schedule */}
          {Array.isArray(schedule) && schedule.length > 0 && (
            <div className="glass-card">
              <h2 className="section-heading">Schedule</h2>
              <div className="timeline">
                {schedule.map((s, i) => (
                  <div key={i} className="timeline-item">
                    <div className="timeline-item__track">
                      <div className="timeline-item__dot" />
                      {i < schedule.length - 1 && <div className="timeline-item__line" />}
                    </div>
                    <div className="timeline-item__content">
                      <p className="timeline-item__time">{s.time}</p>
                      <p className="timeline-item__label">{s.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prizes */}
          {Array.isArray(prizes) && prizes.length > 0 && (
            <div className="glass-card">
              <h2 className="section-heading">Prizes</h2>
              <div className="prize-list">
                {prizes.map((p, i) => (
                  <div key={i} className="prize-item">
                    <Trophy size={15} color={i === 0 ? '#F5C842' : i === 1 ? '#9CA3AF' : '#92400E'} />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="detail-sidebar">
          <div className="glass-card detail-reg-card">
            <h3 className="section-heading" style={{ fontSize: 17, marginBottom: 16 }}>Registration</h3>
            <div className="reg-bar">
              <div className="reg-bar__labels">
                <span>{event.registered || 0} registered</span>
                <span>{Math.max(0, event.capacity - (event.registered || 0))} spots left</span>
              </div>
              <div className="reg-bar__track">
                <div
                  className="reg-bar__fill"
                  style={{
                    width: `${fillPct}%`,
                    background: fillPct > 80
                      ? 'linear-gradient(90deg,#FF6584,#FF8C94)'
                      : 'linear-gradient(90deg,#6C63FF,#9B94FF)',
                  }}
                />
              </div>
              <p className="reg-bar__pct">{fillPct}% full</p>
            </div>

            {/* Registration state */}
            {isRegistered ? (
              <div className="reg-success">
                <CheckCircle2 size={36} color="#10B981" />
                <p className="reg-success__title">You're registered!</p>
                <p className="reg-success__sub">See you at the event.</p>
                <button
                  onClick={handleCancel}
                  disabled={registering || isCompleted}
                  className="btn-ghost"
                  style={{ marginTop: 14, fontSize: 12, color: '#FF6584' }}
                >
                  {registering ? 'Cancelling…' : 'Cancel Registration'}
                </button>
              </div>
            ) : regMsg ? (
              <p style={{ fontSize: 13, color: '#10B981', textAlign: 'center', padding: '12px 0' }}>{regMsg}</p>
            ) : (
              <button
                onClick={handleRegister}
                disabled={registering || !canRegister}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {registering ? (
                  <><div className="spinner" /> Registering...</>
                ) : isCompleted ? 'Event Completed'
                  : isFull ? 'Event Full'
                  : 'Register Now'}
              </button>
            )}

            {regError && (
              <p style={{ fontSize: 12, color: '#FF6584', marginTop: 10, textAlign: 'center' }}>{regError}</p>
            )}

            <div className="reg-actions">
              <button
                className="btn-ghost"
                style={{ flex: 1, justifyContent: 'center', gap: 6 }}
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
              >
                <Share2 size={13} /> Share
              </button>
            </div>
          </div>

          {event.club_name && (
            <div className="glass-card">
              <p className="eyebrow-label">Organized By</p>
              {event.club_db_id ? (
                <Link to={`/clubs/${event.club_db_id}`} className="organizer-link">{event.club_name}</Link>
              ) : (
                <p className="organizer-link" style={{ textDecoration: 'none', cursor: 'default' }}>{event.club_name}</p>
              )}
              {event.coordinator && (
                <p className="organizer-coord">Coordinator: {event.coordinator}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

/* ── EventDetailPage Styles ── */
const _css = `
.back-link {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 13px; color: var(--text-muted);
  text-decoration: none; margin-bottom: 24px;
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
  font-weight: 800; font-size: 36px;
  color: var(--text); letter-spacing: -0.03em;
  margin-bottom: 10px;
}
.detail-desc {
  font-size: 14px; color: var(--text-muted);
  line-height: 1.6; margin-bottom: 20px;
}
.detail-meta-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
}
.detail-meta-item {
  display: flex; gap: 10px;
  padding: 10px 14px; background: var(--surface); border-radius: 12px;
}
.detail-meta-label { font-size: 11px; color: var(--text-muted); }
.detail-meta-value { font-size: 13px; font-weight: 600; color: var(--text); margin-top: 2px; }
.section-heading {
  font-family: 'Syne', sans-serif; font-weight: 700;
  font-size: 19px; color: var(--text); margin-bottom: 18px;
}
.prose-text {
  font-size: 13.5px; color: var(--text-muted);
  line-height: 1.75; white-space: pre-line;
}
.timeline { display: flex; flex-direction: column; }
.timeline-item { display: flex; gap: 14px; }
.timeline-item__track {
  display: flex; flex-direction: column; align-items: center;
  flex-shrink: 0; width: 10px;
}
.timeline-item__dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #7C74FF; margin-top: 4px; flex-shrink: 0;
}
.timeline-item__line { flex: 1; width: 1px; background: var(--border); margin-top: 4px; min-height: 24px; }
.timeline-item__content { padding-bottom: 20px; }
.timeline-item__time { font-size: 11px; color: var(--text-muted); margin-bottom: 2px; }
.timeline-item__label { font-size: 13.5px; font-weight: 600; color: var(--text); }
.prize-list { display: flex; flex-direction: column; gap: 8px; }
.prize-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px; background: var(--surface);
  border-radius: 12px; font-size: 13.5px; color: var(--text);
}
.detail-sidebar { display: flex; flex-direction: column; gap: 14px; position: sticky; top: 24px; }
.reg-bar { margin-bottom: 16px; }
.reg-bar__labels {
  display: flex; justify-content: space-between;
  font-size: 11px; color: var(--text-muted); margin-bottom: 6px;
}
.reg-bar__track {
  height: 6px; background: var(--border);
  border-radius: 99px; overflow: hidden;
}
.reg-bar__fill { height: 100%; border-radius: 99px; transition: width 0.7s; }
.reg-bar__pct { font-size: 11px; color: var(--text-muted); margin-top: 4px; }
.reg-success { text-align: center; padding: 16px 0; }
.reg-success > svg { margin: 0 auto 10px; display: block; }
.reg-success__title {
  font-family: 'Syne', sans-serif; font-weight: 700;
  color: var(--text); margin-bottom: 4px;
}
.reg-success__sub { font-size: 12px; color: var(--text-muted); }
.reg-actions { display: flex; gap: 8px; margin-top: 10px; }
.spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
.eyebrow-label {
  font-size: 10px; font-weight: 600; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 8px;
}
.organizer-link {
  font-family: 'Syne', sans-serif; font-weight: 700;
  font-size: 16px; color: var(--text);
  text-decoration: none; transition: color 0.18s; display: block;
}
.organizer-link:hover { color: #9B94FF; }
.organizer-coord { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
@media (max-width: 900px) {
  .detail-grid { grid-template-columns: 1fr; }
  .detail-sidebar { position: static; }
}
`