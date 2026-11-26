
const { query } = require('../../../database');
const bcrypt = require('bcryptjs');

exports.entrarCliente = async (req, res) => {
    const { email_pessoa, senha_pessoa } = req.body;

    // Verifica se os campos foram preenchidos
    if (!email_pessoa || !senha_pessoa) {
        return res.status(400).json({
            mensagem: 'Informe o e-mail e a senha.'
        });
    }

    try {
        // Procura a pessoa e verifica seus acessos
        const resultado = await query(
            `SELECT
                PESSOA.id_pessoa,
                PESSOA.nome_pessoa,
                PESSOA.email_pessoa,
                PESSOA.senha_pessoa,
                PESSOA.permissao_adm,
                CLIENTES.id_cliente,
                CLIENTES.status_cliente
            FROM PESSOA
            LEFT JOIN CLIENTES
                ON PESSOA.id_pessoa = CLIENTES.id_pessoa
            WHERE PESSOA.email_pessoa = $1`,
            [email_pessoa.trim().toLowerCase()]
        );

        // Verifica se a conta foi encontrada
        if (resultado.rows.length === 0) {
            return res.status(401).json({
                mensagem: 'E-mail ou senha incorretos.'
            });
        }

        const pessoa = resultado.rows[0];

        // Verifica se existe uma senha cadastrada
        if (!pessoa.senha_pessoa) {
            return res.status(401).json({
                mensagem: 'E-mail ou senha incorretos.'
            });
        }

        // Confere a senha
        const senhaCorreta = await bcrypt.compare(
            senha_pessoa,
            pessoa.senha_pessoa
        );

        if (!senhaCorreta) {
            return res.status(401).json({
                mensagem: 'E-mail ou senha incorretos.'
            });
        }

        // Verifica as permissões de acesso
        const pode_entrar_adm = pessoa.permissao_adm === true;

        const pode_entrar_cliente =
            pessoa.id_cliente != null &&
            pessoa.status_cliente === true;

        // Impede o acesso se a conta não tiver nenhum acesso disponível
        if (!pode_entrar_adm && !pode_entrar_cliente) {
            return res.status(403).json({
                mensagem: 'Esta conta não possui acesso disponível.'
            });
        }

        // Retorna os dados necessários para o frontend
        return res.status(200).json({
            mensagem: 'Login realizado com sucesso!',
            pessoa: {
                id_pessoa: pessoa.id_pessoa,
                nome_pessoa: pessoa.nome_pessoa,
                email_pessoa: pessoa.email_pessoa
            },
            cliente: pode_entrar_cliente ? {
                id_cliente: pessoa.id_cliente
            } : null,
            acessos: {
                cliente: pode_entrar_cliente,
                adm: pode_entrar_adm
            }
        });

    } catch (error) {
        console.error('Erro ao realizar login:', error);

        return res.status(500).json({
            mensagem: 'Não foi possível realizar o login.'
        });
    }
};
