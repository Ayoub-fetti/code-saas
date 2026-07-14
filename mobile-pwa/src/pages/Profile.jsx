import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import LanguageSwitcher from '../components/LanguageSwitcher'

export default function Profile() {
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white px-4 py-4 sticky top-0 border-b border-gray-100 flex items-center justify-between">
        <h1 className="font-bold text-brand-700 text-lg">{t('my_profile')}</h1>
        <LanguageSwitcher />
      </header>

      <main className="p-4 space-y-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="font-semibold text-lg">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.phone}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              user?.driver?.is_verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {user?.driver?.is_verified ? t('profile_verified') : t('profile_pending')}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">{t('truck_type')}</span><span>{user?.driver?.truck_type || '—'}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">{t('license')}</span><span>{user?.driver?.license_type || '—'}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">{t('city_label')}</span><span>{user?.driver?.city || '—'}</span></div>
        </div>

        <button onClick={handleLogout} className="w-full text-red-600 font-medium py-3 rounded-xl bg-red-50">
          {t('logout')}
        </button>
      </main>
    </div>
  )
}
