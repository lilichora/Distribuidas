import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Libros = () => {
    const [libros, setLibros] = useState([]);
    const [show, setShow] = useState(false);
    const [editing, setEditing] = useState(false);
    const [currentLibro, setCurrentLibro] = useState({
        id: '',
        titulo: '',
        autor: '',
        isbn: '',
        anoPublicacion: '',
        ejemplaresDisponibles: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchLibros();
    }, []);

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
        setCurrentLibro({
            id: '',
            titulo: '',
            autor: '',
            isbn: '',
            anoPublicacion: '',
            ejemplaresDisponibles: ''
        });
        setError('');
    };

    const handleSave = async () => {
        try {
            if (editing) {
                await axios.put(`http://18.221.39.240:8005/api/libros/editar/${currentLibro.id}`, currentLibro);
            } else {
                await axios.post('http://18.221.39.240:8005/api/libros/crear', currentLibro);
            }
            fetchLibros();
            handleClose();
        } catch (error) {
            setError('Error saving libro: ' + error.message);
        }
    };

    const handleEdit = (libro) => {
        setCurrentLibro(libro);
        setEditing(true);
        handleShow();
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://18.221.39.240:8005/api/libros/eliminar/${id}`);
            fetchLibros();
        } catch (error) {
            console.error('Error deleting libro:', error);
            setError('Error deleting libro');
        }
    };

    return (
        <div className="container mt-5">
            <h1>Libros</h1>
            <Button variant="primary" onClick={handleShow}>
                Crear Libro
            </Button>
            <table className="table mt-3 table-striped table-bordered">
                <thead>
                <tr>
                    <th>Título</th>
                    <th>Autor</th>
                    <th>ISBN</th>
                    <th>Año de Publicación</th>
                    <th>Ejemplares Disponibles</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {libros.map((libro) => (
                    <tr key={libro.id}>
                        <td>{libro.titulo}</td>
                        <td>{libro.autor}</td>
                        <td>{libro.isbn}</td>
                        <td>{libro.anoPublicacion}</td>
                        <td>{libro.ejemplaresDisponibles}</td>
                        <td>
                            <Button variant="warning" onClick={() => handleEdit(libro)}>
                                <FaEdit />
                            </Button>
                            <Button variant="danger" onClick={() => handleDelete(libro.id)}>
                                <FaTrash />
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{editing ? 'Editar Libro' : 'Crear Libro'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <p className="text-danger">{error}</p>}
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Título</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa el título"
                                value={currentLibro.titulo}
                                onChange={(e) => setCurrentLibro({ ...currentLibro, titulo: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Autor</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa el autor"
                                value={currentLibro.autor}
                                onChange={(e) => setCurrentLibro({ ...currentLibro, autor: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>ISBN</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa el ISBN"
                                value={currentLibro.isbn}
                                onChange={(e) => setCurrentLibro({ ...currentLibro, isbn: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Año de Publicación</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Ingresa el año de publicación"
                                value={currentLibro.anoPublicacion}
                                onChange={(e) => setCurrentLibro({ ...currentLibro, anoPublicacion: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Ejemplares Disponibles</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Ingresa los ejemplares disponibles"
                                value={currentLibro.ejemplaresDisponibles}
                                onChange={(e) => setCurrentLibro({ ...currentLibro, ejemplaresDisponibles: e.target.value })}
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

export default Libros;
