import { Router } from 'express';
import pool from '../database/database.js';

const router = Router()

/* LISTAR generos */

router.get('/gen_list', async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM genero');
        res.render('genero/gen_list', {genero: result});
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los generos');
    }
});

/* Eliminar genero */

router.get('/gen_delete/:id', async (req, res) => {
    
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM genero WHERE id =?', [id]);
        res.redirect('/gen_list');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al eliminar el genero');
    }
});

/* Mostrar formulario para agregar un genero */
router.get('/gen_add', (req, res) => {
    res.render('genero/gen_add');
});

/* Agregar un nuevo genero */
router.post('/gen_add', async (req, res) => {
    try {
        const { nombre } = req.body;
        await pool.query('INSERT INTO genero (nombre) VALUES (?)', [nombre]);
        res.redirect('/gen_list');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al agregar el genero');
    }
});

/* Mostrar formulario para editar un genero */

router.get('/gen_edit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [genero] = await pool.query('SELECT * FROM genero WHERE id =?', [id]);
        res.render('genero/gen_edit', { genero: genero[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener el genero');
    }
});

/* Editar un genero */

router.post('/gen_edit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;
        await pool.query('UPDATE genero SET nombre =? WHERE id =?', [nombre, id]);
        res.redirect('/gen_list');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al editar el genero');
    }
});

export default router;