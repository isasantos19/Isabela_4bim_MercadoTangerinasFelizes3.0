
const { Pool } = require('pg');
const path = require('path');

// Carrega o arquivo .env localizado na pasta backend
require('dotenv').config({
    path: path.resolve(__dirname, '.env')
});

// Lista de variáveis obrigatórias
const variaveisObrigatorias = [
    'DB_HOST',
    'DB_PORT',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD'
];

// Verifica se todas as variáveis foram definidas
for (const variavel of variaveisObrigatorias) {

    if (!process.env[variavel]) {

        throw new Error(
            `A variável de ambiente '${variavel}' não está definida no arquivo .env`
        );

    }

}

// Configuração da conexão com PostgreSQL
const pool = new Pool({

    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD

});

// Exporta a conexão e a função de consulta
module.exports = {

    query: (text, params) => pool.query(text, params),

    pool

};
