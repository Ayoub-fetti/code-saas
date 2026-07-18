import React, { useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const RegisterDriver = () => {
    const [step, setStep] = useState(1);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    const handleSendOtp = async () => {
        await axios.post('/otp/send', { phone });
        setStep(2);
    };

    const handleVerifyOtp = async () => {
        const res = await axios.post('/otp/verify', { phone, otp });
        localStorage.setItem('token', res.data.token);
        navigate('/driver-dashboard');
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
            {step === 1 ? (
                <>
                    <h2 className="text-2xl mb-6">Inscription Conducteur</h2>
                    <input type="text" placeholder="Numéro de téléphone" className="w-full p-2 border mb-4" onChange={e => setPhone(e.target.value)} />
                    <button onClick={handleSendOtp} className="w-full bg-green-600 text-white p-2 rounded">Envoyer Code OTP</button>
                </>
            ) : (
                <>
                    <h2 className="text-2xl mb-6">Vérification</h2>
                    <input type="text" placeholder="Code OTP" className="w-full p-2 border mb-4" onChange={e => setOtp(e.target.value)} />
                    <button onClick={handleVerifyOtp} className="w-full bg-green-600 text-white p-2 rounded">Valider</button>
                </>
            )}
        </div>
    );
};

export default RegisterDriver;
