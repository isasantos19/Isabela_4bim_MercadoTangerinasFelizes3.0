
const { query } = require('../../../database');

exports.listarProdutos = async (req, res) => {
    try {
        // Busca todos os produtos e suas categorias
        const resultado = await query(
            `SELECT
                PRODUTOS.id_produto,
                PRODUTOS.nome_produto,
                PRODUTOS.preco_produto,
                PRODUTOS.imagem_produto,
                PRODUTOS.unidade_produto,
                CATEGORIAS.id_categoria,
                CATEGORIAS.nome_categoria
            FROM PRODUTOS
            INNER JOIN CATEGORIAS
                ON PRODUTOS.id_categoria = CATEGORIAS.id_categoria
            ORDER BY PRODUTOS.nome_produto`
        );

        // Retorna a lista de produtos
        return res.status(200).json({
            produtos: resultado.rows
        });

    } catch (error) {
        console.error('Erro ao listar produtos:', error);

        return res.status(500).json({
            mensagem: 'Não foi possível carregar os produtos.'
        });
    }
};
