import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useLanguage } from '../context/LanguageContext'
import LanguageSwitcher from '../components/LanguageSwitcher'
import BidModal from '../components/BidModal'

export default function Missions() {
  const [missions, setMissions] = useState([])
  const [city, setCity] = useState('')
  const [selected, setSelected] = useState(null)
  const { t } = useLanguage()

  const loadMissions = async () => {
    const { data } = await api.get('/missions', { params: city ? { city } : {} })
    setMissions(data)
  }

  useEffect(() => {
    loadMissions()
  }, [])

  const handleFilter = (e) => {
    e.preventDefault()
    loadMissions()
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white px-4 py-4 sticky top-0 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-bold text-brand-700 text-lg">{t('available_missions')}</h1>
          <LanguageSwitcher />
        </div>
        <form onSubmit={handleFilter} className="flex gap-2">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={t('filter_city')}
            className="input flex-1"
          />
          <button type="submit" className="bg-brand-600 text-white px-4 rounded-xl text-sm font-medium">
            {t('filter_ok')}
          </button>
        </form>
      </header>

      <main className="p-4 space-y-3">
        {missions.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-10">{t('no_missions_available')}</p>
        )}
        {missions.map((mission) => (
          <div key={mission.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100" onClick={() => setSelected(mission)}>
            <div className="flex justify-between items-start">
              <h3 className="font-semibold">{mission.title}</h3>
              <span className="text-brand-700 font-bold">{mission.price} MAD</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {mission.start_city} → {mission.end_city} · {mission.distance_km} km
            </p>
            <div className="flex gap-2 mt-2 text-xs">
              <span className="bg-gray-100 px-2 py-1 rounded-full">{mission.goods_type}</span>
              <span className="bg-gray-100 px-2 py-1 rounded-full">{t(`truck_${mission.truck_type === 'leger' ? 'light' : mission.truck_type === 'moyen' ? 'medium' : 'heavy'}`)}</span>
              <span className="bg-gray-100 px-2 py-1 rounded-full">{t(`license_${mission.required_license.toLowerCase()}`)}</span>
            </div>
          </div>
        ))}
      </main>

      {selected && (
        <BidModal mission={selected} onClose={() => setSelected(null)} onSubmitted={loadMissions} />
      )}
    </div>
  )
}
