import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import ProtectedLayout from './components/ProtectedLayout'
import LoginOtp from './pages/LoginOtp'
import Missions from './pages/Missions'
import Applications from './pages/Applications'
import Documents from './pages/Documents'
import Profile from './pages/Profile'

export default function App() {
  return (
    <LanguageProvider>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LoginOtp />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/missions" element={<Missions />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
    </LanguageProvider>
  )
}
