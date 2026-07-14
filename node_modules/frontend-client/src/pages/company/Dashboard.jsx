import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import CreateMission from './CreateMission'
import MissionBids from './MissionBids'

export default function CompanyDashboard() {
  const [missions, setMissions] = useState([])
  const [tab, setTab] = useState('missions')
  const { user, logout } = useAuth()
  const { t } = useLanguage()

  const loadMissions = async () => {
    const { data } = await api.get('/missions/mine')
    setMissions(data)
  }

  useEffect(() => {
    loadMissions()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-brand-700">{t('app_name')}</h1>
          <p className="text-sm text-gray-500">{user?.company?.company_name || user?.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <button onClick={logout} className="text-sm text-gray-500 hover:text-red-600">
            {t('logout')}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex gap-2">
          <button onClick={() => setTab('missions')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'missions' ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
            {t('my_missions')}
          </button>
          <button onClick={() => setTab('create')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'create' ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
            {t('publish_mission')}
          </button>
        </div>

        {tab === 'create' && (
          <CreateMission onCreated={() => { loadMissions(); setTab('missions') }} />
        )}

        {tab === 'missions' && (
          <div className="space-y-4">
            {missions.length === 0 && <p className="text-gray-400 text-sm">{t('no_missions_yet')}</p>}
            {missions.map((mission) => (
              <MissionBids key={mission.id} mission={mission} onUpdated={loadMissions} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
