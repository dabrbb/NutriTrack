import { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function EditProfileModal({ isOpen, onClose, user, onSave, onUpdatePassword }) {
    const [name, setName] = useState("");
    const [birthday, setBirthday] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");

    // Password change fields
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");

    const [submittingProfile, setSubmittingProfile] = useState(false);
    const [submittingPassword, setSubmittingPassword] = useState(false);

    useEffect(() => {
        if (isOpen && user) {
            setName(user.name || "");
            setBirthday(user.birthday || "");
            setHeight(user.height || "");
            setWeight(user.weight || "");

            setCurrentPassword("");
            setNewPassword("");
            setNewPasswordConfirmation("");
        }
    }, [isOpen, user]);

    if (!isOpen) return null;

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        if (!name) return alert("El nombre es obligatorio");

        setSubmittingProfile(true);
        try {
            const payload = {
                name,
                birthday: birthday || null,
                height: height ? parseInt(height) : null,
                weight: weight ? parseFloat(weight) : null
            };

            const res = await onSave(payload);
            onClose();
            
        } catch (error) {
            console.error(error);
            alert("Error al actualizar el perfil");
        } finally {
            setSubmittingProfile(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (!currentPassword || !newPassword || !newPasswordConfirmation) {
            return alert("Por favor, rellena todos los campos de contraseña.");
        }

        setSubmittingPassword(true);
        try {
            await onUpdatePassword({
                current_password: currentPassword,
                new_password: newPassword,
                new_password_confirmation: newPasswordConfirmation
            });
            setCurrentPassword("");
            setNewPassword("");
            setNewPasswordConfirmation("");
            alert("Contraseña actualizada con éxito.");
        } catch (error) {
            alert(error.response?.data?.message || "Error al actualizar la contraseña.");
        } finally {
            setSubmittingPassword(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative border border-gray-100 my-8 animate-in fade-in zoom-in-95 duration-200">

                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-2xl font-bold text-[#1A1C1E] mb-6">Editar Perfil</h2>

                <form onSubmit={handleSaveProfile} className="space-y-4 border-b border-gray-100 pb-6">
                    <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
                    <Input label="Fecha de Nacimiento" type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Altura (cm)" type="number" placeholder="180" value={height} onChange={(e) => setHeight(e.target.value)} />
                        <Input label="Peso (kg)" type="number" step="0.1" placeholder="77" value={weight} onChange={(e) => setWeight(e.target.value)} />
                    </div>

                    <div className="flex gap-4 pt-2">
                        <Button type="button" variant="ghost" className="w-1/2 py-3 mt-0 text-gray-600 bg-gray-100 hover:bg-gray-200 border-none rounded-2xl text-sm font-semibold" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="w-1/2 py-3 mt-0 rounded-2xl text-sm font-semibold shadow-none" disabled={submittingProfile}>
                            {submittingProfile ? "Guardando..." : "Guardar"}
                        </Button>
                    </div>
                </form>

                <form onSubmit={handleUpdatePassword} className="space-y-4 pt-5">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Cambiar Contraseña</h3>
                    <Input label="Contraseña Actual" type="password" placeholder="••••••••" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                    <Input label="Nueva Contraseña" type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    <Input label="Confirmar Nueva Contraseña" type="password" placeholder="••••••••" value={newPasswordConfirmation} onChange={(e) => setNewPasswordConfirmation(e.target.value)} />

                    <Button type="submit" variant="ghost" className="w-full py-3 mt-2 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-2xl text-sm font-semibold bg-transparent" disabled={submittingPassword}>
                        {submittingPassword ? "Actualizando..." : "Actualizar Contraseña"}
                    </Button>
                </form>

            </div>
        </div>
    );
}