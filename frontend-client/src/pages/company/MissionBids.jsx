import api from '../../api/axios'
import { useLanguage } from '../../context/LanguageContext'

export default function MissionBids({ mission, onUpdated }) {
  const { t } = useLanguage()

  const handleAccept = async (bidId) => {
    await api.post(`/bids/${bidId}/accept`)
    onUpdated?.()
  }

  const handleReject = async (bidId) => {
    await api.post(`/bids/${bidId}/reject`)
    onUpdated?.()
  }

  const statusLabel = {
    available: t('status_available'),
    applied: t('status_applied'),
    in_progress: t('status_in_progress'),
    completed: t('status_completed'),
  }

  return (
    <div className="border border-gray-100 rounded-xl p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold">{mission.title}</h3>
          <p className="text-sm text-gray-500">
            {mission.start_city} → {mission.end_city} · {mission.distance_km} km · {t('displayed_price')}: {mission.price} MAD
          </p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          mission.status === 'available' ? 'bg-green-100 text-green-700' :
          mission.status === 'applied' ? 'bg-yellow-100 text-yellow-700' :
          mission.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {statusLabel[mission.status]}
        </span>
      </div>

      {mission.bids?.length === 0 && (
        <p className="text-sm text-gray-400">{t('no_bids_yet')}</p>
      )}

      <ul className="space-y-2">
        {mission.bids?.map((bid) => (
          <li key={bid.id} className="flex items-center justify-between border border-gray-100 rounded-lg px-3 py-2">
            <div>
              <p className="font-medium text-sm">{bid.driver?.user?.name}</p>
              <p className="text-xs text-gray-500">{bid.proposed_price} MAD {bid.message && `· "${bid.message}"`}</p>
            </div>
            {bid.status === 'pending' && mission.status === 'applied' && (
              <div className="flex gap-2">
                <button onClick={() => handleAccept(bid.id)}
                  className="text-xs bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700">
                  {t('accept')}
                </button>
                <button onClick={() => handleReject(bid.id)}
                  className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200">
                  {t('reject')}
                </button>
              </div>
            )}
            {bid.status !== 'pending' && (
              <span className={`text-xs font-medium ${bid.status === 'accepted' ? 'text-green-600' : 'text-red-500'}`}>
                {bid.status === 'accepted' ? t('accept') : t('reject')}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
