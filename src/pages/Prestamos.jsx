import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Alert, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

const Prestamos = () => {
    const [prestamos, setPrestamos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [libros, setLibros] = useState([]);
    const [show, setShow] = useState(false);
    const [editing, setEditing] = useState(false);
    const [currentPrestamo, setCurrentPrestamo] = useState({
        usuarioId: '',
        libroId: '',
        fechaPrestamo: '',
        fechaDevolucion: ''
    });
    const [error, setError] = useState('');
    const [fetchError, setFetchError] = useState('');

    useEffect(() => {
        fetchPrestamos();
        fetchUsuarios();
        fetchLibros();
    }, []);

    const fetchPrestamos = async () => {
        try {
            const response = await axios.get('http://localhost:8002/api/prestamos');
            setPrestamos(response.data);
        } catch (error) {
            console.error('Error fetching prestamos:', error);
            setFetchError('Error fetching prestamos. Please try again later.');
        }
    };

    const fetchUsuarios = async () => {
        try {
            const response = await axios.get('http://localhost:8001/api/usuarios');
            setUsuarios(response.data);
        } catch (error) {
            console.error('Error fetching usuarios:', error);
        }
    };

    const fetchLibros = async () => {
        try {
            const response = await axios.get('http://localhost:8005/api/libros');
            setLibros(response.data);
        } catch (error) {
            console.error('Error fetching libros:', error);
        }
    };

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        setEditing(false);
        setCurrentPrestamo({
            usuarioId: '',
            libroId: '',
            fechaPrestamo: '',
            fechaDevolucion: ''
        });
        setError('');
    };

    const handleSave = async () => {
        try {
            if (editing) {
                await axios.put(`http://localhost:8002/api/prestamos/editar/${currentPrestamo.id}`, currentPrestamo);
            } else {
                await axios.post('http://localhost:8002/api/prestamos/crear', currentPrestamo);
            }
            fetchPrestamos();
            handleClose();
        } catch (error) {
            setError('Error saving prestamo: ' + error.message);
        }
    };

    const handleEdit = (prestamo) => {
        setCurrentPrestamo(prestamo);
        setEditing(true);
        handleShow();
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8002/api/prestamos/eliminar/${id}`);
            fetchPrestamos();
        } catch (error) {
            console.error('Error deleting prestamo:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-primary">Préstamos</h1>
            <Button variant="success" onClick={handleShow}>
                <FontAwesomeIcon icon={faPlus} /> Crear Préstamo
            </Button>
            {fetchError && <Alert variant="danger" className="mt-3">{fetchError}</Alert>}
            <Table striped bordered hover className="mt-3">
                <thead>
                <tr>
                    <th>Usuario</th>
                    <th>Libro</th>
                    <th>Fecha Préstamo</th>
                    <th>Fecha Devolución</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {prestamos.map((prestamo) => (
                    <tr key={prestamo.id}>
                        <td>{usuarios.find(user => user.id === prestamo.usuarioId)?.nombre || 'Desconocido'}</td>
                        <td>{libros.find(libro => libro.id === prestamo.libroId)?.titulo || 'Desconocido'}</td>
                        <td>{prestamo.fechaPrestamo}</td>
                        <td>{prestamo.fechaDevolucion}</td>
                        <td>
                            <Button variant="warning" className="me-2" onClick={() => handleEdit(prestamo)}>
                                <FontAwesomeIcon icon={faEdit} />
                            </Button>
                            <Button variant="danger" onClick={() => handleDelete(prestamo.id)}>
                                <FontAwesomeIcon icon={faTrash} />
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{editing ? 'Editar Préstamo' : 'Crear Préstamo'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Usuario</Form.Label>
                            <Form.Select
                                value={currentPrestamo.usuarioId}
                                onChange={(e) => setCurrentPrestamo({ ...currentPrestamo, usuarioId: e.target.value })}
                            >
                                <option value="">Seleccionar Usuario</option>
                                {usuarios.map((usuario) => (
                                    <option key={usuario.id} value={usuario.id}>
                                        {usuario.nombre}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Libro</Form.Label>
                            <Form.Select
                                value={currentPrestamo.libroId}
                                onChange={(e) => setCurrentPrestamo({ ...currentPrestamo, libroId: e.target.value })}
                            >
                                <option value="">Seleccionar Libro</option>
                                {libros.map((libro) => (
                                    <option key={libro.id} value={libro.id}>
                                        {libro.titulo}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Fecha Préstamo</Form.Label>
                            <Form.Control
                                type="date"
                                value={currentPrestamo.fechaPrestamo}
                                onChange={(e) => setCurrentPrestamo({ ...currentPrestamo, fechaPrestamo: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Fecha Devolución</Form.Label>
                            <Form.Control
                                type="date"
                                value={currentPrestamo.fechaDevolucion}
                                onChange={(e) => setCurrentPrestamo({ ...currentPrestamo, fechaDevolucion: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Prestamos;
