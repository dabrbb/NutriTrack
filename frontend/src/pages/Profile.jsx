import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import EditProfileModal from '../components/profile/EditProfileModal';
import HistoryItem from '../components/profile/HistoryItem';
import ProfileCard from '../components/profile/ProfileCard';
import api from '../api';
import { SuccessModal } from '../components/ui/SuccessModal';
import { useUser } from '../components/hooks/UserContext';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Profile() {
    const navigate = useNavigate();
    const { user, setUser } = useUser();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Cargar los datos de perfil y su historial
    const loadProfileData = async () => {
        if (!localStorage.getItem('token')) return;

        try {
            const userRes = await api.get('/profile');
            setUser(userRes.data.data);

            const historyRes = await api.get('/food-logs/history-with-meals');
            setHistory(historyRes.data);
        } catch (e) {
            // Ignoramos el error 401 por que el puede ser el resultado de acabo de token,
            // que es esperable con el accesso no autorizado
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
        try {
            await api.put('/profile/password', passwordData);
            setShowModal(true);
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
        }
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
            // Limpiamos el estado local independiente del resultado de request a backend
            localStorage.removeItem('token');
            setUser(null);
            navigate('/login');
        }
    };

    // Generar PDF por biblioteca jspdf y autotable
    const downloadHistoryPDF = () => {
        if (!history || history.length === 0) return;

        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text("Historial Nutricional - NutriTrack", 14, 22);

        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 30);

        const tableColumn = ["Fecha", "Calorías", "Proteínas", "Carbos", "Grasas"];
        const tableRows = [];

        // Convierte el array de datos a un formato compatible con la tabla PDF
        history.forEach(day => {
            tableRows.push([
                day.date || "N/A",
                day.total_kcal ? `${day.total_kcal} kcal` : "0 kcal",
                day.total_protein ? `${day.total_protein}g` : "0g",
                day.total_carbs ? `${day.total_carbs}g` : "0g",
                day.total_fat ? `${day.total_fat}g` : "0g"
            ]);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [0, 201, 80] },
        });

        doc.save("NutriTrack_Historial.pdf");
    };

    // Metodo auxiliar para normalizar el formato de fecha (YYYY-MM-DD -> DD/MM/YYYY)
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
                {/* Botón de export está activa solo si hay los datos en historial */}
                {history.length > 0 && (
                    <button
                        onClick={downloadHistoryPDF}
                        className="text-sm font-semibold text-[#00C950] hover:text-[#00b347] transition-colors cursor-pointer"
                    >
                        Descargar PDF
                    </button>
                )}
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

            {/* Renderizado condicional de modales para edición y notificaciones de éxito */}
            {isModalOpen && (
                <EditProfileModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    user={user}
                    onSave={handleSaveProfile}
                    onUpdatePassword={handleUpdatePassword}
                />
            )}

            <SuccessModal
                visible={showModal}
                title="¡Éxito!"
                message="Tu contraseña ha sido actualizada correctamente."
                onClose={() => setShowModal(false)}
            />
        </Layout>
    );
}