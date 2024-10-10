import { Router } from 'express';
import pool from '../database/database.js';

const router = Router();

/* LISTAR USUARIOS */
router.get('/usu_list', async (req, res) => {
    try {
        const [result] = await pool.query(`
            SELECT p.id, p.nombre, p.apellido, p.direccion, p.telefono, p.email, 
                   p.contraseña, g.nombre AS rol
            FROM usuarios p
            LEFT JOIN rol g ON p.id_rol = g.id
        `);        
        res.render('usuario/usu_list', { usuario: result });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

/* MOSTRAR FORMULARIO PARA AGREGAR USUARIO */
router.get('/usu_add', (req, res) => {
    res.render('usuario/usu_add');
});

/* AGREGAR UN NUEVO USUARIO */
router.post('/usu_add', async (req, res) => {
    try {
        const { nombre, apellido, direccion, telefono, email, contraseña, id_rol } = req.body;
        const result = await pool.query(`
            INSERT INTO usuarios (nombre, apellido, direccion, telefono, email, contraseña, id_rol)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [nombre, apellido, direccion, telefono, email, contraseña, id_rol]);
        res.redirect('/usu_list');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al agregar el usuario');
    }
});

/* MOSTRAR FORMULARIO PARA MODIFICAR UN USUARIO */

router.get('/usu_edit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [usuario] = await pool.query(`
            SELECT p.id, p.nombre, p.apellido, p.direccion, p.telefono, p.email, 
                   p.contraseña, g.nombre AS rol, g.id AS id_rol
            FROM usuarios p
            LEFT JOIN rol g ON p.id_rol = g.id
            WHERE p.id =?
        `, [id]);
        res.render('usuario/usu_edit', { usuario: usuario[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

/* MODIFICAR UN USUARIO */

router.post('/usu_edit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, direccion, telefono, email, contraseña, id_rol } = req.body;
        const result = await pool.query(`
            UPDATE usuarios SET nombre=?, apellido=?, direccion=?, telefono=?, email=?, contraseña=?, id_rol=?
            WHERE id =?
        `, [nombre, apellido, direccion, telefono, email, contraseña, id_rol, id]);
        res.redirect('/usu_list');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al modificar el usuario');
    }
});

/* ELIMINAR USUARIO */

router.get('/usu_delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM usuarios WHERE id =?', [id]);
        res.redirect('/usu_list');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

export default router;