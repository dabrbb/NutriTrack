import Button from '../ui/Button';
import AvatarUpload from './AvatarUpload';

export default function ProfileCard({ user, onEditClick, onLogoutClick, formatDate, onAvatarUpdated }) {

    return (
        <div className="bg-white p-8 mb-10 border border-gray-100 shadow-sm rounded-3xl">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">

                {/* Componente de carga y visualización de avatar */}
                <AvatarUpload
                    currentAvatarUrl={user.avatar_url}
                    onAvatarUpdated={onAvatarUpdated}
                />

                {/* El bloque principal con información del usuario */}
                <div className="flex-1 w-full text-center md:text-left">
                    <h2 className="text-2xl font-bold text-[#1A1C1E] mb-5">{user?.name}</h2>

                    {/* Cuadrícula de parámetros */}
                    <div className="grid grid-cols-3 gap-4 mb-6 max-w-md mx-auto md:mx-0">
                        <div>
                            <div className="text-[13px] font-bold text-gray-400 mb-1">Fecha de Nacimiento</div>
                            <div className="text-sm font-semibold text-[#1A1C1E]">{formatDate(user?.birthday)}</div>
                        </div>
                        <div>
                            <div className="text-[13px] font-bold text-gray-400 mb-1">Altura</div>
                            <div className="text-sm font-semibold text-[#1A1C1E]">{user?.height ? `${user.height} cm` : "—"}</div>
                        </div>
                        <div>
                            <div className="text-[13px] font-bold text-gray-400 mb-1">Peso</div>
                            <div className="text-sm font-semibold text-[#1A1C1E]">{user?.weight ? `${user.weight} kg` : "—"}</div>
                        </div>
                    </div>

                    {/* Gestión de cuentas */}
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <Button
                            className="w-full sm:w-auto py-2.5 px-5 mt-0 flex items-center justify-center gap-2 text-sm font-semibold rounded-xl shadow-none"
                            onClick={onEditClick}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Editar Perfil
                        </Button>

                        <Button
                            variant="ghost"
                            className="w-full sm:w-auto py-2.5 px-5 mt-0 flex items-center justify-center gap-2 text-sm font-semibold rounded-xl text-red-500 bg-transparent border border-red-200 hover:bg-red-50/50 shadow-none"
                            onClick={onLogoutClick}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Cerrar sesión
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}