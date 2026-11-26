
const express = require('express');
const router = express.Router();

const minhaCompraController = require('../../../controllers/Clientes Controllers/Area_conta/minha_compraController');

// Rota para listar as compras de um cliente
router.get('/:id_cliente', minhaCompraController.listarMinhasCompras);

module.exports = router;
