import { createContext, useContext, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('driver_user')
    return stored ? JSON.parse(stored) : null
  })

  const sendOtp = async (phone) => {
    const { data } = await api.post('/otp/send', { phone })
    return data
  }

  const verifyOtp = async (phone, otp) => {
    const { data } = await api.post('/otp/verify', { phone, otp })
    localStorage.setItem('driver_token', data.token)
    localStorage.setItem('driver_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  const refreshUser = async () => {
    const { data } = await api.get('/me')
    localStorage.setItem('driver_user', JSON.stringify(data))
    setUser(data)
    return data
  }

  const logout = async () => {
    try {
      await api.post('/logout')
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('driver_token')
    localStorage.removeItem('driver_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, sendOtp, verifyOtp, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
