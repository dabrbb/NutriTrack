import { useNavigate, Link, useLocation } from 'react-router-dom';
import Button from '../ui/Button';
import api from '../../api';
import { useUser } from '../hooks/UserContext';

export default function Layout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    const { user } = useUser();

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

    const getAvatarUrl = () => {
        if (!user?.avatar_path) return null;
        if (user.avatar_path.startsWith('http')) return user.avatar_path;

        const rootUrl = api.defaults.baseURL.replace('/api', '');
        return `${rootUrl}/storage/${user.avatar_path}`;
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans">
            <header className="bg-white border-b border-gray-100 h-16 flex items-center shadow-sm shadow-gray-500/5">
                <div className="max-w-7xl w-full mx-auto px-6 flex items-center">

                    <div className="flex items-center space-x-12">
                        <div
                            className="flex items-center space-x-3 cursor-pointer"
                            onClick={() => navigate('/dashboard')}
                        >
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
                        <div
                            className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-100/70 transition-colors"
                            onClick={() => navigate('/profile')}
                        >
                            {user?.avatar_path ? (
                                <img
                                    src={getAvatarUrl()}
                                    alt="Avatar"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            ) : (
                                <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            )}
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