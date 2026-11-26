
let mensagemPedido = document.getElementById("mensagem_pedido");
let informacoesPedido = document.getElementById("informacoes_pedido");

let parametros = new URLSearchParams(window.location.search);
let idPedido = parametros.get("id_pedido");
let idCliente = sessionStorage.getItem("id_cliente");

async function carregarPedido() {

    if (!idPedido || !/^\d+$/.test(idPedido) ||
        !idCliente || !/^\d+$/.test(idCliente)) {

        mensagemPedido.textContent = "Pedido não encontrado.";
        return;
    }

    try {

        let resposta = await fetch(
        "http://localhost:3001/api/detalhar-pedido/" + encodeURIComponent(idPedido) +
        "?id_cliente=" + encodeURIComponent(idCliente)
        );

        let dados = await resposta.json();

        if (!resposta.ok) {
            mensagemPedido.textContent =
                dados.mensagem || "Não foi possível encontrar o pedido.";
            return;
        }

        let pedido = dados.pedido;
        let itens = dados.itens;

        document.getElementById("id_pedido").textContent =
            "Número do pedido: " + pedido.id_pedido;

        document.getElementById("data_pedido").textContent =
            "Data do pedido: " +
            new Date(pedido.data_pedido).toLocaleString("pt-BR");

        document.getElementById("status_pedido").textContent =
            "Status: " + pedido.status_pedido;

        document.getElementById("forma_recebimento").textContent =
            "Forma de recebimento: " + pedido.forma_recebimento;

        document.getElementById("forma_pagamento").textContent =
            "Forma de pagamento: " + pedido.forma_pagamento;

        let endereco = "";

        if (pedido.rua_entrega) {

            endereco = pedido.rua_entrega + ", " + pedido.numero_entrega;

            if (pedido.complemento_entrega) {
                endereco += " - " + pedido.complemento_entrega;
            }

            endereco += " - " + pedido.bairro_entrega;
            endereco += ", " + pedido.cidade_entrega;
            endereco += " - " + pedido.estado_entrega;
            endereco += " - CEP: " + pedido.cep_entrega;

        } else {
            endereco = "Retirada na loja.";
        }

        document.getElementById("endereco_entrega").textContent =
            endereco;

        let listaProdutos = document.getElementById("lista_produtos");

        listaProdutos.innerHTML = "";

        for (let i = 0; i < itens.length; i++) {

            let produto = itens[i];

            let item = document.createElement("div");

            let imagem = document.createElement("img");
            imagem.src = produto.imagem_produto;
            imagem.alt = produto.nome_produto;
            imagem.width = 100;

            let nome = document.createElement("h4");
            nome.textContent = produto.nome_produto;

            let unidade = document.createElement("p");
            unidade.textContent = "Unidade: " + produto.unidade_produto;

            let quantidade = document.createElement("p");
            quantidade.textContent = "Quantidade: " + produto.quantidade;

            let preco = document.createElement("p");
            preco.textContent = "Preço unitário: " +
                Number(produto.preco_unitario).toLocaleString(
                    "pt-BR",
                    { style: "currency", currency: "BRL" }
                );

            let subtotal = document.createElement("p");
            subtotal.textContent = "Subtotal: " +
                Number(produto.subtotal).toLocaleString(
                    "pt-BR",
                    { style: "currency", currency: "BRL" }
                );

            item.appendChild(imagem);
            item.appendChild(nome);
            item.appendChild(unidade);
            item.appendChild(quantidade);
            item.appendChild(preco);
            item.appendChild(subtotal);

            listaProdutos.appendChild(item);
        }

        document.getElementById("total_pedido").textContent =
            "Total: " + Number(pedido.total_pedido).toLocaleString(
                "pt-BR",
                { style: "currency", currency: "BRL" }
            );

        mensagemPedido.textContent = "";
        informacoesPedido.hidden = false;

    } catch (erro) {

        mensagemPedido.textContent =
            "Não foi possível carregar os detalhes do pedido.";

    }
}

carregarPedido();
