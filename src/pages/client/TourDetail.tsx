import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function TourDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    // Datos del tour (hardcodeados para prueba)
    const tour = {
        id: Number(id),
        titulo: "Aventura en Torres del Paine",
        destino: "Torres del Paine, Chile",
        descripcion: "Descubre los paisajes más impresionantes de la Patagonia chilena. Un viaje increíble lleno de aventura y naturaleza.",
        precio: 899990,
        duracion: "5 días / 4 noches",
        cupo_disponible: 15,
        fecha_salida: "15 de Diciembre 2024",
        imagen: "https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f"
    };

    const handleReserva = () => {
        alert(`✅ Reserva creada para ${tour.titulo}\nTotal: $${tour.precio.toLocaleString()} CLP`);
        setShowModal(false);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Hero */}
            <div className="relative h-80 overflow-hidden">
                <img 
                    src={tour.imagen} 
                    alt={tour.titulo}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-end">
                    <div className="container mx-auto px-4 py-6">
                        <h1 className="text-3xl md:text-4xl font-bold text-white">{tour.titulo}</h1>
                        <p className="text-white/80 mt-1">{tour.destino}</p>
                    </div>
                </div>
            </div>

            {/* Contenido */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Info */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                        <h2 className="text-2xl font-bold mb-3">Descripción</h2>
                        <p className="text-gray-600">{tour.descripcion}</p>
                        
                        <h2 className="text-2xl font-bold mt-6 mb-3">Itinerario</h2>
                        <div className="space-y-3">
                            <div className="border-l-4 border-orange-500 pl-3">
                                <p className="font-semibold">Día 1: Llegada</p>
                                <p className="text-gray-500 text-sm">Bienvenida y check-in.</p>
                            </div>
                            <div className="border-l-4 border-orange-500 pl-3">
                                <p className="font-semibold">Día 2: Excursión Base Torres</p>
                                <p className="text-gray-500 text-sm">Caminata guiada de 8 horas.</p>
                            </div>
                            <div className="border-l-4 border-orange-500 pl-3">
                                <p className="font-semibold">Día 3: Navegación Lago Grey</p>
                                <p className="text-gray-500 text-sm">Recorrido en barco.</p>
                            </div>
                        </div>
                    </div>

                    {/* Card Reserva */}
                    <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-24">
                        <div className="text-center mb-4">
                            <span className="text-3xl font-bold text-orange-500">
                                ${tour.precio.toLocaleString()}
                            </span>
                            <span className="text-gray-500"> CLP</span>
                        </div>

                        <div className="space-y-3 text-sm mb-6">
                            <div className="flex justify-between py-2 border-b">
                                <span>📅 Duración</span>
                                <span className="font-semibold">{tour.duracion}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span>📆 Salida</span>
                                <span>{tour.fecha_salida}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span>✅ Cupos</span>
                                <span className="text-green-600">{tour.cupo_disponible} disponibles</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowModal(true)}
                            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
                        >
                            Reservar ahora
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
                        <h2 className="text-xl font-bold mb-4">Confirmar reserva</h2>
                        <p className="text-gray-600 mb-4">
                            ¿Deseas reservar <strong>{tour.titulo}</strong>?
                        </p>
                        <div className="bg-gray-100 rounded p-3 mb-4">
                            <p className="text-sm text-gray-500">Total a pagar:</p>
                            <p className="text-xl font-bold text-orange-500">${tour.precio.toLocaleString()} CLP</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-2 border border-gray-300 rounded-lg"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleReserva}
                                className="flex-1 bg-orange-500 text-white py-2 rounded-lg"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}