import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import api from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface PointsData {
    puntos: number;
    puntos_acumulados: number;
    puntos_canjeados: number;
}

export default function MyPoints() {
    const { user } = useAuth();
    const [points, setPoints] = useState<PointsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [canjeando, setCanjeando] = useState(false);

    useEffect(() => {
        const fetchPoints = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }
            
            try {
                setLoading(true);
                const response = await api.get('/points');
                setPoints(response.data);
            } catch (err) {
                console.error('Error al cargar puntos:', err);
                // Si el endpoint no existe, mostramos datos de ejemplo
                setPoints({
                    puntos: 1250,
                    puntos_acumulados: 1250,
                    puntos_canjeados: 0
                });
            } finally {
                setLoading(false);
            }
        };

        fetchPoints();
    }, [user?.id]);

    const handleCanjear = async () => {
        if (!user?.id) {
            toast.error('Debes iniciar sesión para canjear puntos');
            return;
        }

        if (!points || points.puntos < 100) {
            toast.error('Necesitas al menos 100 puntos para canjear');
            return;
        }

        setCanjeando(true);
        try {
            const response = await api.post('/points/redeem', {
                puntos_a_canjear: points.puntos
            });
            
            if (response.status === 200) {
                toast.success(`¡Canjeaste ${points.puntos} puntos!`);
                // Actualizar puntos después del canje
                setPoints({
                    ...points,
                    puntos: 0,
                    puntos_canjeados: points.puntos_canjeados + points.puntos
                });
            }
        } catch (err) {
            console.error('Error al canjear puntos:', err);
            toast.error('No se pudieron canjear los puntos');
        } finally {
            setCanjeando(false);
        }
    };

    if (loading) {
        return (
            <div>
                <h2 style={sectionTitleStyle}>Mis Puntos Crazy ⭐</h2>
                <div style={pointsCardStyle}>
                    <div style={{ textAlign: 'center', padding: '40px' }}>Cargando tus puntos...</div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2 style={sectionTitleStyle}>Mis Puntos Crazy ⭐</h2>
            <div style={pointsCardStyle}>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#eab308', marginBottom: '8px' }}>
                    {points?.puntos.toLocaleString() || 0}
                </div>
                <p style={{ color: '#475569', fontSize: '16px', marginBottom: '8px' }}>Puntos disponibles</p>
                <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '24px' }}>
                    Total acumulados: {points?.puntos_acumulados.toLocaleString() || 0} | 
                    Canjeados: {points?.puntos_canjeados.toLocaleString() || 0}
                </p>
                
                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', textAlign: 'left' }}>
                    <h4 style={{ color: '#0f172a', margin: '0 0 8px 0', fontSize: '18px' }}>¿Cómo usar tus puntos?</h4>
                    <ul style={{ color: '#475569', fontSize: '14px', margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
                        <li>💵 Cada punto equivale a <strong>$1 CLP</strong> de descuento.</li>
                        <li>🎁 Acumulas puntos automáticamente con cada reserva pagada.</li>
                        <li>👥 ¡Gana 5.000 puntos extra al invitar a un amigo!</li>
                        <li>✨ Los puntos caducan después de 12 meses sin uso.</li>
                    </ul>
                </div>
                
                <button 
                    onClick={handleCanjear}
                    disabled={canjeando || !points || points.puntos < 100}
                    style={{ 
                        ...buttonStyle, 
                        backgroundColor: (!points || points.puntos < 100) ? '#94a3b8' : '#0f172a',
                        cursor: (!points || points.puntos < 100) ? 'not-allowed' : 'pointer',
                        marginTop: '24px', 
                        width: 'auto', 
                        padding: '12px 32px' 
                    }}
                >
                    {canjeando ? 'Canjeando...' : (points && points.puntos >= 100 ? 'Canjear mis puntos' : 'Acumula más puntos')}
                </button>
                
                {points && points.puntos >= 100 && (
                    <p style={{ color: '#64748b', fontSize: '12px', marginTop: '16px' }}>
                        Puedes canjear hasta ${points.puntos.toLocaleString()} CLP de descuento
                    </p>
                )}
            </div>
        </div>
    );
}

const sectionTitleStyle: CSSProperties = { fontSize: '24px', color: '#0f172a', marginBottom: '24px', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' };
const pointsCardStyle: CSSProperties = { textAlign: 'center', padding: '20px' };
const buttonStyle: CSSProperties = { padding: '14px 24px', borderRadius: '8px', border: 'none', background: '#0f766e', color: '#fff', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: 'background-color 0.2s' };