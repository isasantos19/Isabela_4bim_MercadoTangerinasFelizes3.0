
const { query } = require('../../../database');

exports.listarMinhasCompras = async (req, res) => {
    const idCliente = Number(req.params.id_cliente);

    // Verifica se o ID do cliente é válido
    if (!Number.isInteger(idCliente) || idCliente <= 0) {
        return res.status(400).json({
            mensagem: 'Identificação do cliente inválida.'
        });
    }

    try {
        // Busca todos os pedidos realizados pelo cliente
        const resultado = await query(
            `SELECT
                id_pedido,
                data_pedido,
                status_pedido,
                forma_recebimento,
                forma_pagamento,
                total_pedido
            FROM PEDIDOS
            WHERE id_cliente = $1
            ORDER BY data_pedido DESC`,
            [idCliente]
        );

        // Retorna o histórico de compras
        return res.status(200).json({
            compras: resultado.rows
        });

    } catch (error) {
        console.error('Erro ao listar compras:', error);

        return res.status(500).json({
            mensagem: 'Não foi possível carregar o histórico de compras.'
        });
    }
};
