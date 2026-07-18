import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">FretMarketplace</h1>
          <div className="space-x-4">
            <Link to="/about" className="text-gray-600">À propos</Link>
            <Link to="/contact" className="text-gray-600">Contact</Link>
          </div>
        </div>
      </nav>

      <section className="container mx-auto py-20 text-center px-4">
        <h2 className="text-5xl font-extrabold mb-6">Optimisez votre logistique.</h2>
        <p className="text-xl text-gray-600 mb-10">Mise en relation directe entre entreprises et transporteurs.</p>

        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link to="/register?type=company" className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700">
            S'inscrire Entreprise
          </Link>
          <Link to="/register?type=driver" className="bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-700">
            S'inscrire Conducteur
          </Link>
        </div>
      </section>
    </div>
  );
}
