import { useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import EventCard from '../components/EventCard'

const allEvents = [
  { id: 1, eventName: 'Hackathon 2025',       description: 'Annual 24-hour coding competition for innovative problem-solvers.', eventDate: '2025-04-10', location: 'Main Auditorium', capacity: 200, registered: 145, status: 'registration_open', club: 'Technical Club',  category: 'Technical' },
  { id: 2, eventName: 'Culturals Night',       description: 'An evening of art, music, dance and theatre performances.',         eventDate: '2025-04-18', location: 'Open Air Theatre', capacity: 500, registered: 310, status: 'upcoming',           club: 'Cultural Club',  category: 'Cultural'  },
  { id: 3, eventName: 'Inter-College Cricket', description: 'Inter-college cricket tournament with 8 competing teams.',          eventDate: '2025-04-25', location: 'Sports Ground',    capacity: 80,  registered: 72,  status: 'upcoming',           club: 'Sports Club',    category: 'Sports'    },
  { id: 4, eventName: 'Photography Contest',   description: 'Express your vision through the lens. All themes welcome.',         eventDate: '2025-03-28', location: 'Art Gallery',       capacity: 60,  registered: 45,  status: 'ongoing',            club: 'Fine Arts Club', category: 'Cultural'  },
  { id: 5, eventName: 'Debate Championship',   description: 'Battle of words — inter-department debate competition.',            eventDate: '2025-05-02', location: 'Seminar Hall',      capacity: 100, registered: 38,  status: 'registration_open', club: 'Literary Club',  category: 'Literary'  },
  { id: 6, eventName: 'Badminton Tournament',  description: 'Singles and doubles championship open to all students.',            eventDate: '2025-03-15', location: 'Indoor Stadium',    capacity: 64,  registered: 64,  status: 'completed',          club: 'Sports Club',    category: 'Sports'    },
  { id: 7, eventName: 'UI/UX Design Sprint',   description: '48-hour design challenge to solve real user problems.',             eventDate: '2025-05-10', location: 'Design Lab',        capacity: 40,  registered: 22,  status: 'registration_open', club: 'Technical Club', category: 'Technical' },
  { id: 8, eventName: 'Folk Music Night',      description: 'A celebration of regional folk music and cultural heritage.',       eventDate: '2025-05-20', location: 'Amphitheatre',      capacity: 300, registered: 120, status: 'upcoming',           club: 'Cultural Club',  category: 'Cultural'  },
  { id: 9, eventName: 'Robotics Workshop',     description: 'Hands-on workshop on building and programming robots.',             eventDate: '2025-04-05', location: 'Robotics Lab',      capacity: 30,  registered: 30,  status: 'ongoing',            club: 'Technical Club', category: 'Technical' },
]

const categories = ['All', 'Technical', 'Cultural', 'Sports', 'Literary']
const statuses = ['All', 'registration_open', 'upcoming', 'ongoing', 'completed']
const statusLabels = { registration_open: 'Registration Open', upcoming: 'Upcoming', ongoing: 'Ongoing', completed: 'Completed', All: 'All' }

export default function EventsPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState('All')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = allEvents.filter(e => {
    const matchSearch = e.eventName.toLowerCase().includes(search.toLowerCase()) || e.description.toLowerCase().includes(search.toLowerCase())
    const matchCat    = category === 'All' || e.category === category
    const matchStatus = status   === 'All' || e.status   === status
    return matchSearch && matchCat && matchStatus
  })

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-header__title">Events</h1>
        <p className="page-header__sub">Discover and register for Gymkhana events.</p>
      </div>

      {/* Search + filter bar */}
      <div className="filter-bar">
        <div className="filter-bar__row">
          <div className="search-wrap">
            <Search size={15} className="search-wrap__icon" />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-ghost${showFilters ? ' btn--active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', flexShrink: 0 }}
          >
            <SlidersHorizontal size={15} /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="filter-bar__expanded">
            <div className="filter-group">
              <p className="filter-group__label">Category</p>
              <div className="filter-group__pills">
                {categories.map(c => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`filter-pill${category === c ? ' filter-pill--active' : ''}`}
                  >{c}</button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <p className="filter-group__label">Status</p>
              <div className="filter-group__pills">
                {statuses.map(s => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`filter-pill${status === s ? ' filter-pill--active' : ''}`}
                  >{statusLabels[s]}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick category pills */}
      <div className="pill-row">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`pill${category === c ? ' pill--active' : ''}`}
          >{c}</button>
        ))}
      </div>

      <p className="results-count">
        Showing <strong>{filtered.length}</strong> events
      </p>

      {filtered.length > 0 ? (
        <div className="cards-grid-3">
          {filtered.map(event => <EventCard key={event.id} event={event} />)}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state__emoji">🔍</div>
          <h3 className="empty-state__title">No events found</h3>
          <p className="empty-state__sub">Try adjusting your filters or search term.</p>
        </div>
      )}
    </DashboardLayout>
  )
}

/* ── EventsPage Styles ── */
const _css = `
.filter-bar {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 16px;
  margin-bottom: 20px;
  animation: fadeUp 0.5s 0.05s var(--ease) both;
}
.filter-bar__row {
  display: flex;
  gap: 12px;
  align-items: center;
}
.search-wrap {
  position: relative;
  flex: 1;
}
.search-wrap__icon {
  position: absolute;
  left: 12px; top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}
.search-input {
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 9px 14px 9px 36px;
  font-size: 13.5px;
  color: var(--text);
  outline: none;
  transition: border-color 0.18s, box-shadow 0.18s;
  font-family: 'DM Sans', sans-serif;
}
.search-input::placeholder { color: var(--text-muted); }
.search-input:focus {
  border-color: rgba(108,99,255,0.5);
  box-shadow: 0 0 0 3px rgba(108,99,255,0.08);
}
.filter-bar__expanded {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
  padding-top: 16px;
  margin-top: 16px;
  border-top: 1px solid var(--border);
}
.filter-group__label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
}
.filter-group__pills { display: flex; flex-wrap: wrap; gap: 6px; }
.filter-pill {
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  background: var(--surface);
  color: var(--text-muted);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.18s;
  font-family: 'DM Sans', sans-serif;
}
.filter-pill:hover { color: var(--text); border-color: var(--border-mid); }
.filter-pill--active { background: #6C63FF; color: #fff; border-color: #6C63FF; }
.pill-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  animation: fadeUp 0.5s 0.1s var(--ease) both;
}
.pill {
  padding: 6px 16px;
  border-radius: 99px;
  font-size: 13px;
  font-weight: 500;
  background: var(--glass-bg);
  border: 1px solid var(--border);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.18s;
  font-family: 'DM Sans', sans-serif;
  backdrop-filter: blur(12px);
}
.pill:hover { color: var(--text); border-color: var(--border-mid); }
.pill--active { background: #6C63FF; color: #fff; border-color: #6C63FF; }
.results-count {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 20px;
}
.results-count strong { color: var(--text); }
.empty-state {
  text-align: center;
  padding: 80px 0;
}
.empty-state__emoji { font-size: 52px; margin-bottom: 16px; }
.empty-state__title {
  font-family: 'Syne', sans-serif;
  font-weight: 600;
  font-size: 22px;
  color: var(--text);
  margin-bottom: 8px;
}
.empty-state__sub { font-size: 14px; color: var(--text-muted); }
`