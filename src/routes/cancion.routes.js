import { Router } from 'express';
import pool from '../database/database.js';

const router = Router()

/* LISTAR canciones */

router.get('/can_list', async (req, res) => {
    try {
        const [result] = await pool.query(`
            SELECT c.id, c.titulo, c.duracion, p.nombre AS nombre_producto 
            FROM Canciones c 
            LEFT JOIN Producto p ON c.id_producto = p.id
        `);
        res.render('canciones/can_list', { canciones: result });
    } catch (err) {
        console.error(err.message);
    }
});

/* agregar una canción */

router.post('/can_add', async (req, res) => {
    try {
        const { titulo, duracion, id_producto } = req.body;
        const result = await pool.query(`
            INSERT INTO Canciones (titulo, duracion, id_producto)
            VALUES (?,?,?)
        `, [titulo, duracion, id_producto]);

        res.redirect('/can_list');
    } catch (err) {
        console.error(err.message);
    }
});

router.get('/can_add', async (req, res) => {
    try {
        // Obtener la lista de productos
        const [productos] = await pool.query('SELECT id, nombre FROM Producto');

        // Renderizar la vista de agregar canción con la lista de productos
        res.render('canciones/can_add', { productos });
    } catch (err) {
        console.error(err.message);
        res.redirect('/can_list');
    }
});


/* mostrar formulario para editar canción */

router.get('/can_edit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Obtener la canción que se quiere editar
        const [cancion] = await pool.query(`SELECT * FROM Canciones WHERE id =?`, [id]);
        
        // Obtener la lista de productos para el dropdown
        const [productos] = await pool.query('SELECT id, nombre FROM Producto');

        // Renderizar la vista de edición pasando la canción y los productos
        res.render('canciones/can_edit', { cancion: cancion[0], productos });
    } catch (err) {
        console.error(err.message);
    }
});


/* modificar una canción */

router.post('/can_update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, duracion, id_producto } = req.body;

        const result = await pool.query(`
            UPDATE Canciones SET titulo =?, duracion =?, id_producto =? WHERE id =?
        `, [titulo, duracion, id_producto, id]);

        res.redirect('/can_list');
    } catch (err) {
        console.error(err.message);
    }
});

/* eliminar canción */

router.get('/can_delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`
            DELETE FROM Canciones WHERE id =?
        `, [id]);

        res.redirect('/can_list');
    } catch (err) {
        console.error(err.message);
    }
});

export default router;