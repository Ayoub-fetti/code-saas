import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useLanguage } from '../context/LanguageContext'
import LanguageSwitcher from '../components/LanguageSwitcher'

export default function Applications() {
  const [missions, setMissions] = useState([])
  const { t } = useLanguage()

  const statusLabels = {
    available: { text: t('status_waiting'), color: 'bg-yellow-100 text-yellow-700' },
    applied: { text: t('status_applied'), color: 'bg-yellow-100 text-yellow-700' },
    in_progress: { text: t('status_accepted'), color: 'bg-green-100 text-green-700' },
    completed: { text: t('status_completed'), color: 'bg-gray-100 text-gray-700' },
  }

  useEffect(() => {
    api.get('/missions/applications').then(({ data }) => setMissions(data))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white px-4 py-4 sticky top-0 border-b border-gray-100 flex items-center justify-between">
        <h1 className="font-bold text-brand-700 text-lg">{t('my_applications')}</h1>
        <LanguageSwitcher />
      </header>

      <main className="p-4 space-y-3">
        {missions.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-10">{t('no_applications')}</p>
        )}
        {missions.map((mission) => {
          const myBid = mission.bids?.[0]
          const status = statusLabels[mission.status] || statusLabels.available
          return (
            <div key={mission.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold">{mission.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${status.color}`}>{status.text}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {mission.start_city} → {mission.end_city} · {mission.distance_km} km
              </p>
              {myBid && (
                <p className="text-sm mt-2 text-brand-700 font-medium">
                  {t('your_offer')} : {myBid.proposed_price} MAD
                </p>
              )}
            </div>
          )
        })}
      </main>
    </div>
  )
}
