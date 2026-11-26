
const { pool } = require('../../../database');
const crypto = require('crypto');

// Identificar o carrinho
function obterIdentificacao(req) {
    const { tipo, identificador } = req.params;

    if (tipo === 'cliente') {
        if (
            !identificador ||
            !Number.isInteger(Number(identificador)) ||
            Number(identificador) <= 0
        ) {
            return null;
        }

        return {
            tipo: 'cliente',
            id: Number(identificador)
        };
    }

    if (tipo === 'visitante') {
        if (
            !identificador ||
            typeof identificador !== 'string' ||
            identificador.length > 100
        ) {
            return null;
        }

        return {
            tipo: 'visitante',
            id: identificador
        };
    }

    return null;
}

// Buscar carrinho
async function buscarCarrinho(conexao, identificacao, bloquear = false) {
    let resultado;

    if (identificacao.tipo === 'cliente') {
        resultado = await conexao.query(
            `SELECT C.*
             FROM CARRINHOS C
             INNER JOIN CLIENTES CL
                ON C.id_cliente = CL.id_cliente
             WHERE C.id_cliente = $1
             AND CL.status_cliente = TRUE
             ${bloquear ? 'FOR UPDATE OF C' : ''}`,
            [identificacao.id]
        );
    } else {
        resultado = await conexao.query(
            `SELECT *
             FROM CARRINHOS
             WHERE identificador_temporario = $1
             ${bloquear ? 'FOR UPDATE' : ''}`,
            [identificacao.id]
        );
    }

    return resultado.rows[0];
}

// Validar quantidade
function quantidadeValida(quantidade) {
    const valor = Number(quantidade);

    return (
        Number.isFinite(valor) &&
        valor > 0 &&
        valor <= 9999999.999 &&
        Math.abs(valor * 1000 - Math.round(valor * 1000)) < 0.000001
    );
}

// Criar carrinho
async function criarCarrinho(req, res) {
    try {
        const { id_cliente, identificador_temporario } = req.body;

        // Criar carrinho de cliente
        if (id_cliente !== undefined && id_cliente !== null) {
            if (
                !Number.isInteger(Number(id_cliente)) ||
                Number(id_cliente) <= 0
            ) {
                return res.status(400).json({
                    mensagem: 'ID do cliente inválido.'
                });
            }

            const cliente = await pool.query(
                `SELECT id_cliente
                 FROM CLIENTES
                 WHERE id_cliente = $1
                 AND status_cliente = TRUE`,
                [id_cliente]
            );

            if (cliente.rows.length === 0) {
                return res.status(404).json({
                    mensagem: 'Cliente não encontrado ou desativado.'
                });
            }

            const resultado = await pool.query(
                `INSERT INTO CARRINHOS (id_cliente)
                 VALUES ($1)
                 ON CONFLICT (id_cliente)
                 DO UPDATE SET
                    data_atualizacao = CURRENT_TIMESTAMP
                 RETURNING *`,
                [id_cliente]
            );

            return res.status(200).json({
                mensagem: 'Carrinho do cliente encontrado ou criado.',
                carrinho: resultado.rows[0]
            });
        }

        // Criar carrinho de visitante
        let identificador = identificador_temporario;

        if (identificador !== undefined && identificador !== null) {
            if (
                typeof identificador !== 'string' ||
                identificador.length === 0 ||
                identificador.length > 100
            ) {
                return res.status(400).json({
                    mensagem: 'Identificador temporário inválido.'
                });
            }
        } else {
            identificador = crypto.randomUUID();
        }

        const resultado = await pool.query(
            `INSERT INTO CARRINHOS (identificador_temporario)
             VALUES ($1)
             ON CONFLICT (identificador_temporario)
             DO UPDATE SET
                data_atualizacao = CURRENT_TIMESTAMP
             RETURNING *`,
            [identificador]
        );

        return res.status(200).json({
            mensagem: 'Carrinho de visitante encontrado ou criado.',
            carrinho: resultado.rows[0]
        });

    } catch (erro) {
        console.error('Erro ao criar carrinho:', erro);

        return res.status(500).json({
            mensagem: 'Erro ao criar o carrinho.'
        });
    }
}

