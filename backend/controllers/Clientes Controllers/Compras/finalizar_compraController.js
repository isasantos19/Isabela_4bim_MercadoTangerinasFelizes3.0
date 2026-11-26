
const { pool } = require('../../../database');

// Finalizar compra
async function finalizarCompra(req, res) {
    const {
        id_cliente,
        identificador_temporario,
        forma_recebimento,
        forma_pagamento,
        tipo_endereco,
        cep_entrega,
        rua_entrega,
        numero_entrega,
        complemento_entrega,
        bairro_entrega,
        cidade_entrega,
        estado_entrega
    } = req.body;

    if (!id_cliente || isNaN(Number(id_cliente)) || Number(id_cliente) <= 0) {
        return res.status(400).json({
            mensagem: 'ID do cliente inválido.'
        });
    }

    if (!forma_recebimento || !forma_pagamento) {
        return res.status(400).json({
            mensagem: 'Informe a forma de recebimento e pagamento.'
        });
    }

    if (
        identificador_temporario &&
        (typeof identificador_temporario !== 'string' ||
        identificador_temporario.length > 100)
    ) {
        return res.status(400).json({
            mensagem: 'Identificador temporário inválido.'
        });
    }

    const recebimento = String(forma_recebimento).trim();
    const pagamento = String(forma_pagamento).trim();

    if (
        recebimento.length > 30 ||
        pagamento.length > 30
    ) {
        return res.status(400).json({
            mensagem: 'Informações de pagamento ou recebimento inválidas.'
        });
    }

    const ehEntrega = recebimento.toLowerCase().includes('entrega');

    if (ehEntrega && !tipo_endereco) {
        return res.status(400).json({
            mensagem: 'Selecione o endereço de entrega.'
        });
    }

    if (
        ehEntrega &&
        tipo_endereco !== 'Cadastrado' &&
        tipo_endereco !== 'Alternativo'
    ) {
        return res.status(400).json({
            mensagem: 'Tipo de endereço inválido.'
        });
    }

    let conexao;
    let transacaoIniciada = false;

    try {
        conexao = await pool.connect();

        await conexao.query('BEGIN');
        transacaoIniciada = true;

        // Verificar se o cliente existe e está ativo
        const clienteResultado = await conexao.query(
            `SELECT *
             FROM CLIENTES
             WHERE id_cliente = $1
             AND status_cliente = TRUE
             FOR UPDATE`,
            [id_cliente]
        );

        if (clienteResultado.rows.length === 0) {
            await conexao.query('ROLLBACK');
            transacaoIniciada = false;

            return res.status(404).json({
                mensagem: 'Cliente não encontrado ou desativado.'
            });
        }

        const cliente = clienteResultado.rows[0];

        // Buscar carrinho vinculado ao cliente
        const carrinhoCliente = await conexao.query(
            `SELECT *
             FROM CARRINHOS
             WHERE id_cliente = $1
             FOR UPDATE`,
            [id_cliente]
        );

        let carrinho = carrinhoCliente.rows[0];

        // Buscar carrinho temporário, caso exista
        if (identificador_temporario) {
            const carrinhoVisitante = await conexao.query(
                `SELECT *
                 FROM CARRINHOS
                 WHERE identificador_temporario = $1
                 FOR UPDATE`,
                [identificador_temporario]
            );

            const visitante = carrinhoVisitante.rows[0];

            if (visitante) {
                if (carrinho && carrinho.id_carrinho !== visitante.id_carrinho) {

                    // Unir os itens do carrinho temporário ao carrinho do cliente
                    await conexao.query(
                        `INSERT INTO ITENS_CARRINHO
                            (id_carrinho, id_produto, quantidade)
                         SELECT $1, id_produto, quantidade
                         FROM ITENS_CARRINHO
                         WHERE id_carrinho = $2
                         ON CONFLICT (id_carrinho, id_produto)
                         DO UPDATE SET
                            quantidade = ITENS_CARRINHO.quantidade
                            + EXCLUDED.quantidade`,
                        [carrinho.id_carrinho, visitante.id_carrinho]
                    );

                    await conexao.query(
                        'DELETE FROM CARRINHOS WHERE id_carrinho = $1',
                        [visitante.id_carrinho]
                    );

                } else if (!carrinho) {

                    // Vincular o carrinho temporário ao cliente
                    const resultado = await conexao.query(
                        `UPDATE CARRINHOS
                         SET id_cliente = $1,
                             identificador_temporario = NULL,
                             data_atualizacao = CURRENT_TIMESTAMP
                         WHERE id_carrinho = $2
                         RETURNING *`,
                        [id_cliente, visitante.id_carrinho]
                    );

                    carrinho = resultado.rows[0];
                }
            }
        }

        if (!carrinho) {
            await conexao.query('ROLLBACK');
            transacaoIniciada = false;

            return res.status(404).json({
                mensagem: 'Carrinho não encontrado.'
            });
        }

        // Buscar produtos do carrinho
        const itensResultado = await conexao.query(
            `SELECT
                IC.id_produto,
                IC.quantidade,
                P.preco_produto
             FROM ITENS_CARRINHO IC
             INNER JOIN PRODUTOS P
                ON IC.id_produto = P.id_produto
             WHERE IC.id_carrinho = $1
             ORDER BY IC.id_produto`,
            [carrinho.id_carrinho]
        );

        const itens = itensResultado.rows;

        if (itens.length === 0) {
            await conexao.query('ROLLBACK');
            transacaoIniciada = false;

            return res.status(400).json({
                mensagem: 'Não é possível finalizar um carrinho vazio.'
            });
        }

        // Conferir estoque e bloquear os registros durante a compra
        for (const item of itens) {
            const estoqueResultado = await conexao.query(
                `SELECT quantidade
                 FROM ESTOQUE
                 WHERE id_produto = $1
                 FOR UPDATE`,
                [item.id_produto]
            );

            if (estoqueResultado.rows.length === 0) {
                await conexao.query('ROLLBACK');
                transacaoIniciada = false;

                return res.status(409).json({
                    mensagem: `Estoque não encontrado para o produto ${item.id_produto}.`
                });
            }

            const estoque = Number(estoqueResultado.rows[0].quantidade);
            const quantidade = Number(item.quantidade);

            if (quantidade > estoque) {
                await conexao.query('ROLLBACK');
                transacaoIniciada = false;

                return res.status(409).json({
                    mensagem: `Estoque insuficiente para o produto ${item.id_produto}.`
                });
            }
        }

        // Calcular o total diretamente no banco
        const totalResultado = await conexao.query(
            `SELECT
                COALESCE(
                    SUM(ROUND(IC.quantidade * P.preco_produto, 2)),
                    0
                ) AS total
             FROM ITENS_CARRINHO IC
             INNER JOIN PRODUTOS P
                ON IC.id_produto = P.id_produto
             WHERE IC.id_carrinho = $1`,
            [carrinho.id_carrinho]
        );

        const total = totalResultado.rows[0].total;

        // Definir endereço de entrega
        let cep = null;
        let rua = null;
        let numero = null;
        let complemento = null;
        let bairro = null;
        let cidade = null;
        let estado = null;

        if (ehEntrega) {

            if (tipo_endereco === 'Cadastrado') {

                cep = cliente.cep_cliente;
                rua = cliente.rua_cliente;
                numero = cliente.numero_cliente;
                complemento = cliente.complemento_cliente;
                bairro = cliente.bairro_cliente;
                cidade = cliente.cidade_cliente;
                estado = cliente.estado_cliente;

                if (
                    !cep || !rua || !numero ||
                    !bairro || !cidade || !estado
                ) {
                    await conexao.query('ROLLBACK');
                    transacaoIniciada = false;

                    return res.status(400).json({
                        mensagem: 'O endereço cadastrado está incompleto. Atualize seus dados ou informe outro endereço.'
                    });
                }

            } else {

                // Validar endereço alternativo
                if (
                    !cep_entrega ||
                    !rua_entrega ||
                    !numero_entrega ||
                    !bairro_entrega ||
                    !cidade_entrega ||
                    !estado_entrega
                ) {
                    await conexao.query('ROLLBACK');
                    transacaoIniciada = false;

                    return res.status(400).json({
                        mensagem: 'Preencha todos os campos obrigatórios do endereço alternativo.'
                    });
                }

                const cepLimpo = String(cep_entrega).replace(/\D/g, '');

                if (cepLimpo.length !== 8) {
                    await conexao.query('ROLLBACK');
                    transacaoIniciada = false;

                    return res.status(400).json({
                        mensagem: 'CEP do endereço alternativo inválido.'
                    });
                }

                cep = cepLimpo;
                rua = String(rua_entrega).trim();
                numero = String(numero_entrega).trim();
                complemento = complemento_entrega
                    ? String(complemento_entrega).trim()
                    : null;
                bairro = String(bairro_entrega).trim();
                cidade = String(cidade_entrega).trim();
                estado = String(estado_entrega).trim();

                if (
                    !rua || !numero || !bairro ||
                    !cidade || !estado
                ) {
                    await conexao.query('ROLLBACK');
                    transacaoIniciada = false;

                    return res.status(400).json({
                        mensagem: 'Preencha corretamente todos os campos obrigatórios do endereço.'
                    });
                }
            }
        }

        // Criar pedido
        const pedidoResultado = await conexao.query(
            `INSERT INTO PEDIDOS (
                id_cliente,
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
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING id_pedido, data_pedido, status_pedido, total_pedido`,
            [
                id_cliente,
                recebimento,
                pagamento,
                total,
                cep,
                rua,
                numero,
                complemento,
                bairro,
                cidade,
                estado
            ]
        );

        const pedido = pedidoResultado.rows[0];

        // Registrar os produtos do pedido e atualizar o estoque
        for (const item of itens) {

            await conexao.query(
                `INSERT INTO ITENS_PEDIDO (
                    id_pedido,
                    id_produto,
                    quantidade,
                    preco_unitario,
                    subtotal
                )
                VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    ROUND($3::NUMERIC * $4::NUMERIC, 2)
                )`,
                [
                    pedido.id_pedido,
                    item.id_produto,
                    item.quantidade,
                    item.preco_produto
                ]
            );

            await conexao.query(
                `UPDATE ESTOQUE
                 SET quantidade = quantidade - $1,
                     data_atualizacao = CURRENT_DATE
                 WHERE id_produto = $2`,
                [item.quantidade, item.id_produto]
            );
        }

        // Limpar os itens do carrinho
        await conexao.query(
            'DELETE FROM ITENS_CARRINHO WHERE id_carrinho = $1',
            [carrinho.id_carrinho]
        );

        await conexao.query(
            `UPDATE CARRINHOS
             SET data_atualizacao = CURRENT_TIMESTAMP
             WHERE id_carrinho = $1`,
            [carrinho.id_carrinho]
        );

        await conexao.query('COMMIT');
        transacaoIniciada = false;

        return res.status(201).json({
            mensagem: 'Compra finalizada com sucesso!',
            pedido
        });

    } catch (erro) {
        if (conexao && transacaoIniciada) {
            await conexao.query('ROLLBACK');
        }

        console.error('Erro ao finalizar compra:', erro);

        return res.status(500).json({
            mensagem: 'Erro ao finalizar a compra.'
        });

    } finally {
        if (conexao) {
            conexao.release();
        }
    }
}

module.exports = {
    finalizarCompra
};
