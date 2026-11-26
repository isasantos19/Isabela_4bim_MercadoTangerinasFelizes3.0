
const { pool } = require('../../database');
const bcrypt = require('bcryptjs');

// Verifica se quem está realizando a ação é administrador
async function verificarAdministrador(email, senha) {
    const resultado = await pool.query(
        `SELECT id_pessoa, senha_pessoa, permissao_adm
         FROM PESSOA
         WHERE email_pessoa = $1`,
        [email.trim().toLowerCase()]
    );

    if (resultado.rows.length === 0) {
        return false;
    }

    const administrador = resultado.rows[0];

    if (administrador.permissao_adm !== true) {
        return false;
    }

    const senhaCorreta = await bcrypt.compare(
        senha,
        administrador.senha_pessoa
    );

    return senhaCorreta;
}

// Cadastra um novo administrador
exports.cadastrarAdministrador = async (req, res) => {
    const {
        email_adm,
        senha_adm,
        nome_pessoa,
        email_pessoa,
        senha_pessoa
    } = req.body;

    if (!email_adm || !senha_adm ||
        !nome_pessoa || !email_pessoa || !senha_pessoa) {
        return res.status(400).json({
            mensagem: 'Preencha todos os campos.'
        });
    }

    if (!email_pessoa.includes('@') ||
        !email_pessoa.includes('.')) {
        return res.status(400).json({
            mensagem: 'Informe um e-mail válido.'
        });
    }

    if (nome_pessoa.length > 100 ||
        email_pessoa.length > 150 ||
        senha_pessoa.length > 255) {
        return res.status(400).json({
            mensagem: 'Um ou mais campos possuem tamanho inválido.'
        });
    }

    try {
        const autorizado = await verificarAdministrador(
            email_adm,
            senha_adm
        );

        if (!autorizado) {
            return res.status(403).json({
                mensagem: 'Apenas um administrador autorizado pode cadastrar outro administrador.'
            });
        }

        const senhaCriptografada = await bcrypt.hash(
            senha_pessoa,
            10
        );

        const resultado = await pool.query(
            `INSERT INTO PESSOA
                (nome_pessoa, email_pessoa, senha_pessoa, permissao_adm)
             VALUES ($1, $2, $3, TRUE)
             RETURNING id_pessoa, nome_pessoa, email_pessoa`,
            [
                nome_pessoa.trim(),
                email_pessoa.trim().toLowerCase(),
                senhaCriptografada
            ]
        );

        return res.status(201).json({
            mensagem: 'Administrador cadastrado com sucesso!',
            administrador: resultado.rows[0]
        });

    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({
                mensagem: 'Este e-mail já está cadastrado.'
            });
        }

        console.error('Erro ao cadastrar administrador:', error);

        return res.status(500).json({
            mensagem: 'Não foi possível cadastrar o administrador.'
        });
    }
};

// Lista os administradores cadastrados
exports.listarAdministradores = async (req, res) => {
    const { email_adm, senha_adm } = req.body;

    if (!email_adm || !senha_adm) {
        return res.status(400).json({
            mensagem: 'Informe o e-mail e a senha do administrador.'
        });
    }

    try {
        const autorizado = await verificarAdministrador(
            email_adm,
            senha_adm
        );

        if (!autorizado) {
            return res.status(403).json({
                mensagem: 'Acesso não autorizado.'
            });
        }

        const resultado = await pool.query(
            `SELECT id_pessoa, nome_pessoa, email_pessoa
             FROM PESSOA
             WHERE permissao_adm = TRUE
             ORDER BY nome_pessoa`
        );

        return res.status(200).json({
            administradores: resultado.rows
        });

    } catch (error) {
        console.error('Erro ao listar administradores:', error);

        return res.status(500).json({
            mensagem: 'Não foi possível listar os administradores.'
        });
    }
};
