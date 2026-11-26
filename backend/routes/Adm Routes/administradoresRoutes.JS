
const express = require('express');
const router = express.Router();

const administradoresController = require('../../controllers/Adm Controllers/administradoresController.JS');

// Cadastrar administrador
router.post('/cadastrar', administradoresController.cadastrarAdministrador);

// Listar administradores
router.post('/listar', administradoresController.listarAdministradores);

module.exports = router;
