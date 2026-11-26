
const express = require('express');
const router = express.Router();

const minhaContaController = require('../../../controllers/Clientes Controllers/Area_conta/minha_contaController');

// Rota para consultar os dados da conta
router.get('/:id_cliente', minhaContaController.consultarMinhaConta);

// Rota para atualizar os dados da conta
router.put('/:id_cliente', minhaContaController.atualizarMinhaConta);

module.exports = router;
