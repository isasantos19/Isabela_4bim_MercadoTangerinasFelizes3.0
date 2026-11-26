
const express = require('express');
const router = express.Router();

const carrinhoController = require('../../../controllers/Clientes Controllers/Compras/carrinhoController');

// Criar ou localizar carrinho
router.post('/', carrinhoController.criarCarrinho);

// Listar itens do carrinho
router.get('/:tipo/:identificador', carrinhoController.listarCarrinho);

// Adicionar produto
router.post('/:tipo/:identificador/itens', carrinhoController.adicionarItem);

// Atualizar quantidade
router.put('/:tipo/:identificador/itens/:id_produto', carrinhoController.atualizarQuantidade);

// Remover produto
router.delete('/:tipo/:identificador/itens/:id_produto', carrinhoController.removerItem);

module.exports = router;
