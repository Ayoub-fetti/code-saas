import React, { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Ici, vous devrez connecter cet appel à votre API backend pour l'envoi d'email
        alert('Message envoyé !');
    };

    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Contactez-nous</h1>
            <form onSubmit={handleSubmit} className="max-w-lg bg-white p-6 rounded shadow-md">
                <input type="text" placeholder="Nom" className="w-full p-2 mb-4 border rounded" onChange={e => setFormData({...formData, name: e.target.value})} required />
                <input type="email" placeholder="Email" className="w-full p-2 mb-4 border rounded" onChange={e => setFormData({...formData, email: e.target.value})} required />
                <textarea placeholder="Message" className="w-full p-2 mb-4 border rounded" rows="4" onChange={e => setFormData({...formData, message: e.target.value})} required></textarea>
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Envoyer</button>
            </form>
        </div>
    );
};

export default Contact;
