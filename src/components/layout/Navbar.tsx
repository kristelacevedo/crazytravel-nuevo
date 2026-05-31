export default function Navbar() {
  return (
    <nav style={{
      backgroundColor: '#1e293b', 
      padding: '15px 30px',
      color: '#fff',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '24px' }}>✈️</span>
        <h2 style={{ margin: 0, fontSize: '20px', letterSpacing: '0.5px' }}>CrazyTravel</h2>
      </div>
      
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <span style={{ cursor: 'pointer', fontSize: '14px' }}>Inicio</span>
        <span style={{ cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', color: '#38bdf8' }}>Viajes</span>
        <span style={{ cursor: 'pointer', fontSize: '14px' }}>Mi Perfil</span>
        <span style={{ 
          background: '#22c55e', 
          padding: '6px 12px', 
          borderRadius: '20px', 
          fontSize: '12px', 
          fontWeight: 'bold' 
        }}>
          MySQL Activo
        </span>
      </div>
    </nav>
  );
}