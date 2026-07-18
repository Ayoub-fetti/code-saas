import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import WaitingVerification from './pages/Auth/WaitingVerification'
import RegisterCompany from './pages/Auth/RegisterCompany'
import RegisterDriver from './pages/Auth/RegisterDriver'
import PaymentRequired from './pages/company/PaymentRequired'
import CompanyDashboard from './pages/company/Dashboard'
import AdminPanel from './pages/admin/AdminPanel'

export default function App() {
  return (
    <LanguageProvider>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-company" element={<RegisterCompany />} />
        <Route path="/register-driver" element={<RegisterDriver />} />
        <Route path="/waiting-verification" element={<WaitingVerification />} />
        <Route path="/payment-required" element={<PaymentRequired />} />

        <Route
          path="/company"
          element={
            <ProtectedRoute role="company">
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
    </LanguageProvider>
  )
}
