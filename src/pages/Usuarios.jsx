import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Alert, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [show, setShow] = useState(false);
    const [editing, setEditing] = useState(false);
    const [currentUsuario, setCurrentUsuario] = useState({ nombre: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [fetchError, setFetchError] = useState('');

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        try {
            const response = await axios.get('http://18.119.120.45:8001/api/usuarios');
            setUsuarios(response.data);
        } catch (error) {
            console.error('Error fetching usuarios:', error);
            setFetchError('Error fetching usuarios. Please try again later.');
        }
    };

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        setEditing(false);
        setCurrentUsuario({ nombre: '', email: '', password: '' });
        setError('');
    };

    const handleSave = async () => {
        try {
            if (editing) {
                await axios.put(`http://18.119.120.45:8001/api/usuarios/editar/${currentUsuario.id}`, currentUsuario);
            } else {
                await axios.post('http://18.119.120.45:8001/api/usuarios/crear', currentUsuario);
            }
            fetchUsuarios();
            handleClose();
        } catch (error) {
            setError('Error saving usuario: ' + error.message);
        }
    };

    const handleEdit = (usuario) => {
        setCurrentUsuario(usuario);
        setEditing(true);
        handleShow();
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://18.119.120.45:8001/api/usuarios/eliminar/${id}`);
            fetchUsuarios();
        } catch (error) {
            console.error('Error deleting usuario:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-primary">Usuarios</h1>
            <Button variant="success" onClick={handleShow}>
                <FontAwesomeIcon icon={faPlus} /> Crear Usuario
            </Button>
            {fetchError && <Alert variant="danger" className="mt-3">{fetchError}</Alert>}
            <Table striped bordered hover className="mt-3">
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {usuarios.map((usuario) => (
                    <tr key={usuario.id}>
                        <td>{usuario.nombre}</td>
                        <td>{usuario.email}</td>
                        <td>
                            <Button variant="warning" className="me-2" onClick={() => handleEdit(usuario)}>
                                <FontAwesomeIcon icon={faEdit} />
                            </Button>
                            <Button variant="danger" onClick={() => handleDelete(usuario.id)}>
                                <FontAwesomeIcon icon={faTrash} />
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{editing ? 'Editar Usuario' : 'Crear Usuario'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa el nombre"
                                value={currentUsuario.nombre}
                                onChange={(e) => setCurrentUsuario({ ...currentUsuario, nombre: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Ingresa el email"
                                value={currentUsuario.email}
                                onChange={(e) => setCurrentUsuario({ ...currentUsuario, email: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Ingresa el password"
                                value={currentUsuario.password}
                                onChange={(e) => setCurrentUsuario({ ...currentUsuario, password: e.target.value })}
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

export default Usuarios;
