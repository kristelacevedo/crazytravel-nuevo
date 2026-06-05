export default function AccountSecurity() {
  return (
    <div>
      <h3 style={{ color: '#0f766e', margin: '0 0 10px 0', fontSize: '20px', fontWeight: 700 }}>⚙️ Cuenta y Seguridad</h3>
      <p style={{ color: '#475569', fontSize: '14px', marginBottom: '20px' }}>Mantén tus credenciales de acceso actualizadas en la base de datos local.</p>
      
      <div style={{ display: 'grid', gap: '15px', maxWidth: '400px' }}>
        <div>
          <label className="form-label">Contraseña Actual</label>
          <input type="password" className="form-input" placeholder="••••••••" disabled />
        </div>
        <div>
          <label className="form-label">Nueva Contraseña</label>
          <input type="password" className="form-input" placeholder="Mínimo 8 caracteres" />
        </div>
        <button className="btn-auth-submit" style={{ padding: '10px' }}>Actualizar Contraseña</button>
      </div>
    </div>
  );
}