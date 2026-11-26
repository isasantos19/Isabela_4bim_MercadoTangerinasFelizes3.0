
const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const { query } = require('./database');

// ROTAS DO CLIENTE
const cadastroRoutes = require('./routes/Clientes Routes/Acesso e Cadastro/cadastroRoutes');
const loginRoutes = require('./routes/Clientes Routes/Acesso e Cadastro/loginRoutes');

// ÁREA DA CONTA
const detalharPedidoRoutes = require('./routes/Clientes Routes/Area_conta/detalhar_pedidoRoutes');
const minhasComprasRoutes = require('./routes/Clientes Routes/Area_conta/minha_compraRoutes');
const minhaContaRoutes = require('./routes/Clientes Routes/Area_conta/minha_contaRoutes');

// ÁREA PÚBLICA
const produtosClienteRoutes = require('./routes/Clientes Routes/Area_publica/produtosRoutes');

// COMPRAS
const carrinhoRoutes = require('./routes/Clientes Routes/Compras/carrinhoRoutes');
const finalizarCompraRoutes = require('./routes/Clientes Routes/Compras/finalizar_compraRoutes');

// ROTAS DO ADMINISTRADOR
const produtosRoutes = require('./routes/Adm Routes/produtosRoutes');
const categoriasRoutes = require('./routes/Adm Routes/categoriasRoutes');
const fornecedoresRoutes = require('./routes/Adm Routes/fornecedoresRoutes');
const clientesRoutes = require('./routes/Adm Routes/clientesRoutes');
const estoqueRoutes = require('./routes/Adm Routes/estoqueRoutes');
const menuRoutes = require('./routes/Adm Routes/menuRoutes');
const administradoresRoutes = require('./routes/Adm Routes/administradoresRoutes.JS');

// CONFIGURAÇÃO DO SERVIDOR
const app = express();

app.use(cors());
app.use(express.json());

// ARQUIVOS ESTÁTICOS
app.use('/imagens', express.static(path.join(__dirname, '../imagens')));
app.use('/frontend', express.static(path.join(__dirname, '../frontend')));

// PÁGINA INICIAL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// ROTAS DO CLIENTE
app.use('/api/cadastro', cadastroRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/detalhar-pedido', detalharPedidoRoutes);
app.use('/api/minhas-compras', minhasComprasRoutes);
app.use('/api/minha-conta', minhaContaRoutes);
app.use('/api/produtos', produtosClienteRoutes);
app.use('/api/carrinho', carrinhoRoutes);
app.use('/api/finalizar-compra', finalizarCompraRoutes);

// ROTAS DO ADMINISTRADOR
app.use('/menu', menuRoutes);
app.use('/produtos', produtosRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/fornecedores', fornecedoresRoutes);
app.use('/clientes', clientesRoutes);
app.use('/estoque', estoqueRoutes);
app.use('/administradores', administradoresRoutes);

// INICIALIZAÇÃO DO SERVIDOR
const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
    console.log('\n=================================');
    console.log(`Servidor integrado executando na porta ${PORT}`);

    try {
        await query('SELECT 1');
        console.log(`Banco de Dados ${process.env.DB_NAME} conectado com sucesso!`);
    } catch (error) {
        console.error('FALHA NA CONEXÃO COM O BANCO DE DADOS:');
        console.error(`Motivo: ${error.message}`);
        console.error('Verifique as configurações do arquivo .env.');
    }

    console.log('=================================\n');
});
