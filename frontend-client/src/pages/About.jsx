import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
          À propos de FretMarketplace
        </h1>
        <div className="max-w-2xl mx-auto text-center text-gray-600 leading-relaxed">
          <p>
            FretMarketplace est une plateforme innovante de mise en relation
            entre entreprises ayant besoin de transporter des marchandises et
            transporteurs professionnels disponibles.
          </p>
          <p className="mt-4">
            Notre mission est de simplifier la logistique urbaine et interurbaine
            en permettant un échange rapide, sécurisé et efficace.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">
              Pourquoi nous choisir ?
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Gain de temps précieux pour les expéditeurs</li>
              <li>Optimisation des tournées pour les transporteurs</li>
              <li>Sécurité et traçabilité des livraisons</li>
              <li>Support client dédié</li>
              <li>Tarifs compétitifs et transparents</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">
              Comment ça marche ?
            </h2>
            <ol className="list-decimal list-inside text-gray-700 space-y-2">
              <li>L'entreprise publie une demande de transport</li>
              <li>Les transporteurs consultants disponibles reçoivent une notification</li>
              <li>Le transporteur envoie son offre avec prix et délai</li>
              <li>L'entreprise accepte l'offre la plus adaptée</li>
              <li>Le transporteur réalise la livraison et confirme la fin</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}