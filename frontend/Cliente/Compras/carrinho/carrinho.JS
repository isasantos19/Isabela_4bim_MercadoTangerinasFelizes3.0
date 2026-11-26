
let itens_carrinho = [];

let enderecoAPI = "http://localhost:3001";

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

// Carregar carrinho
async function carregarCarrinho() {
    try {
        let identificador = await obterIdentificadorCarrinho();

        let resposta = await fetch(
            enderecoAPI + "/api/carrinho/visitante/" + identificador
        );

        let dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.mensagem || "Não foi possível carregar o carrinho.");
        }

        let lista = document.getElementById("lista_carrinho");
        lista.innerHTML = "";

        itens_carrinho = dados.itens;

        if (itens_carrinho.length === 0) {
            lista.innerHTML = "<p>Seu carrinho está vazio.</p>";

            document.getElementById("subtotal").textContent = "R$ 0,00";
            document.getElementById("total").textContent = "R$ 0,00";
            document.getElementById("botao_finalizar").style.pointerEvents = "none";

            return;
        }

        document.getElementById("botao_finalizar").style.pointerEvents = "auto";

        let subtotal_geral = 0;

        for (let i = 0; i < itens_carrinho.length; i++) {
            let produto = itens_carrinho[i];

            let preco_produto = Number(produto.preco_produto);
            let subtotal_produto = preco_produto * produto.quantidade;

            subtotal_geral += subtotal_produto;

            let item = document.createElement("div");

            let imagem = document.createElement("img");
            imagem.src = produto.imagem_produto;
            imagem.alt = produto.nome_produto;

            let nome = document.createElement("h3");
            nome.textContent = produto.nome_produto;

            let preco = document.createElement("p");
            preco.textContent = "Preço: " + preco_produto.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });

            let unidade = document.createElement("p");
            unidade.textContent = "Unidade: " + produto.unidade_produto;

            let quantidade = document.createElement("input");
            quantidade.type = "number";
            quantidade.min = "1";
            quantidade.value = produto.quantidade;

            quantidade.onchange = function() {
                alterarQuantidade(produto.id_produto, quantidade.value);
            };

            let subtotal = document.createElement("p");
            subtotal.textContent = "Subtotal: " + subtotal_produto.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });

            let botao_remover = document.createElement("button");
            botao_remover.type = "button";
            botao_remover.textContent = "Remover";

            botao_remover.onclick = function() {
                removerProduto(produto.id_produto);
            };

            item.appendChild(imagem);
            item.appendChild(nome);
            item.appendChild(preco);
            item.appendChild(unidade);
            item.appendChild(quantidade);
            item.appendChild(subtotal);
            item.appendChild(botao_remover);

            lista.appendChild(item);
        }

        document.getElementById("subtotal").textContent =
            subtotal_geral.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });

        document.getElementById("total").textContent =
            subtotal_geral.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });

    } catch (erro) {
        document.getElementById("lista_carrinho").innerHTML =
            "<p>Não foi possível carregar o carrinho.</p>";

        document.getElementById("subtotal").textContent = "R$ 0,00";
        document.getElementById("total").textContent = "R$ 0,00";

        document.getElementById("botao_finalizar").style.pointerEvents = "none";
    }
}

// Alterar quantidade
async function alterarQuantidade(id_produto, quantidade) {
    quantidade = parseInt(quantidade);

    if (quantidade < 1 || isNaN(quantidade)) {
        alert("Informe uma quantidade válida.");
        carregarCarrinho();
        return;
    }

    try {
        let identificador = await obterIdentificadorCarrinho();

        let resposta = await fetch(
            enderecoAPI + "/api/carrinho/visitante/" +
            identificador + "/itens/" + id_produto,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    quantidade: quantidade
                })
            }
        );

        let dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.mensagem || "Não foi possível alterar a quantidade.");
        }

        carregarCarrinho();

    } catch (erro) {
        alert("Não foi possível conectar ao servidor.");
    }
}

// Remover produto
async function removerProduto(id_produto) {
    let confirmar = confirm("Deseja remover este produto do carrinho?");

    if (confirmar) {
        try {
            let identificador = await obterIdentificadorCarrinho();

            let resposta = await fetch(
                enderecoAPI + "/api/carrinho/visitante/" +
                identificador + "/itens/" + id_produto,
                {
                    method: "DELETE"
                }
            );

            let dados = await resposta.json();

            if (!resposta.ok) {
                alert(dados.mensagem || "Não foi possível remover o produto.");
                return;
            }

            carregarCarrinho();

        } catch (erro) {
            alert("Não foi possível conectar ao servidor.");
        }
    }
}

// Iniciar página
carregarCarrinho();
