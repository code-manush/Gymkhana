import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Users, Mail, CheckCircle2, Loader } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import EventCard from '../components/EventCard'
import { useApi } from '../lib/api'
import { useUserRole } from '../context/UserContext'

const bannerGradients = {
  Technical: 'linear-gradient(135deg, #6C63FF 0%, #8B5CF6 100%)',
  Cultural: 'linear-gradient(135deg, #FF6584 0%, #E11D48 100%)',
  Sports: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  Literary: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
}

export default function ClubDetailPage() {
  const { id } = useParams()
  const api = useApi()
  const { isVisitor } = useUserRole() || {}

  const [club, setClub] = useState(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [joined, setJoined] = useState(false)
  const [joinMsg, setJoinMsg] = useState('')

  useEffect(() => {
    // Fixed: use /api/clubs/:id (the buildUrl helper handles deduplication)
    api.get(`/api/clubs/${id}`)
      .then(data => setClub(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [id])


  async function handleJoin() {
    if (isVisitor) {
      setJoinMsg('Visitors cannot join clubs. Please contact the coordinator for more info.')
      return
    }

    setJoining(true)
    setJoinMsg('')
    try {
      await api.post(`/api/clubs/${id}/join`)
      setJoined(true)
      setJoinMsg('You joined the club!')
    } catch (err) {
      if (err.message.includes('Already')) {
        setJoined(true)
        setJoinMsg('You are already a member.')
      }
      else if (isVisitor) {
        setJoinMsg('Visitors cannot join clubs. Please contact the coordinator for more info.')
      }
      else {
        setJoinMsg('Failed to join club.')
      }
    }
    setJoining(false)
  }

  const normalizeEvent = (e) => ({
    id: e.id,
    event_name: e.event_name,
    description: e.description,
    event_date: e.event_date,
    location: e.location,
    capacity: e.capacity,
    registered: e.registered || 0,
    status: e.status,
    club_name: club?.club_name,
    category: e.category,
  })

  if (loading) {
    return (
      <DashboardLayout>
        <div className="empty-state" style={{ minHeight: 320 }}>
          <Loader size={28} color="var(--text-muted)" style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'var(--text-muted)', marginTop: 12 }}>Loading club…</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!club) {
    return (
      <DashboardLayout>
        <div className="empty-state" style={{ minHeight: 320 }}>
          <div className="empty-state__emoji">😕</div>
          <h3 className="empty-state__title">Club not found</h3>
          <Link to="/clubs" className="btn-primary" style={{ marginTop: 16 }}>Back to Clubs</Link>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Link to="/clubs" className="back-link"><ArrowLeft size={15} /> Back to Clubs</Link>

      <div
        className="club-banner"
        style={{ background: bannerGradients[club.category] || bannerGradients.Technical }}
      >
        <div className="club-banner__overlay" />
        <span className="club-banner__cat">{club.category}</span>
        <div className="club-banner__info">
          <h1 className="club-banner__name">{club.club_name}</h1>
          {club.founded && <p className="club-banner__est">Est. {club.founded}</p>}
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-main">
          <div className="glass-card">
            <h2 className="section-heading">About</h2>
            <p className="prose-text">{club.long_description || club.description || 'No description available.'}</p>
          </div>

          {club.events && club.events.length > 0 ? (
            <div>
              <h2 className="section-heading">Club Events</h2>
              <div className="cards-grid-2">
                {club.events.map(event => (
                  <EventCard key={event.id} event={normalizeEvent(event)} />
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-card">
              <h2 className="section-heading">Club Events</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No events hosted by this club yet.</p>
            </div>
          )}
        </div>

        <div className="detail-sidebar">
          <div className="glass-card">
            <div className="club-stats-mini">
              <div className="club-stat-mini">
                <p className="club-stat-mini__value">{club.member_count || 0}</p>
                <p className="club-stat-mini__label">Members</p>
              </div>
              <div className="club-stat-mini">
                <p className="club-stat-mini__value">{club.event_count || 0}</p>
                <p className="club-stat-mini__label">Events</p>
              </div>
            </div>

            {joinMsg && (
              <p style={{ fontSize: 12, color: joined ? '#10B981' : '#FF6584', textAlign: 'center', marginTop: 12 }}>
                {joinMsg}
              </p>
            )}

            {isVisitor && !joinMsg && (
              <p style={{ fontSize: 12, color: '#4ECDC4', textAlign: 'center', marginTop: 12 }}>
                Visitors can view clubs but cannot join them.
              </p>
            )}

            {joined ? (
              <div style={{ marginTop: 14 }}>
                <div className="reg-success" style={{ padding: '12px 0 8px' }}>
                  <CheckCircle2 size={28} color="#10B981" />
                  <p className="reg-success__title" style={{ fontSize: 14 }}>You're a member!</p>
                </div>
              </div>
            ) : (
              <button
                onClick={handleJoin}
                disabled={joining || isVisitor}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}
              >
                {isVisitor ? 'Visitors Cannot Join' : joining ? 'Joining…' : 'Join Club'}
              </button>
            )}
          </div>

          {club.coordinator && (
            <div className="glass-card">
              <p className="eyebrow-label">Coordinator</p>
              <div className="coord-card">
                <div className="coord-card__avatar">
                  <Users size={17} color="#7C74FF" />
                </div>
                <div>
                  <p className="coord-card__name">{club.coordinator}</p>
                  {club.coordinator_email && (
                    <p className="coord-card__email">{club.coordinator_email}</p>
                  )}
                </div>
              </div>
              {club.coordinator_email && (
                <a
                  href={`mailto:${club.coordinator_email}`}
                  className="btn-ghost"
                  style={{ width: '100%', justifyContent: 'center', marginTop: 14, gap: 7 }}
                >
                  <Mail size={13} /> Contact
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

/* ── ClubDetailPage Styles ── */
// ... keep your existing CSS here ...

/* ── ClubDetailPage Styles ── */
const _css = `
.club-banner {
  position: relative;
  height: 200px;
  border-radius: 20px;
  display: flex;
  align-items: flex-end;
  padding: 28px 32px;
  margin-bottom: 24px;
  overflow: hidden;
  animation: fadeUp 0.5s var(--ease) both;
}
.club-banner__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.28);
}
.club-banner__cat {
  position: absolute;
  top: 20px; right: 20px;
  font-size: 11px; font-weight: 600;
  color: rgba(255,255,255,0.85);
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  backdrop-filter: blur(10px);
  padding: 4px 12px; border-radius: 99px;
}
.club-banner__info { position: relative; z-index: 1; }
.club-banner__name {
  font-family: 'Syne', sans-serif;
  font-weight: 800; font-size: 40px;
  color: #fff; letter-spacing: -0.02em;
  line-height: 1.1; margin-bottom: 4px;
}
.club-banner__est { font-size: 13px; color: rgba(255,255,255,0.65); }
.cards-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}
.club-stats-mini {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.club-stat-mini {
  background: var(--surface);
  border-radius: 12px;
  padding: 12px;
  text-align: center;
}
.club-stat-mini__value {
  font-family: 'Syne', sans-serif;
  font-weight: 700; font-size: 26px;
  color: #7C74FF;
}
.club-stat-mini__label { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
.coord-card {
  display: flex; align-items: center; gap: 12px; margin-top: 10px;
}
.coord-card__avatar {
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(108,99,255,0.15);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.coord-card__name { font-size: 14px; font-weight: 600; color: var(--text); }
.coord-card__email { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
@media (max-width: 700px) {
  .cards-grid-2 { grid-template-columns: 1fr; }
}
`