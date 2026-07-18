import React from 'react';

const PaymentRequired = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Période d'essai expirée</h2>
                <p className="text-gray-600 mb-6">
                    Votre période d'essai de 30 jours a expiré. Veuillez effectuer le paiement sur le compte suivant pour débloquer votre accès :
                </p>
                <div className="bg-gray-100 p-4 rounded font-mono text-sm text-gray-800">
                    RIB: XXXXXX XXXXX XXXXX XXXXX
                </div>
                <p className="mt-6 text-sm text-gray-500">
                    Une fois le virement effectué, veuillez nous contacter pour valider votre accès.
                </p>
            </div>
        </div>
    );
};

export default PaymentRequired;
