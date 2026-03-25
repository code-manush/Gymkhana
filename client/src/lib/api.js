import { useAuth } from '@clerk/clerk-react'

const BASE = import.meta.env.VITE_API_URL

export function useApi() {
  const { getToken } = useAuth()

  const request = async (path, options = {}) => {
    const token = await getToken()
    const res = await fetch(`${BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || `Request failed: ${res.status}`)
    }
    return res.json()
  }

  return {
    get:    (path)       => request(path),
    post:   (path, body) => request(path, { method: 'POST',   body: JSON.stringify(body) }),
    put:    (path, body) => request(path, { method: 'PUT',    body: JSON.stringify(body) }),
    patch:  (path, body) => request(path, { method: 'PATCH',  body: JSON.stringify(body) }),
    delete: (path)       => request(path, { method: 'DELETE' }),
  }
}