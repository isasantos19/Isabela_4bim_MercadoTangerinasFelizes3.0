
const { pool } = require('../../../database');
const bcrypt = require('bcryptjs');

exports.cadastrarCliente = async (req, res) => {
    const {
        nome_pessoa,
        email_pessoa,
        senha_pessoa,
        cpf_cliente,
        telefone_cliente,
        cep_cliente,
        rua_cliente,
        numero_cliente,
        complemento_cliente,
        bairro_cliente,
        cidade_cliente,
        estado_cliente
    } = req.body;

    // Verifica os campos obrigatórios
    if (
        !nome_pessoa || !email_pessoa || !senha_pessoa ||
        !cpf_cliente || !telefone_cliente || !cep_cliente ||
        !rua_cliente || !numero_cliente || !bairro_cliente ||
        !cidade_cliente || !estado_cliente
    ) {
        return res.status(400).json({
            mensagem: 'Preencha todos os campos obrigatórios.'
        });
    }

    // Verifica o formato básico do e-mail
    if (!email_pessoa.includes('@') || !email_pessoa.includes('.')) {
        return res.status(400).json({
            mensagem: 'Informe um e-mail válido.'
        });
    }

    // Remove caracteres que não sejam números do CPF e CEP
    let cpf = '';
    for (let i = 0; i < cpf_cliente.length; i++) {
        if (cpf_cliente[i] >= '0' && cpf_cliente[i] <= '9') {
            cpf += cpf_cliente[i];
        }
    }

    let cep = '';
    for (let i = 0; i < cep_cliente.length; i++) {
        if (cep_cliente[i] >= '0' && cep_cliente[i] <= '9') {
            cep += cep_cliente[i];
        }
    }

    if (cpf.length !== 11) {
        return res.status(400).json({
            mensagem: 'O CPF deve possuir 11 números.'
        });
    }

    if (cep.length !== 8) {
        return res.status(400).json({
            mensagem: 'O CEP deve possuir 8 números.'
        });
    }

    // Verifica o tamanho dos campos
    if (nome_pessoa.length > 100 || email_pessoa.length > 150 ||
        senha_pessoa.length > 255 || telefone_cliente.length > 20 ||
        rua_cliente.length > 150 || numero_cliente.length > 20 ||
        (complemento_cliente && complemento_cliente.length > 100) ||
        bairro_cliente.length > 100 || cidade_cliente.length > 100 ||
        estado_cliente.length !== 2) {

        return res.status(400).json({
            mensagem: 'Um ou mais campos possuem tamanho inválido.'
        });
    }

    let conexao;

    try {
        conexao = await pool.connect();

        // Inicia a transação
        await conexao.query('BEGIN');

        // Criptografa a senha
        const senhaCriptografada = await bcrypt.hash(senha_pessoa, 10);

        // Cadastra a pessoa e recebe o ID gerado pelo PostgreSQL
        const resultadoPessoa = await conexao.query(
            `INSERT INTO PESSOA
            (nome_pessoa, email_pessoa, senha_pessoa)
            VALUES ($1, $2, $3)
            RETURNING id_pessoa`,
            [
                nome_pessoa.trim(),
                email_pessoa.trim().toLowerCase(),
                senhaCriptografada
            ]
        );

        const idPessoa = resultadoPessoa.rows[0].id_pessoa;

        // Cadastra os dados do cliente utilizando o ID da pessoa
        await conexao.query(
            `INSERT INTO CLIENTES
            (
                id_pessoa,
                cpf_cliente,
                telefone_cliente,
                cep_cliente,
                rua_cliente,
                numero_cliente,
                complemento_cliente,
                bairro_cliente,
                cidade_cliente,
                estado_cliente
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
                idPessoa,
                cpf,
                telefone_cliente,
                cep,
                rua_cliente.trim(),
                numero_cliente.trim(),
                complemento_cliente ? complemento_cliente.trim() : null,
                bairro_cliente.trim(),
                cidade_cliente.trim(),
                estado_cliente.trim().toUpperCase()
            ]
        );

        // Confirma as duas inserções
        await conexao.query('COMMIT');

        return res.status(201).json({
            mensagem: 'Cadastro realizado com sucesso!',
            id_pessoa: idPessoa
        });

    } catch (error) {
        // Desfaz as inserções caso ocorra algum erro
        if (conexao) {
            await conexao.query('ROLLBACK');
        }

        if (error.code === '23505') {
            return res.status(409).json({
                mensagem: 'Este e-mail ou CPF já está cadastrado.'
            });
        }

        console.error('Erro ao cadastrar cliente:', error);

        return res.status(500).json({
            mensagem: 'Não foi possível realizar o cadastro.'
        });

    } finally {
        if (conexao) {
            conexao.release();
        }
    }
};
