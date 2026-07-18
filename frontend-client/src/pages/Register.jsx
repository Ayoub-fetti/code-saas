import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Register() {
  const location = useLocation()
  const navigate = useNavigate()

  const queryParams = new URLSearchParams(location.search)
  const type = queryParams.get('type') // 'company' or 'driver'

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: type === 'company' ? 'company' : 'driver',
    company_name: '',
    ice: '',
    license_no: '',
    cin: '',
    truck_type: 'leger',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await api.post('/register', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: form.role,
        company_name: form.role === 'company' ? form.company_name : undefined,
        ice: form.role === 'company' ? form.ice : undefined,
        license_no: form.role === 'driver' ? form.license_no : undefined,
        truck_type: form.role === 'driver' ? form.truck_type : undefined,
      })

      // Registration successful, redirect to login
      setSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.email?.[0] ||
          'Une erreur est survenue lors de l\'inscription.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Reset form if type changes
  // (we could use useEffect to watch type, but for simplicity we'll just rely on initial)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:md:lg:xl">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {type === 'company'
              ? "Créer votre compte entreprise"
              : type === 'driver'
                ? "Créer votre compte chauffeur"
                : "Créer votre compte"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Remplissez le formulaire ci-dessous pour créer votre compte.
          </p>
        </div>

        {success ? (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
            <p className="font-medium">Inscription réussie !</p>
            <p className="mt-1">Vous allez être redirigé vers la page de connexion.</p>
          </div>
        ) : null}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p className="font-medium">Erreur !</p>
            <p className="mt-1">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom complet
            </label>
            <input
              type="text"
              name="name"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              name="phone"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {form.role === 'company' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'entreprise
                </label>
                <input
                  type="text"
                  name="company_name"
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={form.company_name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ICE (Identifiant de Commerce)
                </label>
                <input
                  type="text"
                  name="ice"
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={form.ice}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {form.role === 'driver' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de permis
                </label>
                <input
                  type="text"
                  name="license_no"
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={form.license_no}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de camion
                </label>
                <select
                  name="truck_type"
                  required
                  className="border rounded w-full py-2 px-3 text-gray-700"
                  value={form.truck_type}
                  onChange={handleChange}
                >
                  <option value="leger">Léger</option>
                  <option value="moyen">Moyen</option>
                  <option value="lourd">Lourd</option>
                </select>
              </div>
            </>
          )}

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                loading ? 'opacity-50' : ''
              }`}
            >
              {loading ? 'En cours...' : 'S\'inscrire'}
            </button>
          </div>

          <p className="text-center text-xs mt-4">
            Déjà un compte ?
            <a
              href="/login"
              className="font-medium text-blue-600 hover:underline"
            >
              Connectez-vous
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}