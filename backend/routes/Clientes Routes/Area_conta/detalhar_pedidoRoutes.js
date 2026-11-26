
const express = require('express');
const router = express.Router();

const detalharPedidoController = require('../../../controllers/Clientes Controllers/Area_conta/detalhar_pedidoController');

// Rota para detalhar um pedido específico
router.get('/:id_pedido', detalharPedidoController.detalharPedido);

module.exports = router;
