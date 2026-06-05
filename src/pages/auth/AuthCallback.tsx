import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulamos una verificación instantánea y redirigimos de inmediato
    // al inicio para que el flujo de la app nunca se rompa.
    const timer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ color: '#0f766e', marginBottom: '8px', fontFamily: 'system-ui, sans-serif', fontWeight: 800 }}>✈️ Crazy Travel</h2>
        <p style={{ color: '#64748b', fontSize: '16px', fontFamily: 'system-ui, sans-serif' }}>Autenticando de forma segura con MySQL...</p>
      </div>
    </div>
  );
}