import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useUser, UserButton } from '@clerk/clerk-react'
import {
  LayoutDashboard, Calendar, Users, Trophy, User,
  Settings, ShieldCheck, Zap,
} from 'lucide-react'
import { useApi } from '../lib/api'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/events',    icon: Calendar,         label: 'Events'    },
  { to: '/clubs',     icon: Users,            label: 'Clubs'     },
  { to: '/results',   icon: Trophy,           label: 'Results'   },
  { to: '/profile',   icon: User,             label: 'Profile'   },
]

export default function Sidebar() {
  const location = useLocation()
  const { user } = useUser()
  const api = useApi()
  const [dbRole, setDbRole] = useState(null)

  const isActive = (path) => location.pathname === path

  useEffect(() => {
    api.get('/api/users/me')
      .then(u => setDbRole(u.role))
      .catch(() => setDbRole('student'))
  }, [])

  const isAdmin       = dbRole === 'admin'
  const isCoordinator = dbRole === 'coordinator' || dbRole === 'admin'

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar__logo">
        <Link to="/dashboard" className="sidebar__logo-link">
          <div className="sidebar__logo-icon">
            <Zap size={18} color="#fff" />
          </div>
          <div>
            <p className="sidebar__logo-name">Gymkhana</p>
            <p className="sidebar__logo-sub">IIITV</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="sidebar__nav">
        <p className="sidebar__section-label">Main</p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`sidebar__link${isActive(to) ? ' sidebar__link--active' : ''}`}
          >
            <Icon size={17} />
            {label}
          </Link>
        ))}

        {/* Management section — only for coordinators and admins */}
        {isCoordinator && (
          <>
            <p className="sidebar__section-label" style={{ marginTop: 28 }}>Management</p>

            {isAdmin && (
              <Link
                to="/admin"
                className={`sidebar__link sidebar__link--admin${isActive('/admin') ? ' sidebar__link--active' : ''}`}
              >
                <ShieldCheck size={17} />
                Admin Panel
              </Link>
            )}

            <Link
              to="/coordinator"
              className={`sidebar__link sidebar__link--coord${isActive('/coordinator') ? ' sidebar__link--active' : ''}`}
            >
              <Settings size={17} />
              Coordinator
            </Link>
          </>
        )}
      </nav>

      {/* Role badge */}
      {dbRole && (
        <div className="sidebar__role-badge">
          <span
            className="sidebar__role-pill"
            style={{
              color: dbRole === 'admin' ? '#FF6584' : dbRole === 'coordinator' ? '#F59E0B' : dbRole === 'visitor' ? '#4ECDC4' : '#7C74FF',
              background: dbRole === 'admin' ? 'rgba(255,101,132,0.12)' : dbRole === 'coordinator' ? 'rgba(245,158,11,0.12)' : dbRole === 'visitor' ? 'rgba(78,205,196,0.12)' : 'rgba(108,99,255,0.12)',
              border: `1px solid ${dbRole === 'admin' ? 'rgba(255,101,132,0.25)' : dbRole === 'coordinator' ? 'rgba(245,158,11,0.25)' : dbRole === 'visitor' ? 'rgba(78,205,196,0.25)' : 'rgba(108,99,255,0.25)'}`,
            }}
          >
            {dbRole}
          </span>
        </div>
      )}

      {/* User footer */}
      <div className="sidebar__user">
        <UserButton afterSignOutUrl="/" />
        <div className="sidebar__user-info">
          <p className="sidebar__user-name">{user?.firstName} {user?.lastName}</p>
          <p className="sidebar__user-email">{user?.primaryEmailAddress?.emailAddress}</p>
        </div>
      </div>
    </aside>
  )
}

/* ── Sidebar Styles ── */
const _css = `
.sidebar {
  position: fixed;
  left: 0; top: 0;
  height: 100%;
  width: 260px;
  background: rgba(10, 10, 18, 0.92);
  backdrop-filter: blur(24px);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  z-index: 40;
}
.sidebar__logo {
  padding: 24px 20px;
  border-bottom: 1px solid var(--border);
}
.sidebar__logo-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}
.sidebar__logo-icon {
  width: 36px; height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #6C63FF, #FF6584);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.sidebar__logo-name {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: var(--text);
  line-height: 1;
}
.sidebar__logo-sub {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 2px;
}
.sidebar__nav {
  flex: 1;
  padding: 20px 12px;
  overflow-y: auto;
}
.sidebar__section-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-faint);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  padding: 0 10px;
  margin-bottom: 6px;
}
.sidebar__link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 500;
  color: var(--text-muted);
  text-decoration: none;
  transition: background 0.18s, color 0.18s;
  margin-bottom: 2px;
}
.sidebar__link:hover {
  background: rgba(255,255,255,0.04);
  color: var(--text);
}
.sidebar__link--active {
  background: rgba(108, 99, 255, 0.12);
  color: #7C74FF;
  font-weight: 600;
}
.sidebar__link--active:hover {
  background: rgba(108, 99, 255, 0.16);
}
.sidebar__link--admin:not(.sidebar__link--active):hover {
  background: rgba(255,101,132,0.06);
  color: #FF6584;
}
.sidebar__link--coord:not(.sidebar__link--active):hover {
  background: rgba(245,158,11,0.06);
  color: #F59E0B;
}
.sidebar__role-badge {
  padding: 0 20px 12px;
  text-align: center;
}
.sidebar__role-pill {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 4px 12px;
  border-radius: 99px;
}
.sidebar__user {
  padding: 16px 20px;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 12px;
}
.sidebar__user-info {
  min-width: 0;
  flex: 1;
}
.sidebar__user-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sidebar__user-email {
  font-size: 11px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
`