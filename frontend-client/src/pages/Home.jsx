import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <h1 className="text-5xl font-bold text-gray-900 mb-8">Bienvenue sur Fret Marketplace</h1>
            <div className="flex gap-4">
                <Link to="/register-company" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
                    Inscription Entreprise
                </Link>
                <Link to="/register-driver" className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700">
                    Inscription Conducteur
                </Link>
            </div>
        </div>
    );
};

export default Home;
