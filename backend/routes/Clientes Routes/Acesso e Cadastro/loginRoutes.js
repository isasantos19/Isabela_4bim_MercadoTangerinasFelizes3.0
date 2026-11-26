
const express = require('express');
const router = express.Router();

const loginController = require('../../../controllers/Clientes Controllers/Acesso e Cadastro/loginController');

// Rota para realizar o login do cliente
router.post('/', loginController.entrarCliente);

module.exports = router;
