
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const produtoController = require('../../controllers/Adm Controllers/produtosController');

// Caminho da pasta de imagens na raiz do projeto
const pastaImagens = path.join(__dirname, '../../../imagens');

// Cria a pasta caso ela ainda não exista
if (!fs.existsSync(pastaImagens)) {
    fs.mkdirSync(pastaImagens, { recursive: true });
}

// Configuração do armazenamento das imagens
const armazenamento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, pastaImagens);
    },

    filename: (req, file, cb) => {
        cb(null, path.basename(file.originalname));
    }
});

const upload = multer({
    storage: armazenamento
});

// Rotas do CRUD de Produtos

router.get('/listar', produtoController.listarProdutos);

router.get('/:id', produtoController.obterProduto);

router.post('/imagem', upload.single('imagem'), produtoController.enviarImagem);

router.post('/', produtoController.criarProduto);

router.put('/:id', produtoController.atualizarProduto);

router.delete('/:id', produtoController.deletarProduto);

module.exports = router;
