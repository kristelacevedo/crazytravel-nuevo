import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import api from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

interface Reserva {
    id: number;
    tour_titulo: string;
    destino: string;
    fecha_salida: string;
    cantidad_personas: number;
    monto_total: number;
    estado: string;
    imagen_principal: string;
}

export default function MyTrips() {
    const { user } = useAuth();
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReservas = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }
            
            try {
                setLoading(true);
                const response = await api.get('/reservas/mis-reservas');
                setReservas(response.data);
            } catch (err) {
                console.error('Error al cargar reservas:', err);
                setError('No se pudieron cargar tus reservas');
            } finally {
                setLoading(false);
            }
        };

        fetchReservas();
    }, [user?.id]);

    const getEstadoBadge = (estado: string) => {
        switch (estado) {
            case 'pagado':
                return { text: '✅ Pagado', style: { ...badgeStyle, backgroundColor: '#dcfce7', color: '#166534' } };
            case 'pendiente':
                return { text: '⏳ Pendiente', style: { ...badgeStyle, backgroundColor: '#fef3c7', color: '#92400e' } };
            case 'cancelado':
                return { text: '❌ Cancelado', style: { ...badgeStyle, backgroundColor: '#fee2e2', color: '#991b1b' } };
            default:
                return { text: estado, style: badgeStyle };
        }
    };

    if (loading) {
        return (
            <div>
                <h2 style={sectionTitleStyle}>Mis Viajes</h2>
                <div style={emptyStateStyle}>Cargando tus reservas...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <h2 style={sectionTitleStyle}>Mis Viajes</h2>
                <div style={emptyStateStyle}>{error}</div>
            </div>
        );
    }

    return (
        <div>
            <h2 style={sectionTitleStyle}>Mis Viajes</h2>
            {reservas.length === 0 ? (
                <div style={emptyStateStyle}>
                    No tienes viajes programados aún.
                    <br />
                    <a href="/viajes" style={{ color: '#0f766e', marginTop: '10px', display: 'inline-block' }}>Explorar tours →</a>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                    {reservas.map((reserva) => {
                        const badge = getEstadoBadge(reserva.estado);
                        return (
                            <div key={reserva.id} style={bookingCardStyle}>
                                <img 
                                    src={reserva.imagen_principal || 'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f'} 
                                    alt={reserva.tour_titulo} 
                                    style={bookingImageStyle} 
                                />
                                <div style={{ padding: '16px', flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                        <h3 style={{ fontSize: '18px', color: '#0f172a', margin: 0 }}>{reserva.tour_titulo}</h3>
                                        <span style={badge.style}>{badge.text}</span>
                                    </div>
                                    <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 4px 0' }}>📅 Salida: {new Date(reserva.fecha_salida).toLocaleDateString('es-CL')}</p>
                                    <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 4px 0' }}>👥 Personas: {reserva.cantidad_personas}</p>
                                    <p style={{ fontSize: '14px', color: '#0f766e', fontWeight: 'bold', margin: '0' }}>💰 Total: ${reserva.monto_total.toLocaleString()} CLP</p>
                                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: '8px 0 0 0' }}>ID Reserva: {reserva.id}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

const sectionTitleStyle: CSSProperties = { fontSize: '24px', color: '#0f172a', marginBottom: '24px', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' };
const emptyStateStyle: CSSProperties = { padding: '40px 20px', textAlign: 'center', border: '1px dashed #cbd5e1', color: '#64748b', borderRadius: '12px' };
const bookingCardStyle: CSSProperties = { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', overflow: 'hidden' };
const bookingImageStyle: CSSProperties = { width: '150px', objectFit: 'cover' };
const badgeStyle: CSSProperties = { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' };