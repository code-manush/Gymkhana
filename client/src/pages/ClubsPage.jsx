import { useState } from 'react'
import { Search } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import ClubCard from '../components/ClubCard'

const allClubs = [
  { id: 1, clubName: 'Technical Club',        description: 'Driving innovation through hackathons, workshops, and technical competitions. Building the engineers of tomorrow.', category: 'Technical', memberCount: 120, eventCount: 18, coordinator: 'Raj Mehta'    },
  { id: 2, clubName: 'Cultural Club',         description: 'Celebrating art, music, dance, and theatre. A creative space for all forms of cultural expression.',              category: 'Cultural',  memberCount: 95,  eventCount: 14, coordinator: 'Priya Sharma'  },
  { id: 3, clubName: 'Sports Club',           description: 'Fostering athletic excellence through inter-college tournaments, fitness events, and sports training.',            category: 'Sports',    memberCount: 110, eventCount: 22, coordinator: 'Arjun Singh'   },
  { id: 4, clubName: 'Literary Club',         description: 'A haven for writers, readers, and debaters. Hosting quizzes, debates, and creative writing competitions.',        category: 'Literary',  memberCount: 65,  eventCount: 10, coordinator: 'Sneha Patel'   },
  { id: 5, clubName: 'Fine Arts Club',        description: 'Exploring visual arts through photography, painting, sculpture, and digital design workshops.',                    category: 'Cultural',  memberCount: 48,  eventCount: 8,  coordinator: 'Meera Joshi'   },
  { id: 6, clubName: 'Robotics Club',         description: 'Building intelligent machines. From line-followers to autonomous bots — innovation at its core.',                 category: 'Technical', memberCount: 55,  eventCount: 9,  coordinator: 'Kiran Rao'     },
  { id: 7, clubName: 'Music Society',         description: 'From classical to contemporary, a space for musicians to collaborate, perform, and grow together.',               category: 'Cultural',  memberCount: 72,  eventCount: 11, coordinator: 'Aarav Shah'    },
  { id: 8, clubName: 'Entrepreneurship Cell', description: 'Fostering startup culture through talks, incubation, and business plan competitions.',                            category: 'Technical', memberCount: 88,  eventCount: 13, coordinator: 'Divya Nair'    },
]

const categories = ['All', 'Technical', 'Cultural', 'Sports', 'Literary']

const miniStats = [
  { label: 'Total Clubs', value: allClubs.length,                                              color: '#7C74FF' },
  { label: 'Technical',   value: allClubs.filter(c => c.category === 'Technical').length,     color: '#7C74FF' },
  { label: 'Cultural',    value: allClubs.filter(c => c.category === 'Cultural').length,      color: '#FF6584' },
  { label: 'Sports',      value: allClubs.filter(c => c.category === 'Sports').length,        color: '#10B981' },
]

export default function ClubsPage() {
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState('All')

  const filtered = allClubs.filter(c => {
    const matchSearch = c.clubName.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase())
    return matchSearch && (category === 'All' || c.category === category)
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
      <div className="clubs-mini-stats">
        {miniStats.map((s, i) => (
          <div key={i} className="clubs-mini-stat">
            <p className="clubs-mini-stat__value" style={{ color: s.color }}>{s.value}</p>
            <p className="clubs-mini-stat__label">{s.label}</p>
          </div>
        ))}
      </div>

      <p className="results-count">Showing <strong>{filtered.length}</strong> clubs</p>

      {filtered.length > 0 ? (
        <div className="cards-grid-3">
          {filtered.map(club => <ClubCard key={club.id} club={club} />)}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state__emoji">🔍</div>
          <h3 className="empty-state__title">No clubs found</h3>
          <p className="empty-state__sub">Try a different search term or category.</p>
        </div>
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