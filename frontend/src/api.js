import axios from 'axios';

// Crea una instancia de Axios con la URL base para que no la dupliquemos en cada solicitud.
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
});

// Agrega un interceptor de solicitudes.
// Agrega automáticamente el encabezado de autorización a cada solicitud saliente,
// si se encuentra un token de acceso en localStorage.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        // Establece el token Bearer para la API de Laravel (Sanctum/Passport)
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;