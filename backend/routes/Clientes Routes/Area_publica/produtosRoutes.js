
const express = require('express');
const router = express.Router();

const produtosController = require('../../../controllers/Clientes Controllers/Area_publica/produtosController');

// Rota para listar os produtos
router.get('/', produtosController.listarProdutos);

module.exports = router;
