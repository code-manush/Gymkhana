// ─── ProfilePage.jsx ───────────────────────────────────────────────────────
import { useEffect, useState } from 'react'
import { UserProfile, useUser } from '@clerk/clerk-react'
import { Trophy, Calendar, Users, Star, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import { useApi } from '../lib/api'

export default function ProfilePage() {
  const { user } = useUser()
  const api = useApi()
  
  const [profileData, setProfileData] = useState({ clubs: [], activity: [], stats: {}, dbUser: null })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/users/profile')
      .then(data => setProfileData(data))
      .catch(err => console.error('Failed to fetch profile:', err))
      .finally(() => setLoading(false))
  }, [])

  const { clubs, activity, stats, dbUser } = profileData

  // Helper to color-code statuses
  const getStatusColor = (status) => {
    if (!status) return '#6B6B8A'
    if (status.toLowerCase() === 'confirmed') return '#10B981' // Green
    if (status.toLowerCase() === 'waitlisted' || status.toLowerCase() === 'pending') return '#F59E0B' // Orange
    if (status.includes('Place')) return '#F5C842' // Gold for wins
    return '#7C74FF' // Purple default
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-header__title">My Profile</h1>
        <p className="page-header__sub">Manage your account and view your Gymkhana activity.</p>
      </div>

      <div className="profile-grid">
        <div className="profile-left">
          {/* Summary */}
          <div className="glass-card">
            <div className="profile-hero">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt="avatar" className="profile-avatar" />
              ) : (
                <div className="profile-avatar profile-avatar--initials">
                  <span>{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
                </div>
              )}
              <div>
                <p className="profile-name">{user?.fullName || 'Student'}</p>
                <p className="profile-email">{user?.primaryEmailAddress?.emailAddress}</p>
                <span className="role-badge role-badge--coord" style={{ marginTop: 6, display: 'inline-block' }}>
                  {dbUser?.role ? dbUser.role.charAt(0).toUpperCase() + dbUser.role.slice(1) : 'Student'}
                </span>
              </div>
            </div>

            <div className="profile-stats">
              {[
                { icon: Calendar, label: 'Events', value: stats.events ?? '-', color: '#7C74FF' },
                { icon: Users,    label: 'Clubs',  value: stats.clubs ?? '-',  color: '#FF6584' },
                { icon: Trophy,   label: 'Wins',   value: stats.wins ?? '-',   color: '#F5C842' },
                { icon: Star,     label: 'Points', value: stats.points ?? '-', color: '#4ECDC4' },
              ].map((s, i) => (
                <div key={i} className="profile-stat">
                  <s.icon size={13} style={{ color: s.color }} />
                  <div>
                    <p className="profile-stat__val" style={{ color: s.color }}>{loading ? '...' : s.value}</p>
                    <p className="profile-stat__label">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Log */}
          <div className="glass-card">
            <p className="glass-card__title" style={{ marginBottom: 16 }}>Recent Activity</p>
            {loading ? <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Loading...</p> : activity.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No recent activity. <Link to="/events" style={{ color: '#7C74FF' }}>Find an event →</Link></p>
            ) : (
              <div className="item-list">
                {activity.map((a, i) => {
                  const color = getStatusColor(a.status)
                  return (
                    <div key={i} className="item-row">
                      <div className="item-row__dot" style={{ background: color }} />
                      <div className="item-row__body">
                        <p className="item-row__name">{a.label}</p>
                        <p className="item-row__sub">{a.type} · {new Date(a.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                      <span className="item-row__badge" style={{ color: color, background: `${color}18` }}>{a.status}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* My Clubs */}
          <div className="glass-card">
            <p className="glass-card__title" style={{ marginBottom: 14 }}>My Clubs</p>
            {loading ? <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Loading...</p> : clubs.length === 0 ? (
               <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>You haven't joined any clubs. <Link to="/clubs" style={{ color: '#7C74FF' }}>Browse clubs →</Link></p>
            ) : (
              <div className="item-list">
                {clubs.map((c, i) => (
                  <div key={i} className="item-row">
                    <div className="item-row__dot" style={{ background: '#7C74FF' }} />
                    <p className="item-row__name" style={{ flex: 1 }}>{c.name}</p>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.role}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Clerk Profile Manager */}
        <div className="profile-right">
          <UserProfile
            appearance={{
              variables: {
                colorPrimary: '#6C63FF', colorBackground: '#111120',
                colorInputBackground: '#161628', colorInputText: '#F0F0FA',
                colorText: '#F0F0FA', colorTextSecondary: '#A0A0C0',
                colorNeutral: '#1A1A30', borderRadius: '16px',
                fontFamily: 'DM Sans, sans-serif',
              },
              elements: { card: 'shadow-none', navbar: 'border-r-0' },
            }}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}

/* ── ProfilePage Styles ── */
const _profileCss = `
.profile-grid { display: grid; grid-template-columns: 300px 1fr; gap: 20px; align-items: start; }
.profile-left { display: flex; flex-direction: column; gap: 14px; }
.profile-right { }
.profile-hero { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
.profile-avatar {
  width: 56px; height: 56px;
  border-radius: 16px;
  object-fit: cover;
}
.profile-avatar--initials {
  background: rgba(108,99,255,0.15);
  display: flex; align-items: center; justify-content: center;
}
.profile-avatar--initials span {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 20px;
  color: #7C74FF;
}
.profile-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 16px; color: var(--text); }
.profile-email { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
.profile-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.profile-stat {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: var(--surface);
  border-radius: 10px;
}
.profile-stat__val {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 18px;
  line-height: 1;
}
.profile-stat__label { font-size: 11px; color: var(--text-muted); }
@media (max-width: 900px) {
  .profile-grid { grid-template-columns: 1fr; }
}
`