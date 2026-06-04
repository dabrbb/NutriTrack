import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicHeader from '../components/layout/PublicHeader';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Footer from '../components/landing/Footer';

export default function Landing() {
  const navigate = useNavigate();

  // Protección de acceso: si el usuario ya está autorizado (tiene un token),
  // lo redirigimos a su cuenta personal, ya que no necesita una página de inicio.
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans flex flex-col">
      <PublicHeader />

      {/* Pasar callbacks para la navegación en la sección Hero */}
      <Hero onStart={() => navigate('/register')} onLogin={() => navigate('/login')} />
      <Features />
      <Footer />
    </div>
  );
}