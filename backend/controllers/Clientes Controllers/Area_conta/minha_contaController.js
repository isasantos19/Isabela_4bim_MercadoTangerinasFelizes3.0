
const { query } = require('../../../database');

exports.consultarMinhaConta = async (req, res) => {
    const idCliente = Number(req.params.id_cliente);

    // Verifica se o ID do cliente é válido
    if (!Number.isInteger(idCliente) || idCliente <= 0) {
        return res.status(400).json({
            mensagem: 'Identificação do cliente inválida.'
        });
    }

    try {
        // Busca os dados da pessoa e do cliente
        const resultado = await query(
            `SELECT
                PESSOA.id_pessoa,
                PESSOA.nome_pessoa,
                PESSOA.email_pessoa,
                CLIENTES.id_cliente,
                CLIENTES.cpf_cliente,
                CLIENTES.telefone_cliente,
                CLIENTES.cep_cliente,
                CLIENTES.rua_cliente,
                CLIENTES.numero_cliente,
                CLIENTES.complemento_cliente,
                CLIENTES.bairro_cliente,
                CLIENTES.cidade_cliente,
                CLIENTES.estado_cliente,
                CLIENTES.status_cliente
            FROM CLIENTES
            INNER JOIN PESSOA
                ON CLIENTES.id_pessoa = PESSOA.id_pessoa
            WHERE CLIENTES.id_cliente = $1`,
            [idCliente]
        );

        // Verifica se o cliente foi encontrado
        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensagem: 'Dados do cliente não encontrados.'
            });
        }

        // Retorna os dados cadastrais
        return res.status(200).json({
            cliente: resultado.rows[0]
        });

    } catch (error) {
        console.error('Erro ao consultar conta:', error);

        return res.status(500).json({
            mensagem: 'Não foi possível carregar os dados da conta.'
        });
    }
};


// Atualiza os dados do cliente
exports.atualizarMinhaConta = async (req, res) => {

    const idCliente = Number(req.params.id_cliente);

    const {
        nome_pessoa,
        email_pessoa,
        telefone_cliente,
        cep_cliente,
        rua_cliente,
        numero_cliente,
        complemento_cliente,
        bairro_cliente,
        cidade_cliente,
        estado_cliente
    } = req.body;

    // Verifica se o ID do cliente é válido
    if (!Number.isInteger(idCliente) || idCliente <= 0) {
        return res.status(400).json({
            mensagem: 'Identificação do cliente inválida.'
        });
    }

    // Verifica os campos obrigatórios
    if (!nome_pessoa || !email_pessoa || !telefone_cliente ||
        !cep_cliente || !rua_cliente || !numero_cliente ||
        !bairro_cliente || !cidade_cliente || !estado_cliente) {

        return res.status(400).json({
            mensagem: 'Preencha todos os campos obrigatórios.'
        });
    }

    try {

        // Atualiza os dados da pessoa e do cliente
        const resultado = await query(
            `WITH pessoa_atualizada AS (
                UPDATE PESSOA
                SET
                    nome_pessoa = $2,
                    email_pessoa = $3
                WHERE id_pessoa = (
                    SELECT id_pessoa
                    FROM CLIENTES
                    WHERE id_cliente = $1
                )
                RETURNING id_pessoa
            )
            UPDATE CLIENTES
            SET
                telefone_cliente = $4,
                cep_cliente = $5,
                rua_cliente = $6,
                numero_cliente = $7,
                complemento_cliente = $8,
                bairro_cliente = $9,
                cidade_cliente = $10,
                estado_cliente = $11
            WHERE id_cliente = $1
            AND id_pessoa = (
                SELECT id_pessoa
                FROM pessoa_atualizada
            )
            RETURNING id_cliente`,
            [
                idCliente,
                nome_pessoa.trim(),
                email_pessoa.trim().toLowerCase(),
                telefone_cliente,
                cep_cliente,
                rua_cliente.trim(),
                numero_cliente.trim(),
                complemento_cliente,
                bairro_cliente.trim(),
                cidade_cliente.trim(),
                estado_cliente.trim().toUpperCase()
            ]
        );

        // Verifica se o cliente foi encontrado
        if (resultado.rowCount === 0) {
            return res.status(404).json({
                mensagem: 'Dados do cliente não encontrados.'
            });
        }

        return res.status(200).json({
            mensagem: 'Dados atualizados com sucesso!'
        });

    } catch (error) {

        console.error('Erro ao atualizar conta:', error);

        // Verifica se o e-mail já está cadastrado
        if (error.code === '23505') {
            return res.status(409).json({
                mensagem: 'Este e-mail já está cadastrado.'
            });
        }

        return res.status(500).json({
            mensagem: 'Não foi possível atualizar os dados.'
        });
    }
};
