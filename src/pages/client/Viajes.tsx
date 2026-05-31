import { useEffect, useState } from 'react';
import axios from 'axios';

interface Viaje {
  id_viaje?: number;
  destino: string;
  descripcion: string;
  precio: number;
}

export default function Viajes() {
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [destino, setDestino] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');

  const obtenerViajes = () => {
    axios.get('http://localhost:3000/api/viajes') 
      .then(response => setViajes(response.data))
      .catch(() => {
        // Datos de respaldo por si acaso
        setViajes([
          { destino: 'Torres del Paine, Chile', descripcion: 'Un trekking inolvidable por la Patagonia.', precio: 350000 },
          { destino: 'San Pedro de Atacama', descripcion: 'Disfruta de los géiseres y el Valle de la Luna.', precio: 220000 },
          { destino: 'Isla de Pascua', descripcion: 'Descubre los misterios de los Moais.', precio: 580000 }
        ]);
      });
  };

  useEffect(() => {
    obtenerViajes();
  }, []);

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destino || !descripcion || !precio) {
      alert("Por favor, llena todos los campos");
      return;
    }

    const nuevoViaje = { destino, descripcion, precio: Number(precio) };

    axios.post('http://localhost:3000/api/viajes', nuevoViaje)
      .then(() => {
        alert("¡Viaje agregado con éxito!");
        obtenerViajes();
        setDestino(''); setDescripcion(''); setPrecio('');
      })
      .catch(() => {
        setViajes([...viajes, nuevoViaje]);
        setDestino(''); setDescripcion(''); setPrecio('');
      });
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#1e293b', margin: 0 }}>Gestión de Destinos Turísticos</h1>
        <p style={{ color: '#64748b' }}>Administra el catálogo de la agencia en tiempo real</p>
      </header>

      {/* Formulario */}
      <section style={{ maxWidth: '500px', margin: '0 auto 40px auto', backgroundColor: '#fff', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        <h3 style={{ marginTop: 0, color: '#1e293b', textAlign: 'center' }}>➕ Agregar Nuevo Destino</h3>
        <form onSubmit={manejarEnvio} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#475569' }}>Nombre del Destino:</label>
            <input type="text" value={destino} onChange={e => setDestino(e.target.value)} placeholder="Ej: Pucón, Chile" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#475569' }}>Descripción del Tour:</label>
            <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Ej: Termas y paisajes hermosos." rows={3} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', resize: 'none' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#475569' }}>Precio (CLP):</label>
            <input type="number" value={precio} onChange={e => setPrecio(e.target.value)} placeholder="Ej: 180000" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
          </div>

          <button type="submit" style={{ backgroundColor: '#22c55e', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
            Guardar Destino en MySQL
          </button>
        </form>
      </section>

      <hr style={{ border: '0', height: '1px', background: '#cbd5e1', margin: '40px 0' }} />

      {/* Catálogo */}
      <h3 style={{ textAlign: 'center', color: '#1e293b', marginBottom: '20px' }}>🗺️ Catálogo de Viajes</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '25px', justifyContent: 'center' }}>
        {viajes.map((viaje, index) => (
          <div key={index} style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', width: '280px', padding: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ color: '#1e293b', marginTop: 0 }}>{viaje.destino}</h3>
              <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.4' }}>{viaje.descripcion}</p>
            </div>
            <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '18px', marginTop: '15px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
              ${viaje.precio.toLocaleString('es-CL')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}