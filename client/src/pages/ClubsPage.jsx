import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import ClubCard from '../components/ClubCard'
import { useApi } from '../lib/api'

const categories = ['All', 'Technical', 'Cultural', 'Sports', 'Literary']

export default function ClubsPage() {
  const api = useApi()
  const [allClubs, setAllClubs]     = useState([])
  const [search, setSearch]         = useState('')
  const [category, setCategory]     = useState('All')
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    api.get('/api/clubs')
      .then(data => setAllClubs(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const filtered = allClubs.filter(c => {
    const matchSearch = c.club_name.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase())
    return matchSearch && (category === 'All' || c.category === category)
  })

  // Mini stats computed from live data
  const miniStats = [
    { label: 'Total Clubs', value: allClubs.length,                                                    color: '#7C74FF' },
    { label: 'Technical',   value: allClubs.filter(c => c.category === 'Technical').length,            color: '#7C74FF' },
    { label: 'Cultural',    value: allClubs.filter(c => c.category === 'Cultural').length,             color: '#FF6584' },
    { label: 'Sports',      value: allClubs.filter(c => c.category === 'Sports').length,               color: '#10B981' },
  ]

  // Normalize API field names to match ClubCard props
  const normalizeClub = (c) => ({
    id:           c.id,
    clubName:     c.club_name,
    description:  c.description,
    category:     c.category,
    memberCount:  c.member_count || 0,
    eventCount:   c.event_count  || 0,
    coordinator:  c.coordinator  || '—',
  })

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-header__title">Clubs</h1>
        <p className="page-header__sub">Explore all Technical, Cultural, Sports and Literary clubs at IIITV.</p>
      </div>

      {/* Search */}
      <div className="search-wrap" style={{ marginBottom: 20 }}>
        <Search size={15} className="search-wrap__icon" />
        <input
          type="text"
          placeholder="Search clubs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Category pills */}
      <div className="pill-row">
        {categories.map(c => (
          <button key={c} onClick={() => setCategory(c)} className={`pill${category === c ? ' pill--active' : ''}`}>{c}</button>
        ))}
      </div>

      {/* Mini stats */}
      {!loading && (
        <div className="clubs-mini-stats">
          {miniStats.map((s, i) => (
            <div key={i} className="clubs-mini-stat">
              <p className="clubs-mini-stat__value" style={{ color: s.color }}>{s.value}</p>
              <p className="clubs-mini-stat__label">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="empty-state">
          <p style={{ color: 'var(--text-muted)' }}>Loading clubs…</p>
        </div>
      ) : (
        <>
          <p className="results-count">Showing <strong>{filtered.length}</strong> clubs</p>

          {filtered.length > 0 ? (
            <div className="cards-grid-3">
              {filtered.map(club => <ClubCard key={club.id} club={normalizeClub(club)} />)}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state__emoji">🔍</div>
              <h3 className="empty-state__title">No clubs found</h3>
              <p className="empty-state__sub">Try a different search term or category.</p>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  )
}

/* ── ClubsPage Styles ── */
const _css = `
.clubs-mini-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
  animation: fadeUp 0.5s 0.1s var(--ease) both;
}
.clubs-mini-stat {
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 12px 14px;
  text-align: center;
}
.clubs-mini-stat__value {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 26px;
  line-height: 1;
}
.clubs-mini-stat__label {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 4px;
}
@media (max-width: 680px) {
  .clubs-mini-stats { grid-template-columns: repeat(2, 1fr); }
}
`