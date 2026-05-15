import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import AuthCard from '../components/AuthCard';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await api.post('/login', { email, password });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                navigate('/dashboard');
            }
        } catch (error) {
            alert("Error: " + (error.response?.data?.message || "No se ha podido entrar"));
        }
    };

    return (
        <AuthCard 
            title="Iniciar sesión" 
            subtitle="¡Bienvenido de nuevo!"
        >
            <div className="space-y-5">
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
                    placeholder="Introduce tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <Button onClick={handleLogin}>
                Entrar
            </Button>

            <div className="mt-8 text-center flex flex-col sm:flex-row justify-center items-center gap-2 text-sm">
                <span className="text-gray-500 font-medium">¿No tienes una cuenta?</span>
                <button
                    className="text-[#00C950] font-bold hover:underline decoration-2 underline-offset-4 cursor-pointer"
                    onClick={() => navigate('/register')}>
                    Crear una cuenta
                </button>
            </div>
        </AuthCard>
    );
}