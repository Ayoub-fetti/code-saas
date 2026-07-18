import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/login" replace />

  // Vérification Email (pour entreprises uniquement)
  if (user.role === 'company' && !user.email_verified_at) {
    return <Navigate to="/waiting-verification" replace />
  }

  // Vérification Période d'essai (pour entreprises uniquement)
  // On suppose que l'API renvoie un flag ou on fait le calcul localement si possible
  // Sinon, le middleware trial.check côté backend renverra une 403 que l'axios interceptor gérera

  return children
}
