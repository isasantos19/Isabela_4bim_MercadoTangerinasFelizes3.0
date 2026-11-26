
const { query } = require('../../../database');

exports.detalharPedido = async (req, res) => {
    const idPedido = Number(req.params.id_pedido);
    const idCliente = Number(req.query.id_cliente);

    // Verifica se os IDs são números inteiros válidos
    if (
        !Number.isInteger(idPedido) || idPedido <= 0 ||
        !Number.isInteger(idCliente) || idCliente <= 0
    ) {
        return res.status(400).json({
            mensagem: 'Identificação do pedido ou cliente inválida.'
        });
    }

    try {
        // Busca o pedido pertencente ao cliente informado
        const resultadoPedido = await query(
            `SELECT
                id_pedido,
                id_cliente,
                data_pedido,
                status_pedido,
                forma_recebimento,
                forma_pagamento,
                total_pedido,
                cep_entrega,
                rua_entrega,
                numero_entrega,
                complemento_entrega,
                bairro_entrega,
                cidade_entrega,
                estado_entrega
            FROM PEDIDOS
            WHERE id_pedido = $1
            AND id_cliente = $2`,
            [idPedido, idCliente]
        );

        // Verifica se o pedido foi encontrado
        if (resultadoPedido.rows.length === 0) {
            return res.status(404).json({
                mensagem: 'Pedido não encontrado.'
            });
        }

        // Busca os produtos que pertencem ao pedido
        const resultadoItens = await query(
            `SELECT
                PRODUTOS.id_produto,
                PRODUTOS.nome_produto,
                PRODUTOS.imagem_produto,
                PRODUTOS.unidade_produto,
                ITENS_PEDIDO.quantidade,
                ITENS_PEDIDO.preco_unitario,
                ITENS_PEDIDO.subtotal
            FROM ITENS_PEDIDO
            INNER JOIN PRODUTOS
                ON ITENS_PEDIDO.id_produto = PRODUTOS.id_produto
            WHERE ITENS_PEDIDO.id_pedido = $1`,
            [idPedido]
        );

        // Retorna os dados do pedido e seus produtos
        return res.status(200).json({
            pedido: resultadoPedido.rows[0],
            itens: resultadoItens.rows
        });

    } catch (error) {
        console.error('Erro ao detalhar pedido:', error);

        return res.status(500).json({
            mensagem: 'Não foi possível carregar os detalhes do pedido.'
        });
    }
};
