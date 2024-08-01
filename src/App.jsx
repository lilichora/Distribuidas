import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Usuarios from './pages/Usuarios';
import Prestamos from './pages/Prestamos'; // Asegúrate de tener el componente Prestamos
import Pagos from './pages/Pagos'; // Asegúrate de tener el componente Pagos
import Notificaciones from './pages/Notificaciones'; // Asegúrate de tener el componente Notificaciones
import Libros from './pages/Libros'; // Asegúrate de tener el componente Libros
import Inventario from './pages/Inventario'; // Asegúrate de tener el componente Inventario

const App = () => {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/prestamos" element={<Prestamos />} />
                <Route path="/pagos" element={<Pagos />} />
                <Route path="/notificaciones" element={<Notificaciones />} />
                <Route path="/libros" element={<Libros />} />
                <Route path="/inventario" element={<Inventario />} />
            </Routes>
        </>
    );
};

export default App;
