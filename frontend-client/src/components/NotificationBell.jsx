import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('/api/notifications');
            setNotifications(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des notifications', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000); // Poll toutes les minutes
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id) => {
        try {
            await axios.patch(`/api/notifications/${id}/read`);
            fetchNotifications();
        } catch (error) {
            console.error('Erreur lors de la lecture', error);
        }
    };

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 text-gray-600 hover:text-gray-900">
                🔔
                {notifications.filter(n => !n.read_at).length > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                        {notifications.filter(n => !n.read_at).length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg z-50">
                    <div className="p-3 border-b font-bold">Notifications</div>
                    <div className="max-h-60 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <p className="p-4 text-sm text-gray-500">Aucune notification.</p>
                        ) : (
                            notifications.map(n => (
                                <div key={n.id} className={`p-3 border-b text-sm ${!n.read_at ? 'bg-blue-50' : ''}`} onClick={() => markAsRead(n.id)}>
                                    {n.data.message}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
