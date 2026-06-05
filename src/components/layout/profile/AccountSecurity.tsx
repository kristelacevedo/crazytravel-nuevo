import { useState } from 'react';
import type { FormEvent, CSSProperties } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';
import toast from 'react-hot-toast';

export default function AccountSecurity() {
  const { user } = useAuth();
  
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountLoading, setAccountLoading] = useState(false);
  const [accountMsg, setAccountMsg] = useState({ type: '', text: '' });

  // Cambiar correo electrónico
  const handleUpdateEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAccountMsg({ type: '', text: '' });
    
    if (!newEmail) {
      setAccountMsg({ type: 'error', text: 'Ingresa un nuevo correo electrónico.' });
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setAccountMsg({ type: 'error', text: 'Ingresa un correo electrónico válido.' });
      return;
    }

    setAccountLoading(true);
    try {
      const response = await api.put('/auth/email', { email: newEmail });
      if (response.status === 200) {
        setAccountMsg({ 
          type: 'success', 
          text: 'Te enviamos un enlace de confirmación al nuevo correo. Revisa tu bandeja de entrada.' 
        });
        setNewEmail('');
        toast.success('Correo actualizado correctamente');
      }
    } catch (err: any) {
      console.error('Error al actualizar email:', err);
      const errorMsg = err.response?.data?.error || 'Error al actualizar el correo';
      setAccountMsg({ type: 'error', text: errorMsg });
      toast.error(errorMsg);
    } finally {
      setAccountLoading(false);
    }
  };

  // Cambiar contraseña
  const handleUpdatePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAccountMsg({ type: '', text: '' });

    if (!currentPassword) {
      setAccountMsg({ type: 'error', text: 'Ingresa tu contraseña actual.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setAccountMsg({ type: 'error', text: 'Las contraseñas no coinciden.' });
      return;
    }
    
    if (newPassword.length < 8) {
      setAccountMsg({ type: 'error', text: 'La contraseña debe tener al menos 8 caracteres.' });
      return;
    }

    if (newPassword === currentPassword) {
      setAccountMsg({ type: 'error', text: 'La nueva contraseña debe ser diferente a la actual.' });
      return;
    }

    setAccountLoading(true);
    try {
      const response = await api.put('/auth/password', {
        current_password: currentPassword,
        new_password: newPassword
      });
      
      if (response.status === 200) {
        setAccountMsg({ type: 'success', text: '¡Tu contraseña ha sido actualizada exitosamente!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        toast.success('Contraseña actualizada correctamente');
      }
    } catch (err: any) {
      console.error('Error al actualizar contraseña:', err);
      const errorMsg = err.response?.data?.error || 'Error al actualizar la contraseña';
      setAccountMsg({ type: 'error', text: errorMsg });
      toast.error(errorMsg);
    } finally {
      setAccountLoading(false);
    }
  };

  return (
    <div>
      <h2 style={sectionTitleStyle}>Cuenta y Seguridad</h2>
      <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '32px' }}>
        Administra tus credenciales de acceso a la plataforma.
      </p>

      {accountMsg.text && (
        <div style={{ marginBottom: '20px', ...(accountMsg.type === 'success' ? successAlertStyle : errorAlertStyle) }}>
          {accountMsg.text}
        </div>
      )}

      {/* Formulario 1: Cambiar Correo */}
      <div style={cardBoxStyle}>
        <h3 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '16px' }}>Cambiar Correo Electrónico</h3>
        <form onSubmit={handleUpdateEmail} style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Correo Actual</label>
            <input 
              type="email" 
              value={user?.email || ''} 
              disabled 
              style={{ ...inputStyle, backgroundColor: '#f1f5f9', color: '#94a3b8', cursor: 'not-allowed' }} 
            />
          </div>
          <div>
            <label htmlFor="newEmail" style={labelStyle}>Nuevo Correo Electrónico</label>
            <input 
              id="newEmail" 
              type="email" 
              placeholder="Ingresa tu nuevo correo" 
              value={newEmail} 
              onChange={(e) => setNewEmail(e.target.value)} 
              required 
              style={inputStyle} 
            />
          </div>
          <button 
            type="submit" 
            disabled={accountLoading} 
            style={{ ...buttonStyle, width: 'auto', justifySelf: 'start' }}
          >
            {accountLoading ? 'Enviando...' : 'Actualizar Correo'}
          </button>
        </form>
      </div>

      <hr style={dividerStyle} />

      {/* Formulario 2: Cambiar Contraseña */}
      <div style={cardBoxStyle}>
        <h3 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '16px' }}>Cambiar Contraseña</h3>
        <form onSubmit={handleUpdatePassword} style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label htmlFor="currentPassword" style={labelStyle}>Contraseña Actual</label>
            <input 
              id="currentPassword" 
              type="password" 
              placeholder="Ingresa tu contraseña actual" 
              value={currentPassword} 
              onChange={(e) => setCurrentPassword(e.target.value)} 
              required 
              style={inputStyle} 
            />
          </div>
          <div style={twoColGrid}>
            <div>
              <label htmlFor="newPassword" style={labelStyle}>Nueva Contraseña</label>
              <input 
                id="newPassword" 
                type="password" 
                placeholder="Mínimo 8 caracteres" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                required 
                style={inputStyle} 
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" style={labelStyle}>Confirmar Contraseña</label>
              <input 
                id="confirmPassword" 
                type="password" 
                placeholder="Repite la contraseña" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                style={inputStyle} 
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={accountLoading} 
            style={{ ...buttonStyle, width: 'auto', justifySelf: 'start' }}
          >
            {accountLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
}

const sectionTitleStyle: CSSProperties = { fontSize: '24px', color: '#0f172a', marginBottom: '24px', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' };
const cardBoxStyle: CSSProperties = { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' };
const dividerStyle: CSSProperties = { border: 'none', borderTop: '1px solid #e2e8f0', margin: '32px 0' };
const twoColGrid: CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' };
const labelStyle: CSSProperties = { display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: '#1e293b' };
const inputStyle: CSSProperties = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box', fontSize: '15px', backgroundColor: '#fff', color: '#0f172a' };
const buttonStyle: CSSProperties = { padding: '14px 24px', borderRadius: '8px', border: 'none', background: '#0f766e', color: '#fff', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: 'background-color 0.2s' };
const successAlertStyle: CSSProperties = { padding: '12px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#16a34a', fontSize: '14px' };
const errorAlertStyle: CSSProperties = { padding: '12px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', color: '#dc2626', fontSize: '14px' };