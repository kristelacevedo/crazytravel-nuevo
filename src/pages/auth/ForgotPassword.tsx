import { useState } from 'react';
import type { FormEvent, CSSProperties } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleReset = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    // Simulamos un retraso de red local para dar realismo antes de procesar con MySQL
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg('¡Enlace enviado con éxito de forma local! Revisa tu correo simulado para restablecer tu acceso.');
      setEmail('');
    }, 1000);
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <h1 className="auth-title">Recuperar contraseña</h1>
        <p className="auth-subtitle">
          Ingresa tu correo y procesaremos un enlace seguro para restablecer tu acceso a Crazy Travel en MySQL.
        </p>

        <form onSubmit={handleReset} style={{ display: 'grid', gap: '16px', textAlign: 'left' }}>
          <div>
            <label htmlFor="email" style={labelStyle}>Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>

          {/* Alertas */}
          {errorMsg && <div style={errorAlertStyle}>{errorMsg}</div>}
          {successMsg && <div style={successAlertStyle}>{successMsg}</div>}

          <button type="submit" disabled={loading} className="btn-auth-submit" style={{ opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Enviando enlace...' : 'Enviar enlace'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Link to="/login" style={{ fontSize: '15px', color: '#0f766e', fontWeight: 'bold', textDecoration: 'none' }}>
            ← Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

// Estilos de soporte para alertas
const labelStyle: CSSProperties = { display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: '#1e293b' };
const errorAlertStyle: CSSProperties = { padding: '12px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', color: '#dc2626', fontSize: '14px' };
const successAlertStyle: CSSProperties = { padding: '12px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#16a34a', fontSize: '14px' };