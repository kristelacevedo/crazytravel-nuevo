import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';

// ─── Importación de Páginas del Cliente ──────────────────────────────────────
import Viajes from './pages/client/Viajes';
import About from './pages/client/About';
import Profile from './pages/client/Profile';

// ─── Importación de Páginas de Autenticación ──────────────────────────────────
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import UpdatePassword from './pages/auth/UpdatePassword';
import AuthCallback from './pages/auth/AuthCallback';

export default function App() {
  return (
    <Router>
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', margin: 0, display: 'flex', flexDirection: 'column' }}>
        {/* El Navbar se mantiene fijo arriba en todas las pantallas */}
        <Navbar />
        
        {/* Contenedor dinámico que cambia según la URL */}
        <div style={{ flex: 1 }}>
          <Routes>
            {/* Rutas Principales */}
            <Route path="/" element={<Viajes />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />

            {/* Rutas del Módulo de Autenticación */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}