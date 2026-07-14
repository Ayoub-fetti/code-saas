import { useState } from 'react'
import api from '../api/axios'
import { useLanguage } from '../context/LanguageContext'

export default function BidModal({ mission, onClose, onSubmitted }) {
  const [mode, setMode] = useState('accept') // accept | negotiate
  const [price, setPrice] = useState(mission.price)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { t } = useLanguage()

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      await api.post(`/missions/${mission.id}/bids`, {
        proposed_price: mode === 'accept' ? mission.price : price,
        message: mode === 'negotiate' ? message : null,
      })
      onSubmitted?.()
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || t('bid_error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end z-50">
      <div className="bg-white w-full rounded-t-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg">{mission.title}</h2>
          <button onClick={onClose} className="text-gray-400 text-xl">✕</button>
        </div>
        <p className="text-sm text-gray-500">{mission.start_city} → {mission.end_city} · {mission.distance_km} km</p>
        <p className="text-brand-700 font-bold text-xl">{mission.price} MAD</p>

        <div className="flex gap-2">
          <button
            onClick={() => setMode('accept')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium ${mode === 'accept' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            {t('accept_price')}
          </button>
          <button
            onClick={() => setMode('negotiate')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium ${mode === 'negotiate' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            {t('negotiate')}
          </button>
        </div>

        {mode === 'negotiate' && (
          <div className="space-y-3">
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={t('your_price')}
              className="input"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('message_to_company')}
              rows={3}
              className="input"
            />
          </div>
        )}

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button onClick={handleSubmit} disabled={loading} className="btn-primary">
          {loading ? t('sending_application') : t('send_application')}
        </button>
      </div>
    </div>
  )
}
