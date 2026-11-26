let listaProdutos = document.getElementById("lista_produtos");
let listaCategorias = document.getElementById("lista_categorias");
let mensagemProdutos = document.getElementById("mensagem_produtos");

let formPesquisa = document.getElementById("form_pesquisa");
let campoPesquisa = document.getElementById("pesquisa");

let produtos = [];
let categoriaSelecionada = "";

let enderecoAPI = "http://localhost:3001";

let tempoNotificacao;

// Criar notificação
let notificacao = document.createElement("div");

notificacao.textContent = "Produto adicionado ao carrinho!";

notificacao.style.position = "fixed";
notificacao.style.bottom = "25px";
notificacao.style.right = "25px";
notificacao.style.backgroundColor = "#238636";
notificacao.style.color = "#ffffff";
notificacao.style.padding = "16px 22px";
notificacao.style.borderRadius = "8px";
notificacao.style.boxShadow = "0 3px 12px rgba(0, 0, 0, 0.2)";
notificacao.style.fontSize = "14px";
notificacao.style.fontWeight = "bold";
notificacao.style.zIndex = "1000";
notificacao.style.display = "none";

document.body.appendChild(notificacao);

// Exibir notificação
function exibirNotificacao() {
    notificacao.style.display = "block";

    clearTimeout(tempoNotificacao);

    tempoNotificacao = setTimeout(function() {
        notificacao.style.display = "none";
    }, 3000);
}

// Obter ou criar o carrinho temporário
async function obterIdentificadorCarrinho() {
    let identificador = localStorage.getItem("identificador_carrinho");

    // Verificar se o carrinho salvo ainda existe no banco
    if (identificador) {
        let verificacao = await fetch(
            enderecoAPI + "/api/carrinho/visitante/" + identificador
        );

        if (verificacao.ok) {
            return identificador;
        }

        // Se o carrinho não existir mais, apagar o identificador antigo
        if (verificacao.status === 404) {
            localStorage.removeItem("identificador_carrinho");
            identificador = null;
        } else {
            throw new Error("Não foi possível verificar o carrinho.");
        }
    }

    // Criar um novo carrinho
    let resposta = await fetch(enderecoAPI + "/api/carrinho", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({})
    });

    let dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.mensagem || "Não foi possível criar o carrinho.");
    }

    identificador = dados.carrinho.identificador_temporario;

    localStorage.setItem("identificador_carrinho", identificador);

    return identificador;
}

// Adicionar produto ao carrinho
async function adicionarAoCarrinho(idProduto) {
    try {
        let identificador = await obterIdentificadorCarrinho();

        let resposta = await fetch(
            enderecoAPI + "/api/carrinho/visitante/" +
            identificador + "/itens",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id_produto: idProduto,
                    quantidade: 1
                })
            }
        );

        let dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.mensagem || "Não foi possível adicionar o produto.");
            return;
        }

        exibirNotificacao();

    } catch (erro) {
        alert("Não foi possível conectar ao servidor.");
    }
}

// Escolher ícone da categoria
function escolherIcone(nomeCategoria) {
    let nome = nomeCategoria.toLowerCase();

    if (nome.includes("fruta")) return "🍎";
    if (nome.includes("verdura") || nome.includes("legume")) return "🥬";
    if (nome.includes("carne")) return "🥩";
    if (nome.includes("bebida")) return "🥤";
    if (nome.includes("padaria") || nome.includes("pão")) return "🍞";
    if (nome.includes("laticínio") || nome.includes("laticinio")) return "🧀";
    if (nome.includes("mercearia")) return "🛒";
    if (nome.includes("limpeza")) return "🧽";

    return "🛍️";
}

// Carregar produtos
async function carregarProdutos() {
    mensagemProdutos.textContent = "Carregando produtos...";
    listaProdutos.innerHTML = "";

    let resposta = await fetch(enderecoAPI + "/api/produtos");

    if (!resposta.ok) {
        mensagemProdutos.textContent = "Não foi possível carregar os produtos.";
        return;
    }

    let dados = await resposta.json();
    produtos = dados.produtos;

    carregarCategorias();
    filtrarProdutos();
}

