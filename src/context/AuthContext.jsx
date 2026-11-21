import { createContext, useContext, useState, useEffect } from 'react'
import { apiRequest } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('klay_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verify session with backend
    apiRequest('/auth/me')
      .then((data) => {
        if (data?.success && data?.user) {
          setUser(data.user)
          localStorage.setItem('klay_user', JSON.stringify(data.user))
        }
      })
      .catch((error) => {
        if (error.message === 'Not authenticated') {
          setUser(null)
          localStorage.removeItem('klay_user')
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const login = (userData) => {
    setUser(userData)
    try {
      localStorage.setItem('klay_user', JSON.stringify(userData))
    } catch (e) {
      console.error('Failed to store auth session:', e)
    }
  }

  const logout = async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' })
    } catch (e) {
      console.warn('Logout request error:', e)
    } finally {
      setUser(null)
      try {
        localStorage.removeItem('klay_user')
      } catch (e) {
        console.error('Failed to clear auth session:', e)
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
