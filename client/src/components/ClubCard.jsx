import { Link } from 'react-router-dom'
import { Users, Calendar, ArrowRight } from 'lucide-react'

const categoryConfig = {
  Technical: { gradient: 'linear-gradient(135deg, #6C63FF, #8B5CF6)', emoji: '⚡' },
  Cultural:  { gradient: 'linear-gradient(135deg, #FF6584, #E11D48)',  emoji: '🎭' },
  Sports:    { gradient: 'linear-gradient(135deg, #10B981, #059669)',   emoji: '🏆' },
  Literary:  { gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',   emoji: '📚' },
}

export default function ClubCard({ club }) {
  const {
    id = 1,
    clubName = 'Technical Club',
    description = 'A club for tech enthusiasts',
    category = 'Technical',
    memberCount = 85,
    eventCount = 12,
    coordinator = 'John Doe',
  } = club || {}

  const cfg = categoryConfig[category] || categoryConfig.Technical

  return (
    <div className="club-card">
      <div className="club-card__banner" style={{ background: cfg.gradient }}>
        <div className="club-card__banner-overlay" />
        <span className="club-card__emoji">{cfg.emoji}</span>
        <span className="club-card__cat-badge">{category}</span>
      </div>

      <div className="club-card__body">
        <h3 className="club-card__title">{clubName}</h3>
        <p className="club-card__coordinator">Coordinator: {coordinator}</p>
        <p className="club-card__desc">{description}</p>

        <div className="club-card__stats">
          <div className="club-card__stat">
            <Users size={13} color="#7C74FF" />
            {memberCount} members
          </div>
          <div className="club-card__stat">
            <Calendar size={13} color="#7C74FF" />
            {eventCount} events
          </div>
        </div>

        <Link to={`/clubs/${id}`} className="club-card__cta">
          Explore Club <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}

/* ── ClubCard Styles ── */
const _css = `
.club-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  border-radius: 20px;
  overflow: hidden;
  transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
}
.club-card:hover {
  border-color: rgba(108,99,255,0.3);
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.35);
}
.club-card__banner {
  position: relative;
  height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.club-card__banner-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.18);
}
.club-card__emoji {
  font-size: 38px;
  position: relative;
  z-index: 1;
}
.club-card__cat-badge {
  position: absolute;
  top: 10px; right: 10px;
  font-size: 10px;
  font-weight: 600;
  color: rgba(255,255,255,0.85);
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  padding: 3px 9px;
  border-radius: 99px;
  z-index: 1;
}
.club-card__body {
  padding: 18px 20px 20px;
}
.club-card__title {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 17px;
  color: var(--text);
  margin-bottom: 4px;
  transition: color 0.2s;
}
.club-card:hover .club-card__title { color: #9B94FF; }
.club-card__coordinator {
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 10px;
}
.club-card__desc {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.55;
  margin-bottom: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.club-card__stats {
  display: flex;
  gap: 18px;
  margin-bottom: 16px;
}
.club-card__stat {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--text-muted);
}
.club-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #7C74FF;
  text-decoration: none;
  transition: gap 0.2s;
}
.club-card__cta:hover { gap: 10px; }
`