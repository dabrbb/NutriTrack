import { useNavigate, Link, useLocation } from 'react-router-dom';
import Button from './Button';
import api from '../api';

export default function Layout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    const handleLogout = async () => {
        try {
            await api.post('/logout');
            localStorage.removeItem('token');
            navigate('/login');
        } catch (error) {
            console.error("Error logging out", error);
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans">
            <header className="bg-white border-b border-gray-100 h-16 flex items-center shadow-sm shadow-gray-500/5">
                <div className="max-w-7xl w-full mx-auto px-6 flex items-center">

                    <div className="flex items-center space-x-12">
                        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
                            <div className="bg-[#00C950] w-8 h-8 rounded-lg flex items-center justify-center shadow-md shadow-[#00C950]/20">
                                <span className="text-white font-bold text-lg leading-none">N</span>
                            </div>
                            <span className="text-[#1A1C1E] font-bold text-lg tracking-tight">NutriTrack</span>
                        </div>

                        <nav className="flex items-center space-x-6">
                            <Link to="/dashboard" className={`text-[13px] font-bold transition-all pb-1 border-b-2 ${isActive('/dashboard') ? 'text-[#00C950] border-[#00C950]' : 'text-gray-400 border-transparent hover:text-gray-600'}`}>
                                Inicio
                            </Link>
                            <Link to="/products" className={`text-[13px] font-bold transition-all pb-1 border-b-2 ${isActive('/products') ? 'text-[#00C950] border-[#00C950]' : 'text-gray-400 border-transparent hover:text-gray-600'}`}>
                                Productos
                            </Link>
                        </nav>
                    </div>

                    {/* Profile & Logout Group */}
                    <div className="ml-auto flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>

                        <Button
                            variant="ghost"
                            circle={true}
                            onClick={handleLogout}
                            className="w-9 h-9"
                            title="Cerrar sesión"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-10">
                {children}
            </main>
        </div>
    );
}