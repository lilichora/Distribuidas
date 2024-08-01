import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Microservicios App</Link>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/usuarios">Usuarios</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/prestamos">Préstamos</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/pagos">Pagos</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/notificaciones">Notificaciones</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/libros">Libros</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/inventario">Inventario</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