// Criar categorias automaticamente
function carregarCategorias() {
    listaCategorias.innerHTML = "";

    let botaoTodos = criarBotaoCategoria("Todos", "", "🛒");
    listaCategorias.appendChild(botaoTodos);

    let categorias = [];

    for (let i = 0; i < produtos.length; i++) {
        let existe = false;

        for (let j = 0; j < categorias.length; j++) {
            if (categorias[j].id_categoria === produtos[i].id_categoria) {
                existe = true;
            }
        }

        if (!existe) {
            categorias.push({
                id_categoria: produtos[i].id_categoria,
                nome_categoria: produtos[i].nome_categoria
            });
        }
    }

    for (let i = 0; i < categorias.length; i++) {
        let icone = escolherIcone(categorias[i].nome_categoria);

        let botao = criarBotaoCategoria(
            categorias[i].nome_categoria,
            categorias[i].id_categoria,
            icone
        );

        listaCategorias.appendChild(botao);
    }
}

function criarBotaoCategoria(nome, id, icone) {
    let botao = document.createElement("button");
    botao.type = "button";
    botao.classList.add("categoria");

    if (String(id) === "") {
        botao.classList.add("ativa");
    }

    botao.dataset.categoria = id;

    let imagem = document.createElement("span");
    imagem.classList.add("icone_categoria");
    imagem.textContent = icone;

    let texto = document.createElement("span");
    texto.classList.add("nome_categoria");
    texto.textContent = nome;

    botao.appendChild(imagem);
    botao.appendChild(texto);

    botao.addEventListener("click", function() {
        selecionarCategoria(id, botao);
    });

    return botao;
}

function selecionarCategoria(idCategoria, botaoSelecionado) {
    categoriaSelecionada = String(idCategoria);

    let botoes = listaCategorias.querySelectorAll(".categoria");

    for (let i = 0; i < botoes.length; i++) {
        botoes[i].classList.remove("ativa");
    }

    botaoSelecionado.classList.add("ativa");

    filtrarProdutos();
}

function filtrarProdutos() {
    let nomePesquisa = campoPesquisa.value.toLowerCase().trim();
    let resultado = [];

    for (let i = 0; i < produtos.length; i++) {
        let nomeProduto = produtos[i].nome_produto.toLowerCase();
        let nomeCorresponde = nomeProduto.includes(nomePesquisa);

        let categoriaCorresponde =
            categoriaSelecionada === "" ||
            String(produtos[i].id_categoria) === categoriaSelecionada;

        if (nomeCorresponde && categoriaCorresponde) {
            resultado.push(produtos[i]);
        }
    }

    exibirProdutos(resultado);
}

// Exibir produtos
function exibirProdutos(lista) {
    listaProdutos.innerHTML = "";

    if (lista.length === 0) {
        mensagemProdutos.textContent = "Nenhum produto encontrado.";
        return;
    }

    mensagemProdutos.textContent = "";

    for (let i = 0; i < lista.length; i++) {
        let produto = lista[i];

        let artigo = document.createElement("article");

        let imagem = document.createElement("img");
        imagem.src = produto.imagem_produto;
        imagem.alt = produto.nome_produto;

        let nome = document.createElement("h4");
        nome.textContent = produto.nome_produto;

        let preco = document.createElement("p");
        preco.textContent = "Preço: R$ " +
            Number(produto.preco_produto).toFixed(2).replace(".", ",");

        let unidade = document.createElement("p");
        unidade.textContent = "Unidade: " + produto.unidade_produto;

        let botaoAdicionar = document.createElement("button");
        botaoAdicionar.type = "button";
        botaoAdicionar.classList.add("botao_adicionar");
        botaoAdicionar.textContent = "Adicionar ao carrinho";

        botaoAdicionar.addEventListener("click", function() {
            adicionarAoCarrinho(produto.id_produto);
        });

        artigo.appendChild(imagem);
        artigo.appendChild(nome);
        artigo.appendChild(preco);
        artigo.appendChild(unidade);
        artigo.appendChild(botaoAdicionar);

        listaProdutos.appendChild(artigo);
    }
}

// Pesquisar produtos
formPesquisa.addEventListener("submit", function(event) {
    event.preventDefault();
    filtrarProdutos();
});

// Iniciar página
async function iniciarPagina() {
    try {
        await carregarProdutos();
    } catch (erro) {
        mensagemProdutos.textContent = "Não foi possível conectar ao servidor.";
    }
}

iniciarPagina();

// Acessar minhas compras
let linkMinhasCompras = document.getElementById("link_minhas_compras");

linkMinhasCompras.addEventListener("click", function(event) {
    event.preventDefault();

    let idCliente = sessionStorage.getItem("id_cliente");

    if (idCliente) {
        window.location.href = linkMinhasCompras.href;
    } else {
        sessionStorage.setItem("pagina_retorno", linkMinhasCompras.href);
        window.location.href = "../Cliente/Acesso e Cadastro/login/login.HTML";
    }
});