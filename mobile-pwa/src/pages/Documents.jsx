import { useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import LanguageSwitcher from '../components/LanguageSwitcher'

function DocUploader({ label, field, file, onChange, takePhotoLabel }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100">
      <p className="font-medium text-sm mb-2">{label}</p>
      <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-32 cursor-pointer text-gray-400 overflow-hidden">
        {file ? (
          <img src={URL.createObjectURL(file)} alt={label} className="h-full w-full object-cover" />
        ) : (
          <>
            <span className="text-3xl">📷</span>
            <span className="text-xs mt-1">{takePhotoLabel}</span>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => onChange(field, e.target.files[0])}
        />
      </label>
    </div>
  )
}

export default function Documents() {
  const [files, setFiles] = useState({ cin_photo: null, license_photo: null, truck_photo: null })
  const [form, setForm] = useState({ cin: '', license_no: '', license_type: 'B', truck_type: 'leger', city: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { refreshUser } = useAuth()
  const { t } = useLanguage()

  const handleFile = (field, file) => {
    setFiles({ ...files, [field]: file })
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([key, value]) => formData.append(key, value))
      Object.entries(files).forEach(([key, file]) => {
        if (file) formData.append(key, file)
      })

      await api.post('/driver/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      await refreshUser()
      setMessage(t('documents_sent'))
    } catch (err) {
      setMessage(err.response?.data?.message || t('upload_error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white px-4 py-4 sticky top-0 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-brand-700 text-lg">{t('my_documents')}</h1>
          <p className="text-xs text-gray-500">{t('documents_subtitle')}</p>
        </div>
        <LanguageSwitcher />
      </header>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <DocUploader label={t('doc_cin')} field="cin_photo" file={files.cin_photo} onChange={handleFile} takePhotoLabel={t('take_photo')} />
        <DocUploader label={t('doc_license')} field="license_photo" file={files.license_photo} onChange={handleFile} takePhotoLabel={t('take_photo')} />
        <DocUploader label={t('doc_truck')} field="truck_photo" file={files.truck_photo} onChange={handleFile} takePhotoLabel={t('take_photo')} />

        <input name="cin" value={form.cin} onChange={handleChange} placeholder={t('cin_number')} className="input" />
        <input name="license_no" value={form.license_no} onChange={handleChange} placeholder={t('license_number')} className="input" />

        <select name="license_type" value={form.license_type} onChange={handleChange} className="input">
          <option value="B">{t('license_b')}</option>
          <option value="C">{t('license_c')}</option>
          <option value="EC">{t('license_ec')}</option>
        </select>

        <select name="truck_type" value={form.truck_type} onChange={handleChange} className="input">
          <option value="leger">{t('truck_light')}</option>
          <option value="moyen">{t('truck_medium')}</option>
          <option value="lourd">{t('truck_heavy')}</option>
        </select>

        <input name="city" value={form.city} onChange={handleChange} placeholder={t('city')} className="input" />

        {message && <p className="text-sm text-gray-600">{message}</p>}

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? t('sending_file') : t('send_file')}
        </button>
      </form>
    </div>
  )
}
