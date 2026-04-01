import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal, Eye } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import EventCard from '../components/EventCard'
import { useApi } from '../lib/api'

const categories = ['All', 'Technical', 'Cultural', 'Sports', 'Literary']
const statuses   = ['All', 'registration_open', 'upcoming', 'ongoing', 'completed']
const statusLabels = {
  registration_open: 'Registration Open', upcoming: 'Upcoming',
  ongoing: 'Ongoing', completed: 'Completed', All: 'All',
}

export default function EventsPage() {
  const api = useApi()
  const [allEvents, setAllEvents] = useState([])
  const [dbUser, setDbUser]       = useState(null)
  const [search, setSearch]       = useState('')
  const [category, setCategory]   = useState('All')
  const [status, setStatus]       = useState('All')
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [ev, u] = await Promise.all([
          api.get('/api/events'),
          api.get('/api/users/me'),
        ])
        setAllEvents(ev)
        setDbUser(u)
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    load()
  }, [])

  // Client-side filter on top of server response
  const filtered = allEvents.filter(e => {
    const matchSearch = e.event_name.toLowerCase().includes(search.toLowerCase()) || e.description?.toLowerCase().includes(search.toLowerCase())
    const matchCat    = category === 'All' || e.category === category
    const matchStatus = status   === 'All' || e.status   === status
    return matchSearch && matchCat && matchStatus
  })

  const isVisitor = dbUser?.role === 'visitor'

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-header__title">Events</h1>
        <p className="page-header__sub">
          {isVisitor
            ? 'Showing public events open to visitors.'
            : 'Discover and register for Gymkhana events.'}
        </p>
        {isVisitor && (
          <div className="visitor-events-notice">
            <Eye size={13} />
            <span>Only events open to visitors are displayed for your account.</span>
          </div>
        )}
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
                  <button key={c} onClick={() => setCategory(c)} className={`filter-pill${category === c ? ' filter-pill--active' : ''}`}>{c}</button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <p className="filter-group__label">Status</p>
              <div className="filter-group__pills">
                {statuses.map(s => (
                  <button key={s} onClick={() => setStatus(s)} className={`filter-pill${status === s ? ' filter-pill--active' : ''}`}>{statusLabels[s]}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick category pills */}
      <div className="pill-row">
        {categories.map(c => (
          <button key={c} onClick={() => setCategory(c)} className={`pill${category === c ? ' pill--active' : ''}`}>{c}</button>
        ))}
      </div>

      <p className="results-count">
        Showing <strong>{filtered.length}</strong> event{filtered.length !== 1 ? 's' : ''}
        {isVisitor && <span style={{ color: '#4ECDC4', marginLeft: 8, fontSize: 11 }}>(visitor-open only)</span>}
      </p>

      {loading ? (
        <div className="empty-state"><p style={{ color: 'var(--text-muted)' }}>Loading events…</p></div>
      ) : filtered.length > 0 ? (
        <div className="cards-grid-3">
          {filtered.map(event => (
            <EventCard key={event.id} event={event} showVisitorBadge={event.visitor_open} />
          ))}
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

/* ── EventsPage extra styles ── */
const _css = `
.visitor-events-notice {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 12px; color: #4ECDC4;
  background: rgba(78,205,196,0.1); border: 1px solid rgba(78,205,196,0.2);
  padding: 5px 12px; border-radius: 99px; margin-top: 10px;
}
`