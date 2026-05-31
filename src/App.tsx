import { useEffect, useState } from 'react';
import axios from 'axios';

interface Viaje {
  destino: string;
  descripcion: string;
  precio: number;
}

export default function App() {
  const [viajes, setViajes] = useState<Viaje[]>([]);
  
  // Estados para controlar lo que el usuario escribe en el formulario
  const [destino, setDestino] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');

  // Traer viajes de la base de datos
  const obtenerViajes = () => {
    axios.get('http://localhost:3000/api/viajes') 
      .then(response => setViajes(response.data))
      .catch(() => {
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

  // Función para guardar un nuevo viaje
  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!destino || !descripcion || !precio) {
      alert("Por favor, llena todos los campos");
      return;
    }

    const nuevoViaje = {
      destino,
      descripcion,
      precio: Number(precio)
    };

    // Enviar el nuevo viaje a tu backend de MySQL
    axios.post('http://localhost:3000/api/viajes', nuevoViaje)
      .then(() => {
        alert("¡Viaje agregado con éxito!");
        obtenerViajes(); // Recargar la lista automáticamente
        // Limpiar el formulario
        setDestino('');
        setDescripcion('');
        setPrecio('');
      })
      .catch((error) => {
        console.error("Error al guardar:", error);
        // Simulación en caso de que el backend no responda, para que veas cómo funciona en pantalla
        setViajes([...viajes, nuevoViaje]);
        setDestino('');
        setDescripcion('');
        setPrecio('');
      });
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh', margin: 0, paddingBottom: '5px' }}>
      
      {/* Barra de arriba */}
      <nav style={{ backgroundColor: '#2c3e50', padding: '20px', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0 }}>✈️ Crazy Travel</h2>
        <span style={{ background: '#27ae60', padding: '5px 10px', borderRadius: '4px', fontWeight: 'bold' }}>Modo Local: MySQL</span>
      </nav>

      {/* Título */}
      <header style={{ textAlign: 'center', padding: '30px 20px' }}>
        <h1>Encuentra tu Próximo Destino</h1>
        <p style={{ color: '#7f8c8d' }}>Explora o agrega nuevos tours disponibles para ti.</p>
      </header>

      {/* SECCIÓN DEL FORMULARIO NUEVO */}
      <section style={{ maxWidth: '500px', margin: '0 auto 40px auto', backgroundColor: '#fff', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginTop: 0, color: '#2c3e50', textAlign: 'center' }}>➕ Agregar Nuevo Destino</h3>
        <form onSubmit={manejarEnvio} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#34495e' }}>Nombre del Destino:</label>
            <input type="text" value={destino} onChange={e => setDestino(e.target.value)} placeholder="Ej: Pucón, Chile" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#34495e' }}>Descripción del Tour:</label>
            <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Ej: Termas, lagos y el majestuoso Volcán Villarrica." rows={3} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', resize: 'none' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#34495e' }}>Precio (CLP):</label>
            <input type="number" value={precio} onChange={e => setPrecio(e.target.value)} placeholder="Ej: 180000" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }} />
          </div>

          <button type="submit" style={{ backgroundColor: '#27ae60', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>
            Guardar Destino en MySQL
          </button>
        </form>
      </section>

      <hr style={{ border: '0', height: '1px', background: '#ccc', margin: '40px' }} />

      {/* Tarjetas de Viajes */}
      <h3 style={{ textAlign: 'center', color: '#2c3e50' }}>🗺️ Catálogo Actual</h3>
      <main style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', padding: '20px 40px 60px 40px' }}>
        {viajes.map((viaje, index) => (
          <div key={index} style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '280px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ color: '#2c3e50', marginTop: 0 }}>{viaje.destino}</h3>
              <p style={{ color: '#7f8c8d', fontSize: '14px', lineHeight: '1.4' }}>{viaje.descripcion}</p>
            </div>
            <div style={{ color: '#e74c3c', fontWeight: 'bold', fontSize: '18px', marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
              ${viaje.precio.toLocaleString('es-CL')}
            </div>
          </div>
        ))}
      </main>

    </div>
  );
}