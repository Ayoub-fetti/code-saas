import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import LanguageSwitcher from '../../components/LanguageSwitcher'

function KpiCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-brand-700">{value}</p>
    </div>
  )
}

export default function AdminPanel() {
  const [stats, setStats] = useState(null)
  const [pending, setPending] = useState([])
  const { user, logout } = useAuth()
  const { t } = useLanguage()

  const load = async () => {
    const [statsRes, pendingRes] = await Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/drivers/pending'),
    ])
    setStats(statsRes.data)
    setPending(pendingRes.data)
  }

  useEffect(() => {
    load()
  }, [])

  const handleVerify = async (driverId) => {
    await api.post(`/admin/drivers/${driverId}/verify`)
    load()
  }

  const handleReject = async (driverId) => {
    await api.post(`/admin/drivers/${driverId}/reject`)
    load()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-brand-700">{t('admin_title')}</h1>
          <p className="text-sm text-gray-500">{user?.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <button onClick={logout} className="text-sm text-gray-500 hover:text-red-600">
            {t('logout')}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-8">
        {stats && (
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard label={t('kpi_users')} value={stats.total_users} />
            <KpiCard label={t('kpi_companies')} value={stats.total_companies} />
            <KpiCard label={t('kpi_verified_drivers')} value={stats.verified_drivers} />
            <KpiCard label={t('kpi_pending_drivers')} value={stats.pending_drivers} />
            <KpiCard label={t('kpi_missions_available')} value={stats.missions_available} />
            <KpiCard label={t('kpi_missions_in_progress')} value={stats.missions_in_progress} />
            <KpiCard label={t('kpi_missions_completed')} value={stats.missions_completed} />
            <KpiCard label={t('kpi_revenue')} value={stats.total_revenue} />
          </section>
        )}

        <section>
          <h2 className="text-lg font-semibold mb-4">{t('pending_drivers_title')}</h2>
          {pending.length === 0 && <p className="text-gray-400 text-sm">{t('no_pending_drivers')}</p>}
          <div className="space-y-3">
            {pending.map((driver) => (
              <div key={driver.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center justify-between">
                <div>
                  <p className="font-medium">{driver.user?.name}</p>
                  <p className="text-sm text-gray-500">
                    CIN: {driver.cin || '—'} · {t('license_b').split(' ')[0]}: {driver.license_no || '—'} ({driver.license_type}) · {driver.truck_type}
                  </p>
                  <div className="flex gap-3 mt-2 text-xs text-brand-600 underline">
                    {driver.cin_photo && <a href={driver.cin_photo} target="_blank" rel="noreferrer">{t('view_cin')}</a>}
                    {driver.license_photo && <a href={driver.license_photo} target="_blank" rel="noreferrer">{t('view_license')}</a>}
                    {driver.truck_photo && <a href={driver.truck_photo} target="_blank" rel="noreferrer">{t('view_truck')}</a>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleVerify(driver.id)}
                    className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700">
                    {t('validate')}
                  </button>
                  <button onClick={() => handleReject(driver.id)}
                    className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded-lg hover:bg-red-200">
                    {t('reject')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
