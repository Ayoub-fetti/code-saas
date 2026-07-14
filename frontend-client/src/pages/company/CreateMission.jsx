import { useState, useEffect } from 'react'
import api from '../../api/axios'
import { useLanguage } from '../../context/LanguageContext'

const initialForm = {
  title: '',
  start_address: '',
  end_address: '',
  start_city: '',
  end_city: '',
  goods_type: '',
  truck_type: 'leger',
  max_weight: '',
  required_license: 'B',
  distance_km: '',
}

export default function CreateMission({ onCreated }) {
  const [form, setForm] = useState(initialForm)
  const [simulatedPrice, setSimulatedPrice] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { t } = useLanguage()

  useEffect(() => {
    const distance = parseFloat(form.distance_km)
    if (!distance || distance <= 0) {
      setSimulatedPrice(null)
      return
    }
    const timeout = setTimeout(async () => {
      try {
        const { data } = await api.post('/missions/calculate-price', {
          distance_km: distance,
          truck_type: form.truck_type,
        })
        setSimulatedPrice(data.price)
      } catch (e) {
        setSimulatedPrice(null)
      }
    }, 300)
    return () => clearTimeout(timeout)
  }, [form.distance_km, form.truck_type])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      await api.post('/missions', form)
      setMessage(t('mission_published'))
      setForm(initialForm)
      setSimulatedPrice(null)
      onCreated?.()
    } catch (err) {
      setMessage(err.response?.data?.message || t('creation_error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold mb-4">{t('publish_new_mission')}</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="title" value={form.title} onChange={handleChange} required
          placeholder={t('mission_title')} className="input" />
        <input name="goods_type" value={form.goods_type} onChange={handleChange} required
          placeholder={t('goods_type')} className="input" />

        <input name="start_address" value={form.start_address} onChange={handleChange} required
          placeholder={t('start_address')} className="input" />
        <input name="end_address" value={form.end_address} onChange={handleChange} required
          placeholder={t('end_address')} className="input" />

        <input name="start_city" value={form.start_city} onChange={handleChange}
          placeholder={t('start_city')} className="input" />
        <input name="end_city" value={form.end_city} onChange={handleChange}
          placeholder={t('end_city')} className="input" />

        <select name="truck_type" value={form.truck_type} onChange={handleChange} className="input">
          <option value="leger">{t('truck_light')}</option>
          <option value="moyen">{t('truck_medium')}</option>
          <option value="lourd">{t('truck_heavy')}</option>
        </select>

        <select name="required_license" value={form.required_license} onChange={handleChange} className="input">
          <option value="B">{t('license_b')}</option>
          <option value="C">{t('license_c')}</option>
          <option value="EC">{t('license_ec')}</option>
        </select>

        <input type="number" step="0.1" name="max_weight" value={form.max_weight} onChange={handleChange} required
          placeholder={t('max_weight')} className="input" />
        <input type="number" step="0.1" name="distance_km" value={form.distance_km} onChange={handleChange} required
          placeholder={t('distance')} className="input" />

        {simulatedPrice !== null && (
          <div className="md:col-span-2 bg-brand-50 border border-brand-100 rounded-lg px-4 py-3 text-brand-700 font-medium">
            {t('price_calculated')} : {simulatedPrice} MAD
          </div>
        )}

        {message && <p className="md:col-span-2 text-sm text-gray-600">{message}</p>}

        <button type="submit" disabled={loading}
          className="md:col-span-2 bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50">
          {loading ? t('publishing') : t('publish')}
        </button>
      </form>
    </div>
  )
}
