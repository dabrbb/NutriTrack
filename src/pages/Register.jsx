import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useState } from "react";
import AuthCard from '../components/AuthCard';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password_confirmation, setPassword_confirmation] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const response = await api.post('/register', {
                name,
                email,
                password,
                password_confirmation
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                navigate('/dashboard');
            }

        } catch (error) {
            console.error("Error al registrar: ", error.response?.data);
            alert("Error: " + (error.response?.data?.message || "No se ha podido registrarse"));
        }
    }
    return (
        <AuthCard
            title="Crear una cuenta"
            subtitle="Crea tu cuenta NutriTrack."
        >
            <div className="space-y-4">
                <Input
                    label="Nombre"
                    type="text"
                    placeholder="Introduce tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Input
                    label="Email"
                    type="email"
                    placeholder="Introduce tu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    label="Contraseña"
                    type="password"
                    placeholder="Crear una contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                    label="Confirmar Contraseña"
                    type="password"
                    placeholder="Confirma tu contraseña"
                    value={password_confirmation}
                    onChange={(e) => setPassword_confirmation(e.target.value)}
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