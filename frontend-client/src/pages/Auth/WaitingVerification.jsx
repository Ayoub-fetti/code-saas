import React from 'react';

const WaitingVerification = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Vérifiez votre email</h2>
                <p className="text-gray-600 mb-6">
                    Un email de confirmation a été envoyé à votre adresse.
                    Veuillez cliquer sur le lien contenu dans l'email pour activer votre compte entreprise.
                </p>
                <div className="animate-pulse bg-blue-100 p-4 rounded text-blue-800 text-sm">
                    Vous serez redirigé automatiquement après validation.
                </div>
            </div>
        </div>
    );
};

export default WaitingVerification;
