import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Inventario = () => {
    const [inventario, setInventario] = useState([]);
    const [libros, setLibros] = useState([]);
    const [show, setShow] = useState(false);
    const [editing, setEditing] = useState(false);
    const [currentInventario, setCurrentInventario] = useState({
        id: '',
        libroId: '',
        cantidadDisponible: '',
        cantidadTotal: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchInventario();
        fetchLibros();
    }, []);

    const fetchInventario = async () => {
        try {
            const response = await axios.get('http://18.221.39.240:8006/api/inventario');
            setInventario(response.data);
        } catch (error) {
            console.error('Error fetching inventario:', error);
            setError('Error fetching inventario');
        }
    };

    const fetchLibros = async () => {
        try {
            const response = await axios.get('http://18.221.39.240:8005/api/libros');
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
        setCurrentInventario({
            id: '',
            libroId: '',
            cantidadDisponible: '',
            cantidadTotal: ''
        });
        setError('');
    };

    const handleSave = async () => {
        try {
            if (editing) {
                await axios.put(`http://18.221.39.240:8006/api/inventario/editar/${currentInventario.id}`, currentInventario);
            } else {
                await axios.post('http://18.221.39.240:8006/api/inventario/crear', currentInventario);
            }
            fetchInventario();
            handleClose();
        } catch (error) {
            setError('Error saving inventario: ' + error.message);
        }
    };

    const handleEdit = (item) => {
        setCurrentInventario(item);
        setEditing(true);
        handleShow();
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://18.221.39.240:8006/api/inventario/eliminar/${id}`);
            fetchInventario();
        } catch (error) {
            console.error('Error deleting inventario:', error);
            setError('Error deleting inventario');
        }
    };

    return (
        <div className="container mt-5">
            <h1>Inventario</h1>
            <Button variant="primary" onClick={handleShow}>
                Crear Inventario
            </Button>
            <table className="table mt-3 table-striped table-bordered">
                <thead>
                <tr>
                    <th>Libro</th>
                    <th>Cantidad Disponible</th>
                    <th>Cantidad Total</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {inventario.map((item) => (
                    <tr key={item.id}>
                        <td>{libros.find(libro => libro.id === item.libroId)?.titulo || 'Desconocido'}</td>
                        <td>{item.cantidadDisponible}</td>
                        <td>{item.cantidadTotal}</td>
                        <td>
                            <Button variant="warning" onClick={() => handleEdit(item)}>
                                <FaEdit />
                            </Button>
                            <Button variant="danger" onClick={() => handleDelete(item.id)}>
                                <FaTrash />
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{editing ? 'Editar Inventario' : 'Crear Inventario'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <p className="text-danger">{error}</p>}
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Libro</Form.Label>
                            <Form.Select
                                value={currentInventario.libroId}
                                onChange={(e) => setCurrentInventario({ ...currentInventario, libroId: e.target.value })}
                            >
                                <option value="">Selecciona un libro</option>
                                {libros.map(libro => (
                                    <option key={libro.id} value={libro.id}>{libro.titulo}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Cantidad Disponible</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Ingresa la cantidad disponible"
                                value={currentInventario.cantidadDisponible}
                                onChange={(e) => setCurrentInventario({ ...currentInventario, cantidadDisponible: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Cantidad Total</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Ingresa la cantidad total"
                                value={currentInventario.cantidadTotal}
                                onChange={(e) => setCurrentInventario({ ...currentInventario, cantidadTotal: e.target.value })}
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

export default Inventario;
