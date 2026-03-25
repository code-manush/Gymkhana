import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/clerk-react'

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

// ── Protected route wrapper ────────────────────────────────────
function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0A0A0F',
      }}
    >
      <div
        style={{
          width: 32, height: 32,
          border: '2px solid #6C63FF',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }}
      />
    </div>
  )

  if (!isSignedIn) return <Navigate to="/sign-in" replace />
  return children
}

// ── App ────────────────────────────────────────────────────────
export default function App() {
  const { isSignedIn, getToken } = useAuth()
  const { user } = useUser()

  // Sync the Clerk user into our MySQL users table on every sign-in
  useEffect(() => {
    if (!isSignedIn || !user) return

    ;(async () => {
      try {
        const token = await getToken()
        await fetch(`${import.meta.env.VITE_API_URL}/users/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(user),
        })
      } catch (err) {
        console.error('User sync failed:', err.message)
      }
    })()
  }, [isSignedIn]) // runs once when sign-in state changes

  return (
    <Routes>
      {/* Public */}
      <Route path="/"        element={<LandingPage />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />

      {/* Protected */}
      <Route path="/dashboard"  element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/events"     element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
      <Route path="/events/:id" element={<ProtectedRoute><EventDetailPage /></ProtectedRoute>} />
      <Route path="/clubs"      element={<ProtectedRoute><ClubsPage /></ProtectedRoute>} />
      <Route path="/clubs/:id"  element={<ProtectedRoute><ClubDetailPage /></ProtectedRoute>} />
      <Route path="/results"    element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
      <Route path="/profile"    element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/admin"      element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
      <Route path="/coordinator"element={<ProtectedRoute><CoordinatorPage /></ProtectedRoute>} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}