// Listar itens do carrinho
async function listarCarrinho(req, res) {
    try {
        const identificacao = obterIdentificacao(req);

        if (!identificacao) {
            return res.status(400).json({
                mensagem: 'Identificação do carrinho inválida.'
            });
        }

        const carrinho = await buscarCarrinho(pool, identificacao);

        if (!carrinho) {
            return res.status(404).json({
                mensagem: 'Carrinho não encontrado.'
            });
        }

        const resultado = await pool.query(
            `SELECT
                IC.id_produto,
                P.nome_produto,
                P.preco_produto,
                P.imagem_produto,
                P.unidade_produto,
                IC.quantidade,
                ROUND(IC.quantidade * P.preco_produto, 2) AS subtotal,
                COALESCE(E.quantidade, 0) AS estoque_disponivel
             FROM ITENS_CARRINHO IC
             INNER JOIN PRODUTOS P
                ON IC.id_produto = P.id_produto
             LEFT JOIN ESTOQUE E
                ON P.id_produto = E.id_produto
             WHERE IC.id_carrinho = $1
             ORDER BY P.nome_produto`,
            [carrinho.id_carrinho]
        );

        return res.status(200).json({
            carrinho,
            itens: resultado.rows
        });

    } catch (erro) {
        console.error('Erro ao listar carrinho:', erro);

        return res.status(500).json({
            mensagem: 'Erro ao consultar o carrinho.'
        });
    }
}

// Adicionar produto ao carrinho
async function adicionarItem(req, res) {
    const identificacao = obterIdentificacao(req);
    const { id_produto, quantidade } = req.body;

    if (!identificacao) {
        return res.status(400).json({
            mensagem: 'Identificação do carrinho inválida.'
        });
    }

    if (
        !Number.isInteger(Number(id_produto)) ||
        Number(id_produto) <= 0 ||
        !quantidadeValida(quantidade)
    ) {
        return res.status(400).json({
            mensagem: 'Produto ou quantidade inválidos.'
        });
    }

    let conexao;
    let transacaoIniciada = false;

    try {
        conexao = await pool.connect();

        await conexao.query('BEGIN');
        transacaoIniciada = true;

        const carrinho = await buscarCarrinho(
            conexao,
            identificacao,
            true
        );

        if (!carrinho) {
            await conexao.query('ROLLBACK');
            transacaoIniciada = false;

            return res.status(404).json({
                mensagem: 'Carrinho não encontrado.'
            });
        }

        const produto = await conexao.query(
            `SELECT id_produto
             FROM PRODUTOS
             WHERE id_produto = $1`,
            [id_produto]
        );

        if (produto.rows.length === 0) {
            await conexao.query('ROLLBACK');
            transacaoIniciada = false;

            return res.status(404).json({
                mensagem: 'Produto não encontrado.'
            });
        }

        const estoqueResultado = await conexao.query(
            `SELECT quantidade
             FROM ESTOQUE
             WHERE id_produto = $1
             FOR UPDATE`,
            [id_produto]
        );

        if (estoqueResultado.rows.length === 0) {
            await conexao.query('ROLLBACK');
            transacaoIniciada = false;

            return res.status(404).json({
                mensagem: 'Estoque do produto não encontrado.'
            });
        }

        const itemExistente = await conexao.query(
            `SELECT quantidade
             FROM ITENS_CARRINHO
             WHERE id_carrinho = $1
             AND id_produto = $2`,
            [carrinho.id_carrinho, id_produto]
        );

        let quantidadeTotal = Number(quantidade);

        if (itemExistente.rows.length > 0) {
            quantidadeTotal += Number(itemExistente.rows[0].quantidade);
        }

        const estoque = Number(estoqueResultado.rows[0].quantidade);

        if (quantidadeTotal > estoque) {
            await conexao.query('ROLLBACK');
            transacaoIniciada = false;

            return res.status(409).json({
                mensagem: 'Quantidade solicitada maior que o estoque disponível.'
            });
        }

        await conexao.query(
            `INSERT INTO ITENS_CARRINHO (
                id_carrinho,
                id_produto,
                quantidade
             )
             VALUES ($1, $2, $3)
             ON CONFLICT (id_carrinho, id_produto)
             DO UPDATE SET
                quantidade = ITENS_CARRINHO.quantidade + EXCLUDED.quantidade`,
            [carrinho.id_carrinho, id_produto, quantidade]
        );

        await conexao.query(
            `UPDATE CARRINHOS
             SET data_atualizacao = CURRENT_TIMESTAMP
             WHERE id_carrinho = $1`,
            [carrinho.id_carrinho]
        );

        await conexao.query('COMMIT');
        transacaoIniciada = false;

        return res.status(200).json({
            mensagem: 'Produto adicionado ao carrinho.'
        });

    } catch (erro) {
        if (conexao && transacaoIniciada) {
            await conexao.query('ROLLBACK');
        }

        console.error('Erro ao adicionar produto:', erro);

        return res.status(500).json({
            mensagem: 'Erro ao adicionar produto ao carrinho.'
        });

    } finally {
        if (conexao) {
            conexao.release();
        }
    }
}

