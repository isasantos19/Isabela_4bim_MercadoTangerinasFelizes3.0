
const express = require('express');
const router = express.Router();

const finalizarCompraController = require('../../../controllers/Clientes Controllers/Compras/finalizar_compraController');

// Finalizar compra
router.post('/', finalizarCompraController.finalizarCompra);

module.exports = router;
