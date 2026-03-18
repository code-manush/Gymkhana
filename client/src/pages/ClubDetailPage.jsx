import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Users, Mail, CheckCircle2, Trophy } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import EventCard from '../components/EventCard'

const clubsData = {
  1: {
    id: 1, clubName: 'Technical Club',
    description: 'Driving innovation through hackathons, workshops, and technical competitions.',
    longDescription: `The Technical Club at IIITV is the hub for all tech enthusiasts on campus. Founded in 2015, we have grown to become the largest club in the institute with over 120 active members.\n\nOur mission is to bridge the gap between classroom learning and real-world application. We organize events ranging from 24-hour hackathons to hands-on workshops in cutting-edge technologies like AI, blockchain, and cloud computing.\n\nMembers get access to exclusive workshops, mentorship from industry professionals, and opportunities to represent IIITV at national-level technical competitions.`,
    category: 'Technical', memberCount: 120, eventCount: 18,
    coordinator: 'Raj Mehta', coordinatorEmail: 'raj.mehta@iiitv.ac.in', founded: 2015,
    achievements: ['Best Technical Club 2024', 'National Hackathon Winners 2023', 'Smart India Hackathon Finalists 2024'],
    events: [
      { id: 1, eventName: 'Hackathon 2025',   description: 'Annual 24-hour coding competition.', eventDate: '2025-04-10', location: 'Main Auditorium', capacity: 200, registered: 145, status: 'registration_open', club: 'Technical Club', category: 'Technical' },
      { id: 7, eventName: 'UI/UX Design Sprint', description: '48-hour design challenge.',       eventDate: '2025-05-10', location: 'Design Lab',       capacity: 40,  registered: 22,  status: 'registration_open', club: 'Technical Club', category: 'Technical' },
      { id: 9, eventName: 'Robotics Workshop', description: 'Hands-on robot programming.',       eventDate: '2025-04-05', location: 'Robotics Lab',     capacity: 30,  registered: 30,  status: 'ongoing',            club: 'Technical Club', category: 'Technical' },
    ],
  },
}

const bannerGradients = {
  Technical: 'linear-gradient(135deg, #6C63FF 0%, #8B5CF6 100%)',
  Cultural:  'linear-gradient(135deg, #FF6584 0%, #E11D48 100%)',
  Sports:    'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  Literary:  'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
}

export default function ClubDetailPage() {
  const { id } = useParams()
  const club = clubsData[id] || clubsData[1]
  const [joined, setJoined] = useState(false)

  return (
    <DashboardLayout>
      <Link to="/clubs" className="back-link"><ArrowLeft size={15} /> Back to Clubs</Link>

      {/* Banner */}
      <div
        className="club-banner"
        style={{ background: bannerGradients[club.category] || bannerGradients.Technical }}
      >
        <div className="club-banner__overlay" />
        <span className="club-banner__cat">{club.category}</span>
        <div className="club-banner__info">
          <h1 className="club-banner__name">{club.clubName}</h1>
          <p className="club-banner__est">Est. {club.founded}</p>
        </div>
      </div>

      <div className="detail-grid">
        {/* Main */}
        <div className="detail-main">
          <div className="glass-card">
            <h2 className="section-heading">About</h2>
            <p className="prose-text">{club.longDescription}</p>
          </div>

          <div className="glass-card">
            <h2 className="section-heading">Achievements</h2>
            <div className="achievement-list">
              {club.achievements.map((a, i) => (
                <div key={i} className="achievement-item">
                  <Trophy size={14} color="#F5C842" style={{ flexShrink: 0 }} />
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="section-heading">Club Events</h2>
            <div className="cards-grid-2">
              {club.events.map(event => <EventCard key={event.id} event={event} />)}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="detail-sidebar">
          <div className="glass-card">
            <div className="club-stats-mini">
              <div className="club-stat-mini">
                <p className="club-stat-mini__value">{club.memberCount}</p>
                <p className="club-stat-mini__label">Members</p>
              </div>
              <div className="club-stat-mini">
                <p className="club-stat-mini__value">{club.eventCount}</p>
                <p className="club-stat-mini__label">Events</p>
              </div>
            </div>

            {joined ? (
              <div className="reg-success">
                <CheckCircle2 size={32} color="#10B981" />
                <p className="reg-success__title" style={{ fontSize: 14 }}>You've joined this club!</p>
              </div>
            ) : (
              <button onClick={() => setJoined(true)} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}>
                Join Club
              </button>
            )}
          </div>

          <div className="glass-card">
            <p className="eyebrow-label">Coordinator</p>
            <div className="coord-card">
              <div className="coord-card__avatar">
                <Users size={17} color="#7C74FF" />
              </div>
              <div>
                <p className="coord-card__name">{club.coordinator}</p>
                <p className="coord-card__email">{club.coordinatorEmail}</p>
              </div>
            </div>
            <a
              href={`mailto:${club.coordinatorEmail}`}
              className="btn-ghost"
              style={{ width: '100%', justifyContent: 'center', marginTop: 14, gap: 7 }}
            >
              <Mail size={13} /> Contact
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

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
  font-size: 11px;
  font-weight: 600;
  color: rgba(255,255,255,0.85);
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  backdrop-filter: blur(10px);
  padding: 4px 12px;
  border-radius: 99px;
}
.club-banner__info { position: relative; z-index: 1; }
.club-banner__name {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 40px;
  color: #fff;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: 4px;
}
.club-banner__est { font-size: 13px; color: rgba(255,255,255,0.65); }
.achievement-list { display: flex; flex-direction: column; gap: 8px; }
.achievement-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: var(--surface);
  border-radius: 12px;
  font-size: 13.5px;
  color: var(--text);
}
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
  font-weight: 700;
  font-size: 26px;
  color: #7C74FF;
}
.club-stat-mini__label { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
.coord-card {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
}
.coord-card__avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: rgba(108,99,255,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.coord-card__name { font-size: 14px; font-weight: 600; color: var(--text); }
.coord-card__email { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
@media (max-width: 700px) {
  .cards-grid-2 { grid-template-columns: 1fr; }
}
`