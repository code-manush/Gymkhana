import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth, UserButton } from '@clerk/clerk-react'
import { Menu, X, Zap } from 'lucide-react'

export default function Navbar() {
  const { isSignedIn } = useAuth()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const links = isSignedIn
    ? [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/events',    label: 'Events' },
        { to: '/clubs',     label: 'Clubs' },
        { to: '/results',   label: 'Results' },
      ]
    : [{ to: '/', label: 'Home' }]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link to={isSignedIn ? '/dashboard' : '/'} className="navbar__brand">
          <div className="navbar__brand-icon">
            <Zap size={16} color="#fff" />
          </div>
          <span className="navbar__brand-text">
            Gymkhana<span style={{ color: '#7C74FF' }}> IIITV</span>
          </span>
        </Link>

        <div className="navbar__links">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`navbar__link${isActive(l.to) ? ' navbar__link--active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="navbar__actions">
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <>
              <Link to="/sign-in" className="btn-ghost btn--sm">Sign In</Link>
              <Link to="/sign-up" className="btn-primary btn--sm">Get Started</Link>
            </>
          )}
        </div>

        <button className="navbar__hamburger" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="navbar__mobile">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`navbar__mobile-link${isActive(l.to) ? ' navbar__mobile-link--active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <div className="navbar__mobile-auth">
              <Link to="/sign-in" onClick={() => setOpen(false)} className="btn-ghost btn--sm" style={{ textAlign: 'center' }}>Sign In</Link>
              <Link to="/sign-up" onClick={() => setOpen(false)} className="btn-primary btn--sm" style={{ textAlign: 'center' }}>Get Started</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

/* ── Navbar Styles ── */
const _css = `
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 50;
  background: rgba(10, 10, 18, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
}
.navbar__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 28px;
  height: 62px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.navbar__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}
.navbar__brand-icon {
  width: 32px; height: 32px;
  border-radius: 9px;
  background: linear-gradient(135deg, #6C63FF, #FF6584);
  display: flex;
  align-items: center;
  justify-content: center;
}
.navbar__brand-text {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: var(--text);
  letter-spacing: -0.02em;
}
.navbar__links {
  display: flex;
  align-items: center;
  gap: 32px;
}
.navbar__link {
  font-size: 13.5px;
  font-weight: 500;
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.18s;
}
.navbar__link:hover { color: var(--text); }
.navbar__link--active { color: #7C74FF; font-weight: 600; }
.navbar__actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.navbar__hamburger {
  display: none;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
}
.navbar__mobile {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px 20px;
  border-top: 1px solid var(--border);
  background: rgba(10, 10, 18, 0.95);
}
.navbar__mobile-link {
  padding: 10px 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
  text-decoration: none;
  border-radius: 8px;
}
.navbar__mobile-link--active { color: #7C74FF; }
.navbar__mobile-auth {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
  margin-top: 8px;
}
@media (max-width: 768px) {
  .navbar__links, .navbar__actions { display: none; }
  .navbar__hamburger { display: flex; }
}
`