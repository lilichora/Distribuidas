import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Pagos = () => {
    const [pagos, setPagos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [libros, setLibros] = useState([]);
    const [show, setShow] = useState(false);
    const [editing, setEditing] = useState(false);
    const [currentPago, setCurrentPago] = useState({
        id: '',
        usuarioId: '',
        libroId: '',
        monto: '',
        fechaPago: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPagos();
        fetchUsuarios();
        fetchLibros();
    }, []);

    const fetchPagos = async () => {
        try {
            const response = await axios.get('http://18.119.120.45:8003/api/pagos');
            setPagos(response.data);
        } catch (error) {
            console.error('Error fetching pagos:', error);
            setError('Error fetching pagos');
        }
    };

    const fetchUsuarios = async () => {
        try {
            const response = await axios.get('http://18.119.120.45:8001/api/usuarios');
            setUsuarios(response.data);
        } catch (error) {
            console.error('Error fetching usuarios:', error);
            setError('Error fetching usuarios');
        }
    };

    const fetchLibros = async () => {
        try {
            const response = await axios.get('http://18.119.120.45:8005/api/libros');
            setLibros(response.data);
        } catch (error) {
            console.error('Error fetching libros:', error);
            setError('Error fetching libros');
        }
    };

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        setEditing(false);
        setCurrentPago({
            id: '',
            usuarioId: '',
            libroId: '',
            monto: '',
            fechaPago: ''
        });
        setError('');
    };

    const handleSave = async () => {
        try {
            if (editing) {
                await axios.put(`http://18.119.120.45:8003/api/pagos/editar/${currentPago.id}`, currentPago);
            } else {
                await axios.post('http://18.119.120.45:8003/api/pagos/crear', currentPago);
            }
            fetchPagos();
            handleClose();
        } catch (error) {
            setError('Error saving pago: ' + error.message);
        }
    };

    const handleEdit = (pago) => {
        setCurrentPago(pago);
        setEditing(true);
        handleShow();
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://18.119.120.45:8003/api/pagos/eliminar/${id}`);
            fetchPagos();
        } catch (error) {
            console.error('Error deleting pago:', error);
            setError('Error deleting pago');
        }
    };

    return (
        <div className="container mt-5">
            <h1>Pagos</h1>
            <Button variant="primary" onClick={handleShow}>
                Crear Pago
            </Button>
            <table className="table mt-3 table-striped table-bordered">
                <thead>
                <tr>
                    <th>Usuario</th>
                    <th>Libro</th>
                    <th>Monto</th>
                    <th>Fecha de Pago</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {pagos.map((pago) => (
                    <tr key={pago.id}>
                        <td>{usuarios.find(user => user.id === pago.usuarioId)?.nombre || 'Desconocido'}</td>
                        <td>{libros.find(libro => libro.id === pago.libroId)?.titulo || 'Desconocido'}</td>
                        <td>{pago.monto}</td>
                        <td>{new Date(pago.fechaPago).toLocaleDateString()}</td>
                        <td>
                            <Button variant="warning" onClick={() => handleEdit(pago)}>
                                <FaEdit />
                            </Button>
                            <Button variant="danger" onClick={() => handleDelete(pago.id)}>
                                <FaTrash />
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{editing ? 'Editar Pago' : 'Crear Pago'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <p className="text-danger">{error}</p>}
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Usuario</Form.Label>
                            <Form.Select
                                value={currentPago.usuarioId}
                                onChange={(e) => setCurrentPago({ ...currentPago, usuarioId: e.target.value })}
                            >
                                <option value="">Selecciona un usuario</option>
                                {usuarios.map(user => (
                                    <option key={user.id} value={user.id}>{user.nombre}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Libro</Form.Label>
                            <Form.Select
                                value={currentPago.libroId}
                                onChange={(e) => setCurrentPago({ ...currentPago, libroId: e.target.value })}
                            >
                                <option value="">Selecciona un libro</option>
                                {libros.map(libro => (
                                    <option key={libro.id} value={libro.id}>{libro.titulo}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Monto</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                placeholder="Ingresa el monto"
                                value={currentPago.monto}
                                onChange={(e) => setCurrentPago({ ...currentPago, monto: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Fecha de Pago</Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="Ingresa la fecha de pago"
                                value={currentPago.fechaPago}
                                onChange={(e) => setCurrentPago({ ...currentPago, fechaPago: e.target.value })}
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

export default Pagos;
