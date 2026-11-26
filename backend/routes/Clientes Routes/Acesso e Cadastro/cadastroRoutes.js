
const express = require('express');
const router = express.Router();

const cadastroController = require('../../../controllers/Clientes Controllers/Acesso e Cadastro/cadastroController');

// Rota para cadastrar um cliente
router.post('/', cadastroController.cadastrarCliente);

module.exports = router;
 
