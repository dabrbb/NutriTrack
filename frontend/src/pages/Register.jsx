import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useState } from "react";
import AuthCard from '../components/auth/AuthCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password_confirmation, setPassword_confirmation] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleRegister = async () => {
        // Borrar los errores anteriores antes de intentar enviar de nuevo
        setErrors({});

        try {
            const response = await api.post('/register', {
                name,
                email,
                password,
                password_confirmation
            });

            // Guardamos el token recibido y redirigimos al usuario
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                navigate('/dashboard');
            }

        } catch (error) {
            // Manejo de errores de validación de Laravel (estado 422)
            if (error.response?.status === 422) {
                setErrors(error.response.data);
            } else {
                // Manejo de otros errores (errores del servidor o problemas de red)
                setErrors({ general: error.response?.data?.message || "Error en el registro" });
            }
        }
    }
    return (
        <AuthCard
            title="Crear una cuenta"
            subtitle="Crea tu cuenta NutriTrack."
        >
            <div className="space-y-4">
                {/* Muestra un error general si lo hay */}
                {errors.general && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                        {errors.general}
                    </div>
                )}

                {/* Pasa los errores de validación a cada campo Input.
                    Laravel devuelve los errores como un array para cada campo,
                    así que tomamos el elemento [0].
                */}
                <Input
                    label="Nombre"
                    type="text"
                    placeholder="Introduce tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={errors.name ? errors.name[0] : null}
                />
                <Input
                    label="Email"
                    type="email"
                    placeholder="Introduce tu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email ? errors.email[0] : null}
                />
                <Input
                    label="Contraseña"
                    type="password"
                    placeholder="Crear una contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password ? errors.password[0] : null}
                />
                <Input
                    label="Confirmar Contraseña"
                    type="password"
                    placeholder="Confirma tu contraseña"
                    value={password_confirmation}
                    onChange={(e) => setPassword_confirmation(e.target.value)}
                    error={errors.password_confirmation ? errors.password_confirmation[0] : null}
                />
            </div>

            <Button onClick={handleRegister}>
                Crear una cuenta
            </Button>

            <div className="mt-8 text-center flex flex-col sm:flex-row justify-center items-center gap-2 text-sm">
                <span className="text-gray-500 font-medium">¿Ya tienes una cuenta?</span>
                <button
                    className="text-[#00C950] font-bold hover:underline decoration-2 underline-offset-4 cursor-pointer"
                    onClick={() => navigate('/login')}
                >
                    Iniciar sesión
                </button>
            </div>
        </AuthCard>
    )
}