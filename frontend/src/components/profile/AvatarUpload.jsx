import { useState, useRef } from 'react';
import api from '../../api';

export default function AvatarUpload({ currentAvatarUrl, onAvatarUpdated }) {
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecciona un archivo de imagen válido.');
            return;
        }

        const formData = new FormData();
        formData.append('avatar', file);

        setUploading(true);
        try {
            const response = await api.post('/profile/avatar', formData);

            if (onAvatarUpdated) {
                onAvatarUpdated(response.data.data);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="w-24 h-24 rounded-full bg-[#00C950] flex items-center justify-center text-white shadow-xl shadow-[#00C950]/20 overflow-hidden relative group">
                {currentAvatarUrl ? (
                    <img
                        src={currentAvatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
            <button
                type="button"
                onClick={handleButtonClick}
                disabled={uploading}
                className="text-xs font-bold text-[#00C950] bg-white px-3 py-1.5 rounded-full border border-dashed border-[#00C950]/50 hover:bg-[#00C950]/5 transition-colors duration-200 disabled:opacity-60 cursor-pointer"
            >
                {uploading ? 'Subiendo...' : 'Subir Foto'}
            </button>
        </div>
    );
}