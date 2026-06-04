const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Crazy Travel API funcionando' });
});

// Ruta para obtener todos los tours
app.get('/api/tours', (req, res) => {
    res.json([
        { id: 1, titulo: 'Aventura en Torres del Paine', precio: 899990, destino: 'Torres del Paine', imagen: 'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f' },
        { id: 2, titulo: 'Desierto de Atacama', precio: 699990, destino: 'San Pedro de Atacama', imagen: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21' }
    ]);
});

// Ruta para obtener un tour específico
app.get('/api/tours/:id', (req, res) => {
    res.json({ 
        id: req.params.id, 
        titulo: 'Detalle del tour',
        descripcion: 'Descripción completa del tour...',
        precio: 899990,
        itinerario: [
            { dia: 1, actividad: 'Llegada y bienvenida' },
            { dia: 2, actividad: 'Excursión principal' }
        ]
    });
});

// Ruta de login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    res.json({ 
        message: 'Login exitoso', 
        token: 'fake-token-12345',
        user: { id: 1, nombre: 'Usuario Test', email: email }
    });
});

// Ruta de registro
app.post('/api/auth/register', (req, res) => {
    const { nombre, email, password } = req.body;
    res.json({ 
        message: 'Registro exitoso',
        token: 'fake-token-12345',
        user: { id: 1, nombre: nombre, email: email }
    });
});

// Ruta para crear reserva
app.post('/api/reservas', (req, res) => {
    res.json({ 
        message: 'Reserva creada exitosamente',
        reserva_id: Math.floor(Math.random() * 1000),
        monto_total: 899990
    });
});

// Iniciar servidor
app.listen(3001, () => {
    console.log('🚀 Servidor corriendo en http://localhost:3001');
    console.log('📋 Prueba la API en: http://localhost:3001/api/health');
});