// Atualizar quantidade de um produto
async function atualizarQuantidade(req, res) {
    const identificacao = obterIdentificacao(req);
    const { id_produto } = req.params;
    const { quantidade } = req.body;

    if (!identificacao) {
        return res.status(400).json({
            mensagem: 'Identificação do carrinho inválida.'
        });
    }

    if (
        !Number.isInteger(Number(id_produto)) ||
        Number(id_produto) <= 0 ||
        !quantidadeValida(quantidade)
    ) {
        return res.status(400).json({
            mensagem: 'Produto ou quantidade inválidos.'
        });
    }

    let conexao;
    let transacaoIniciada = false;

    try {
        conexao = await pool.connect();

        await conexao.query('BEGIN');
        transacaoIniciada = true;

        const carrinho = await buscarCarrinho(
            conexao,
            identificacao,
            true
        );

        if (!carrinho) {
            await conexao.query('ROLLBACK');
            transacaoIniciada = false;

            return res.status(404).json({
                mensagem: 'Carrinho não encontrado.'
            });
        }

        const estoqueResultado = await conexao.query(
            `SELECT quantidade
             FROM ESTOQUE
             WHERE id_produto = $1
             FOR UPDATE`,
            [id_produto]
        );

        if (estoqueResultado.rows.length === 0) {
            await conexao.query('ROLLBACK');
            transacaoIniciada = false;

            return res.status(404).json({
                mensagem: 'Estoque do produto não encontrado.'
            });
        }

        if (Number(quantidade) > Number(estoqueResultado.rows[0].quantidade)) {
            await conexao.query('ROLLBACK');
            transacaoIniciada = false;

            return res.status(409).json({
                mensagem: 'Quantidade solicitada maior que o estoque disponível.'
            });
        }

        const resultado = await conexao.query(
            `UPDATE ITENS_CARRINHO
             SET quantidade = $1
             WHERE id_carrinho = $2
             AND id_produto = $3
             RETURNING *`,
            [quantidade, carrinho.id_carrinho, id_produto]
        );

        if (resultado.rows.length === 0) {
            await conexao.query('ROLLBACK');
            transacaoIniciada = false;

            return res.status(404).json({
                mensagem: 'Produto não encontrado no carrinho.'
            });
        }

        await conexao.query(
            `UPDATE CARRINHOS
             SET data_atualizacao = CURRENT_TIMESTAMP
             WHERE id_carrinho = $1`,
            [carrinho.id_carrinho]
        );

        await conexao.query('COMMIT');
        transacaoIniciada = false;

        return res.status(200).json({
            mensagem: 'Quantidade atualizada com sucesso.'
        });

    } catch (erro) {
        if (conexao && transacaoIniciada) {
            await conexao.query('ROLLBACK');
        }

        console.error('Erro ao atualizar quantidade:', erro);

        return res.status(500).json({
            mensagem: 'Erro ao atualizar a quantidade.'
        });

    } finally {
        if (conexao) {
            conexao.release();
        }
    }
}

// Remover produto do carrinho
async function removerItem(req, res) {
    try {
        const identificacao = obterIdentificacao(req);
        const { id_produto } = req.params;

        if (!identificacao) {
            return res.status(400).json({
                mensagem: 'Identificação do carrinho inválida.'
            });
        }

        if (
            !Number.isInteger(Number(id_produto)) ||
            Number(id_produto) <= 0
        ) {
            return res.status(400).json({
                mensagem: 'ID do produto inválido.'
            });
        }

        const carrinho = await buscarCarrinho(pool, identificacao);

        if (!carrinho) {
            return res.status(404).json({
                mensagem: 'Carrinho não encontrado.'
            });
        }

        const resultado = await pool.query(
            `DELETE FROM ITENS_CARRINHO
             WHERE id_carrinho = $1
             AND id_produto = $2
             RETURNING *`,
            [carrinho.id_carrinho, id_produto]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensagem: 'Produto não encontrado no carrinho.'
            });
        }

        await pool.query(
            `UPDATE CARRINHOS
             SET data_atualizacao = CURRENT_TIMESTAMP
             WHERE id_carrinho = $1`,
            [carrinho.id_carrinho]
        );

        return res.status(200).json({
            mensagem: 'Produto removido do carrinho.'
        });

    } catch (erro) {
        console.error('Erro ao remover produto:', erro);

        return res.status(500).json({
            mensagem: 'Erro ao remover produto do carrinho.'
        });
    }
}

module.exports = {
    criarCarrinho,
    listarCarrinho,
    adicionarItem,
    atualizarQuantidade,
    removerItem
};
