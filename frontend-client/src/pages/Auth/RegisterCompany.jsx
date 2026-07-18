import React, { useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const RegisterCompany = () => {
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', company_name: '', ice: '', role: 'company' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/register', form);
            navigate('/waiting-verification');
        } catch (err) { alert('Erreur inscription'); }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl mb-6">Inscription Entreprise</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Nom" className="w-full p-2 border" onChange={e => setForm({...form, name: e.target.value})} required />
                <input type="email" placeholder="Email" className="w-full p-2 border" onChange={e => setForm({...form, email: e.target.value})} required />
                <input type="text" placeholder="Téléphone" className="w-full p-2 border" onChange={e => setForm({...form, phone: e.target.value})} required />
                <input type="password" placeholder="Mot de passe" className="w-full p-2 border" onChange={e => setForm({...form, password: e.target.value})} required />
                <input type="text" placeholder="Nom Entreprise" className="w-full p-2 border" onChange={e => setForm({...form, company_name: e.target.value})} required />
                <input type="text" placeholder="ICE" className="w-full p-2 border" onChange={e => setForm({...form, ice: e.target.value})} required />
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">S'inscrire</button>
            </form>
        </div>
    );
};

export default RegisterCompany;
