export default function MyPoints() {
  return (
    <div>
      <h3 style={{ color: '#0f766e', margin: '0 0 10px 0', fontSize: '20px', fontWeight: 700 }}>⭐ Mis Puntos Crazy</h3>
      <p style={{ color: '#475569', fontSize: '14px', marginBottom: '20px' }}>Acumula puntos viajando por el mundo y canjéalos por descuentos.</p>
      
      <div style={{ padding: '25px', background: 'linear-gradient(135deg, #0f766e, #0d9488)', borderRadius: '16px', color: '#ffffff', maxWidth: '350px', boxShadow: '0 10px 15px -3px rgba(15, 118, 110, 0.2)' }}>
        <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8, fontWeight: 600 }}>Balance Actual</span>
        <h4 style={{ fontSize: '36px', fontWeight: 900, margin: '5px 0' }}>1,500 <span style={{ fontSize: '18px', fontWeight: 500 }}>PTS</span></h4>
        <p style={{ fontSize: '13px', margin: 0, opacity: 0.9 }}>Equivale a $15.000 CLP de descuento en tu próximo destino.</p>
      </div>
    </div>
  );
}