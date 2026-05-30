import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import EditProfileModal from '../components/profile/EditProfileModal';
import HistoryItem from '../components/profile/HistoryItem';
import ProfileCard from '../components/profile/ProfileCard';
import api from '../api';
import { useUser } from '../components/hooks/UserContext';

export default function Profile() {
    const navigate = useNavigate();
    const { user, setUser } = useUser();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadProfileData = async () => {
        if (!localStorage.getItem('token')) return;

        try {
            const userRes = await api.get('/profile');
            setUser(userRes.data.data);

            const historyRes = await api.get('/food-logs/history-with-meals');
            setHistory(historyRes.data);
        } catch (e) {
            if (e.response?.status !== 401) {
                console.error("Error al cargar datos:", e);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (localStorage.getItem('token')) {
            loadProfileData();
        }
    }, []);

    const handleSaveProfile = async (data) => {
        const res = await api.put('/profile', data);
        setUser(res.data.data);
        return res;
    };

    const handleUpdatePassword = async (passwordData) => {
        await api.put('/profile/password', passwordData);
    };

    const handleAvatarUpdated = async (updatedUser) => {
        setUser(updatedUser);
    };

    const handleLogout = async () => {
        try {
            await api.post('/logout');
        } catch (e) {
            console.error(e);
        } finally {
            localStorage.removeItem('token');
            setUser(null);
            navigate('/login');
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "No especificada";
        if (dateStr.includes('-')) {
            const [year, month, day] = dateStr.split('-');
            return `${day}/${month}/${year}`;
        }
        return dateStr;
    };

    if (loading) {
        return (
            <Layout>
                <div className="text-center py-10 text-gray-400">Cargando perfil...</div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-3xl mx-auto pt-4 px-4">

                <h1 className="text-[32px] font-bold text-[#1A1C1E] mb-6">Cuenta</h1>

                <ProfileCard
                    user={user}
                    onEditClick={() => setIsModalOpen(true)}
                    onLogoutClick={handleLogout}
                    formatDate={formatDate}
                    onAvatarUpdated={handleAvatarUpdated}
                />

                <h2 className="text-2xl font-bold text-[#1A1C1E] mb-5">Historial</h2>
                {history.length === 0 ? (
                    <p className="text-gray-400 text-sm py-4">No hay registros históricos disponibles.</p>
                ) : (
                    <div className="space-y-1">
                        {history.map((day, idx) => (
                            <HistoryItem key={idx} day={day} />
                        ))}
                    </div>
                )}

            </div>

            {isModalOpen && (
                <EditProfileModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    user={user}
                    onSave={handleSaveProfile}
                    onUpdatePassword={handleUpdatePassword}
                />
            )}
        </Layout>
    );
}