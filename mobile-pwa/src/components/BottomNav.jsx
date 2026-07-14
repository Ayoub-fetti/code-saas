import { NavLink } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export default function BottomNav() {
  const { t } = useLanguage()

  const tabs = [
    { to: '/missions', label: t('nav_missions'), icon: '📦' },
    { to: '/applications', label: t('nav_applications'), icon: '📋' },
    { to: '/documents', label: t('nav_documents'), icon: '🪪' },
    { to: '/profile', label: t('nav_profile'), icon: '👤' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 pb-[env(safe-area-inset-bottom)]">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            `flex flex-col items-center px-3 py-1 text-xs ${isActive ? 'text-brand-600 font-semibold' : 'text-gray-400'}`
          }
        >
          <span className="text-xl">{tab.icon}</span>
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
