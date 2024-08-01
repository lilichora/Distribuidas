import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Notificaciones = () => {
    const [notificaciones, setNotificaciones] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [show, setShow] = useState(false);
    const [editing, setEditing] = useState(false);
    const [currentNotificacion, setCurrentNotificacion] = useState({
        id: '',
        usuarioId: '',
        tipo: '',
        detalle: '',
        fecha: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchNotificaciones();
        fetchUsuarios();
    }, []);

    const fetchNotificaciones = async () => {
        try {
            const response = await axios.get('http://localhost:8004/api/notificaciones');
            setNotificaciones(response.data);
        } catch (error) {
            console.error('Error fetching notificaciones:', error);
            setError('Error fetching notificaciones');
        }
    };

    const fetchUsuarios = async () => {
        try {
            const response = await axios.get('http://localhost:8001/api/usuarios');
            setUsuarios(response.data);
        } catch (error) {
            console.error('Error fetching usuarios:', error);
            setError('Error fetching usuarios');
        }
    };

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        setEditing(false);
        setCurrentNotificacion({
            id: '',
            usuarioId: '',
            tipo: '',
            detalle: '',
            fecha: ''
        });
        setError('');
    };

    const handleSave = async () => {
        try {
            if (editing) {
                await axios.put(`http://localhost:8004/api/notificaciones/editar/${currentNotificacion.id}`, currentNotificacion);
            } else {
                await axios.post('http://localhost:8004/api/notificaciones/crear', currentNotificacion);
            }
            fetchNotificaciones();
            handleClose();
        } catch (error) {
            setError('Error saving notificacion: ' + error.message);
        }
    };

    const handleEdit = (notificacion) => {
        setCurrentNotificacion(notificacion);
        setEditing(true);
        handleShow();
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8004/api/notificaciones/eliminar/${id}`);
            fetchNotificaciones();
        } catch (error) {
            console.error('Error deleting notificacion:', error);
            setError('Error deleting notificacion');
        }
    };

    return (
        <div className="container mt-5">
            <h1>Notificaciones</h1>
            <Button variant="primary" onClick={handleShow}>
                Crear Notificación
            </Button>
            <table className="table mt-3 table-striped table-bordered">
                <thead>
                <tr>
                    <th>Usuario</th>
                    <th>Tipo</th>
                    <th>Detalle</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {notificaciones.map((notificacion) => (
                    <tr key={notificacion.id}>
                        <td>{usuarios.find(user => user.id === notificacion.usuarioId)?.nombre || 'Desconocido'}</td>
                        <td>{notificacion.tipo}</td>
                        <td>{notificacion.detalle}</td>
                        <td>{new Date(notificacion.fecha).toLocaleString()}</td>
                        <td>
                            <Button variant="warning" onClick={() => handleEdit(notificacion)}>
                                <FaEdit />
                            </Button>
                            <Button variant="danger" onClick={() => handleDelete(notificacion.id)}>
                                <FaTrash />
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{editing ? 'Editar Notificación' : 'Crear Notificación'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <p className="text-danger">{error}</p>}
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Usuario</Form.Label>
                            <Form.Select
                                value={currentNotificacion.usuarioId}
                                onChange={(e) => setCurrentNotificacion({ ...currentNotificacion, usuarioId: e.target.value })}
                            >
                                <option value="">Selecciona un usuario</option>
                                {usuarios.map(user => (
                                    <option key={user.id} value={user.id}>{user.nombre}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Tipo</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa el tipo de notificación"
                                value={currentNotificacion.tipo}
                                onChange={(e) => setCurrentNotificacion({ ...currentNotificacion, tipo: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Detalle</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa el detalle de la notificación"
                                value={currentNotificacion.detalle}
                                onChange={(e) => setCurrentNotificacion({ ...currentNotificacion, detalle: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Fecha</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                placeholder="Ingresa la fecha"
                                value={currentNotificacion.fecha}
                                onChange={(e) => setCurrentNotificacion({ ...currentNotificacion, fecha: e.target.value })}
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

export default Notificaciones;
