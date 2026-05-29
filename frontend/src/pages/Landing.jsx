import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicHeader from '../components/layout/PublicHeader';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Footer from '../components/landing/Footer';

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
        navigate('/dashboard');
    }
}, [navigate]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans flex flex-col">
      <PublicHeader />
      <Hero onStart={() => navigate('/register')} onLogin={() => navigate('/login')} />
      <Features />
      <Footer />
    </div>
  );
}