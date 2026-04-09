import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const { isSignedIn, isLoaded, getToken } = useAuth()
  const [dbUser, setDbUser]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) { setDbUser(null); setLoading(false); return }

    ;(async () => {
      try {
        const token = await getToken()
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) setDbUser(await res.json())
      } catch {
        // leave dbUser null
      } finally {
        setLoading(false)
      }
    })()
  }, [isLoaded, isSignedIn])

  const role          = dbUser?.role ?? null
  const isAdmin       = role === 'admin'
  const isCoordinator = role === 'coordinator' || role === 'admin'
  const isStudent     = role === 'student'
  const isVisitor     = role === 'visitor'

  return (
    <UserContext.Provider value={{ dbUser, role, isAdmin, isCoordinator, isStudent, isVisitor, loading }}>
      {children}
    </UserContext.Provider>
  )
}

/** Use anywhere inside the app to get the current DB user + role flags */
export function useUserRole() {
  return useContext(UserContext)
}
