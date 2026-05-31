import { useEffect, useState } from 'react';
import axios from 'axios';

interface Viaje {
  destino: string;
  descripcion: string;
  precio: number;
}

export default function App() {
  const [viajes, setViajes] = useState<Viaje[]>([]);

  useEffect(() => {
    // Esto va a buscar tus viajes a tu MySQL (si tu backend está apagado, usará los de prueba de abajo)
    axios.get('http://localhost:3000/api/viajes') 
      .then(response => setViajes(response.data))
      .catch(() => {
        setViajes([
          { destino: 'Torres del Paine, Chile', descripcion: 'Un trekking inolvidable por la Patagonia.', precio: 350000 },
          { destino: 'San Pedro de Atacama', descripcion: 'Disfruta de los géiseres y el Valle de la Luna.', precio: 220000 },
          { destino: 'Isla de Pascua', descripcion: 'Descubre los misterios de los Moais.', precio: 580000 }
        ]);
      });
  }, []);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh', margin: 0 }}>
      
      {/* Barra de arriba */}
      <nav style={{ backgroundColor: '#2c3e50', padding: '20px', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0 }}>✈️ Crazy Travel</h2>
        <span style={{ background: '#27ae60', padding: '5px 10px', borderRadius: '4px' }}>Modo Local: MySQL</span>
      </nav>

      {/* Título */}
      <header style={{ textAlign: 'center', padding: '40px 20px' }}>
        <h1>Encuentra tu Próximo Destino</h1>
        <p style={{ color: '#7f8c8d' }}>Explora los tours disponibles para ti.</p>
      </header>

      {/* Tarjetas de Viajes */}
      <main style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', padding: '20px' }}>
        {viajes.map((viaje, index) => (
          <div key={index} style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '280px', padding: '20px' }}>
            <h3 style={{ color: '#2c3e50', marginTop: 0 }}>{viaje.destino}</h3>
            <p style={{ color: '#7f8c8d', fontSize: '14px' }}>{viaje.descripcion}</p>
            <div style={{ color: '#e74c3c', fontWeight: 'bold', fontSize: '18px', marginTop: '15px' }}>
              ${viaje.precio.toLocaleString('es-CL')}
            </div>
          </div>
        ))}
      </main>

    </div>
  );
}