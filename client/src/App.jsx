import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/clerk-react'
import { useApi } from './lib/api'

// Pages
import LandingPage from './pages/LandingPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import DashboardPage from './pages/DashboardPage'
import EventsPage from './pages/EventsPage'
import EventDetailPage from './pages/EventDetailPage'
import ClubsPage from './pages/ClubsPage'
import ClubDetailPage from './pages/ClubDetailPage'
import ResultsPage from './pages/ResultsPage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import CoordinatorPage from './pages/CoordinatorPage'
import NotFoundPage from './pages/NotFoundPage'

// ── Loading spinner ────────────────────────────────────────────
function Spinner() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0F' }}>
      <div style={{ width: 32, height: 32, border: '2px solid #6C63FF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  )
}

// ── Auth guard ─────────────────────────────────────────────────
// FIX: Use getToken() from useAuth() — never rely on localStorage.__clerk_db_jwt
// which is an internal Clerk key that is not guaranteed to exist.
function ProtectedRoute({ children, allowedRoles }) {
  const { isSignedIn, isLoaded } = useAuth()
  const api = useApi()
  const [dbUser, setDbUser] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!isLoaded || !isSignedIn) { setChecking(false); return }

    ; (async () => {
      try {
        const user = await api.get('/api/users/me')
        setDbUser(user)
      } catch (error) {
        console.error('Auth gate error:', error)
      } finally {
        setChecking(false);
      }
    })();
  }, [isLoaded, isSignedIn, api])

  if (!isLoaded || checking) return <Spinner />
  if (!isSignedIn) return <Navigate to="/sign-in" replace />

  // Role gate
  if (allowedRoles && dbUser && !allowedRoles.includes(dbUser.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}


// ── App ────────────────────────────────────────────────────────
export default function App() {
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const api = useApi()

  // Sync Clerk user into DB on every sign-in
  useEffect(() => {
    if (!isSignedIn || !user) return
      ; (async () => {
        try {
          const token = await getToken()
          await fetch(`${import.meta.env.VITE_API_URL}/users/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(user),
          })
        } catch (err) {
          console.error('User sync failed:', err.message)
        }
      })()
  }, [isSignedIn])
    ; (async () => {
      try {
        await api.post('/api/users/sync', {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          emailAddresses: [
            {
              emailAddress:
                user.primaryEmailAddress?.emailAddress ||
                user.emailAddresses?.[0]?.emailAddress ||
                '',
            },
          ],
        })
      } catch (err) {
        console.error('User sync failed:', err.message)
      }
    })()
}, [isSignedIn, user, api])

return (
  <Routes>
    {/* Public */}
    <Route path="/" element={<LandingPage />} />
    <Route path="/sign-in" element={<SignInPage />} />
    <Route path="/sign-up" element={<SignUpPage />} />

    {/* All authenticated users (including visitors) */}
    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
    <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
    <Route path="/events/:id" element={<ProtectedRoute><EventDetailPage /></ProtectedRoute>} />
    <Route path="/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

    {/* College users only (student, coordinator, admin) */}
    <Route path="/clubs" element={<ProtectedRoute allowedRoles={['student', 'coordinator', 'admin']}><ClubsPage /></ProtectedRoute>} />
    <Route path="/clubs/:id" element={<ProtectedRoute allowedRoles={['student', 'coordinator', 'admin']}><ClubDetailPage /></ProtectedRoute>} />

    {/* Coordinator + Admin */}
    <Route path="/coordinator" element={<ProtectedRoute allowedRoles={['coordinator', 'admin']}><CoordinatorPage /></ProtectedRoute>} />

    {/* Admin only */}
    <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminPage /></ProtectedRoute>} />

    {/* 404 */}
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
)
}