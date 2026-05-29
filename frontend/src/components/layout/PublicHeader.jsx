import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

export default function PublicHeader() {
    const navigate = useNavigate();
    return (
        <header className="bg-white border-b border-gray-100 h-16 flex items-center px-6">
            <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="bg-[#00C950] w-8 h-8 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">N</span>
                    </div>
                    <span className="text-[#1A1C1E] font-bold text-lg">NutriTrack</span>
                </div>
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigate('/login')} className="text-sm font-semibold text-gray-600 cursor-pointer hover:text-gray-900">
                        Iniciar sesión
                    </button>
                    <button onClick={() => navigate('/register')} className="bg-[#00C950] text-white text-sm font-semibold px-4 py-2 rounded-lg cursor-pointer hover:bg-[#00b347]">
                        Registrarse
                    </button>
                </div>
            </div>
        </header>
    );
}