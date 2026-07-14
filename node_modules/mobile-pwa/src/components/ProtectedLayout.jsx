import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import BottomNav from './BottomNav'

export default function ProtectedLayout() {
  const { user } = useAuth()

  if (!user) return <Navigate to="/" replace />

  return (
    <div>
      <Outlet />
      <BottomNav />
    </div>
  )
}
