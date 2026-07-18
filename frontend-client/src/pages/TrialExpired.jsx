import React from 'react'
import { Link } from 'react-router-dom'

export default function TrialExpired() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl text-center">
        <div className="flex flex-col items-center">
          <div className="mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Votre période d'essai a expiré
          </h1>
          <p className="text-gray-600 mb-6">
            Pour continuer à utiliser les services de publication de missions,
            veuillez effectuer le paiement de l'abonnement sur le numéro de
            compte suivant :
          </p>
          <p className="font-mono text-lg bg-gray-100 px-4 py-2 rounded mb-6">
            XXXXXX XXXXX XXXXX
          </p>
          <p className="text-gray-500 mb-6">
            Après réception du paiement, votre compte sera réactivé sous 24 heures.
          </p>
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}