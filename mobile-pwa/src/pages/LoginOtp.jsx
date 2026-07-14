import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import LanguageSwitcher from '../components/LanguageSwitcher'

export default function LoginOtp() {
  const [step, setStep] = useState('phone') // phone | otp
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [debugOtp, setDebugOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { sendOtp, verifyOtp } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await sendOtp(phone)
      setDebugOtp(data.debug_otp || '')
      setStep('otp')
    } catch (err) {
      setError(err.response?.data?.message || t('otp_send_error'))
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await verifyOtp(phone, otp)
      navigate('/missions')
    } catch (err) {
      setError(err.response?.data?.message || t('otp_invalid'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-6">
      <div className="flex justify-end mb-4">
        <LanguageSwitcher />
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-brand-700">{t('app_name')}</h1>
        <p className="text-gray-500 text-sm mt-1">{t('login_subtitle')}</p>
      </div>

      {step === 'phone' && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">{t('phone_number')}</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="06XXXXXXXX"
            className="input"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? t('sending') : t('receive_code')}
          </button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            {t('code_received')} {phone}
          </label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            placeholder="123456"
            className="input text-center text-2xl tracking-widest"
          />
          {debugOtp && (
            <p className="text-xs text-gray-400 text-center">{t('dev_code')}: {debugOtp}</p>
          )}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? t('checking') : t('validate_code')}
          </button>
          <button type="button" onClick={() => setStep('phone')} className="w-full text-sm text-gray-500 py-2">
            {t('edit_number')}
          </button>
        </form>
      )}
    </div>
  )
}
