import { Link } from 'react-router-dom'
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react'

const statusConfig = {
  upcoming:          { label: 'Upcoming',          color: '#10B981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.2)'  },
  ongoing:           { label: 'Ongoing',            color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.2)'  },
  completed:         { label: 'Completed',          color: '#6B6B8A', bg: 'rgba(107,107,138,0.1)', border: 'rgba(107,107,138,0.2)' },
  registration_open: { label: 'Registration Open', color: '#7C74FF', bg: 'rgba(108,99,255,0.1)',  border: 'rgba(108,99,255,0.2)'  },
}

export default function EventCard({ event }) {
  const {
    id = 1,
    event_name: eventName = 'Hackathon 2025',
    description = 'Annual coding competition',
    event_date: eventDate = '2025-03-15',
    location = 'Main Auditorium',
    capacity = 200,
    registered = 120,
    status = 'upcoming',
    club_name: club = 'Tech Club',
    category = 'Technical',
  } = event || {}

  const cfg = statusConfig[status] || statusConfig.upcoming
  const fillPct = Math.round((registered / capacity) * 100)
  const barColor = fillPct > 80
    ? 'linear-gradient(90deg, #FF6584, #FF8C94)'
    : 'linear-gradient(90deg, #6C63FF, #9B94FF)'

  return (
    <div className="event-card">
      <div className="event-card__header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span
            className="event-card__badge"
            style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
          >
            {cfg.label}
          </span>
          <span className="event-card__category">{category}</span>
        </div>
        <h3 className="event-card__title">{eventName}</h3>
        <p className="event-card__club">{club}</p>
      </div>

      <p className="event-card__desc">{description}</p>

      <div className="event-card__meta">
        <div className="event-card__meta-row">
          <Calendar size={13} color="#7C74FF" />
          <span>{new Date(eventDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
        </div>
        <div className="event-card__meta-row">
          <MapPin size={13} color="#7C74FF" />
          <span>{location}</span>
        </div>
        <div className="event-card__meta-row">
          <Users size={13} color="#7C74FF" />
          <span>{registered}/{capacity} registered</span>
        </div>
      </div>

      <div className="event-card__bar-wrap">
        <div className="event-card__bar-track">
          <div className="event-card__bar-fill" style={{ width: `${fillPct}%`, background: barColor }} />
        </div>
        <span className="event-card__bar-label">{fillPct}% full</span>
      </div>

      <Link to={`/events/${id}`} className="event-card__cta">
        View Details <ArrowRight size={14} />
      </Link>
    </div>
  )
}

/* ── EventCard Styles ── */
const _css = `
.event-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 0;
  transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
}
.event-card:hover {
  border-color: rgba(108, 99, 255, 0.3);
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.35);
}
.event-card__header { margin-bottom: 10px; }
.event-card__badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 99px;
  letter-spacing: 0.01em;
}
.event-card__category {
  font-size: 11px;
  color: var(--text-muted);
}
.event-card__title {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 17px;
  color: var(--text);
  line-height: 1.3;
  transition: color 0.2s;
}
.event-card:hover .event-card__title { color: #9B94FF; }
.event-card__club {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 2px;
}
.event-card__desc {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.55;
  margin-bottom: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.event-card__meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
}
.event-card__meta-row {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  color: var(--text-muted);
}
.event-card__bar-wrap {
  margin-bottom: 16px;
}
.event-card__bar-track {
  height: 4px;
  background: var(--border);
  border-radius: 99px;
  overflow: hidden;
  margin-bottom: 4px;
}
.event-card__bar-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 0.5s;
}
.event-card__bar-label {
  font-size: 11px;
  color: var(--text-muted);
}
.event-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #7C74FF;
  text-decoration: none;
  transition: gap 0.2s, color 0.2s;
  margin-top: auto;
}
.event-card__cta:hover { gap: 10px; color: #9B94FF; }
`