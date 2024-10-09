import { Router } from 'express';
import pool from '../database/database.js';

const router = Router();

/* LISTAR PRODUCTOS */
router.get('/pro_list', async (req, res) => {
    try {
        const [result] = await pool.query(`
            SELECT p.id, p.nombre, p.descripcion, p.precio, p.año_lanzamiento, p.stock, 
                   p.artista, p.estado, g.nombre AS genero
            FROM producto p
            LEFT JOIN genero g ON p.id_genero = g.id
        `);
        res.render('producto/pro_list', { producto: result });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

/* AGREGAR PRODUCTOS */
router.get('/pro_add', async (req, res) => {
    try {
        const [generos] = await pool.query('SELECT * FROM genero');
        res.render('producto/pro_add', { generos });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


router.post('/pro_add', async (req, res) => {
    try {
        const { nombre, descripcion, precio, año_lanzamiento, artista, id_genero, stock, estado } = req.body;

        if (!nombre || !descripcion || !precio || !año_lanzamiento || !artista || !id_genero || !stock || !estado) {
            return res.status(400).send('Todos los campos son obligatorios');
        }

        const [result] = await pool.query(`
            INSERT INTO producto (nombre, descripcion, precio, año_lanzamiento, artista, id_genero, stock, estado)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [nombre, descripcion, precio, año_lanzamiento, artista, id_genero, stock, estado]);

        res.redirect('/pro_list');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


/* EDITAR PRODUCTOS */
router.get('/pro_edit/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [producto] = await pool.query('SELECT * FROM producto WHERE id = ?', [id]);

        const [generos] = await pool.query('SELECT * FROM genero');

        if (producto.length === 0) {
            return res.status(404).send('Producto no encontrado');
        }

        res.render('producto/pro_edit', { producto: producto[0], generos });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/pro_update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, año_lanzamiento, artista, id_genero, stock, estado } = req.body;

        if (!nombre || !descripcion || !precio || !año_lanzamiento || !artista || !id_genero || !stock || !estado) {
            return res.status(400).send('Todos los campos son obligatorios');
        }

        await pool.query(`
            UPDATE producto SET nombre = ?, descripcion = ?, precio = ?, año_lanzamiento = ?, 
            artista = ?, id_genero = ?, stock = ?, estado = ? WHERE id = ?
        `, [nombre, descripcion, precio, año_lanzamiento, artista, id_genero, stock, estado, id]);

        res.redirect('/pro_list');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

/* ELIMINAR PRODUCTOS */
router.get('/pro_delete/:id', async (req, res) => {

    const { id } = req.params;

    try {

        await pool.query('DELETE FROM producto WHERE id =?', [id]);

        res.redirect('/pro_list');

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

export default router;