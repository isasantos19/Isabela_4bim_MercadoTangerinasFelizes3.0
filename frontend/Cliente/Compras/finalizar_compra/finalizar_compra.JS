
let produtos_carrinho = [];
let dados_cliente = {};

window.onload = function() {
    verificarCliente();
};


// Verifica se o cliente está logado
async function verificarCliente() {

    let id_cliente = sessionStorage.getItem("id_cliente");

    if (!id_cliente) {

        sessionStorage.setItem("pagina_retorno", window.location.href);

        window.location.href = "../../Acesso e Cadastro/login/login.HTML";
        return;
    }

    try {

        let resposta = await fetch("http://localhost:3001/api/minha-conta/" + id_cliente);

        let dados = await resposta.json();

        if (!resposta.ok) {
            document.getElementById("mensagem").textContent =
                dados.mensagem || "Não foi possível carregar sua conta.";
            return;
        }

        dados_cliente = dados.cliente;

        carregarEndereco();
        carregarCarrinho();

    } catch (erro) {
        document.getElementById("mensagem").textContent =
            "Não foi possível verificar sua conta.";
    }
}


// Carrega o endereço cadastrado do cliente
function carregarEndereco() {

    document.getElementById("cep").textContent = dados_cliente.cep_cliente || "";
    document.getElementById("rua").textContent = dados_cliente.rua_cliente || "";
    document.getElementById("numero").textContent = dados_cliente.numero_cliente || "";
    document.getElementById("complemento").textContent = dados_cliente.complemento_cliente || "";
    document.getElementById("bairro").textContent = dados_cliente.bairro_cliente || "";
    document.getElementById("cidade").textContent = dados_cliente.cidade_cliente || "";
    document.getElementById("estado").textContent = dados_cliente.estado_cliente || "";

}


// Carrega os produtos do carrinho
async function carregarCarrinho() {

    try {

        let identificador = localStorage.getItem("identificador_carrinho");

        if (!identificador) {
            document.getElementById("lista_produtos").textContent =
                "Carrinho temporário não encontrado.";

            document.getElementById("valor_total").textContent = "0,00";
            return;
        }

        let resposta = await fetch(
            "http://localhost:3001/api/carrinho/visitante/" + identificador
        );

        let dados = await resposta.json();

        if (!resposta.ok) {
            document.getElementById("lista_produtos").textContent =
                dados.mensagem || "Não foi possível carregar o carrinho.";
            return;
        }

        produtos_carrinho = dados.itens || [];

        if (produtos_carrinho.length == 0) {

            document.getElementById("lista_produtos").textContent =
                "Seu carrinho está vazio.";

            document.getElementById("valor_total").textContent = "0,00";
            return;
        }

        exibirProdutos();

    } catch (erro) {

        document.getElementById("lista_produtos").textContent =
            "Erro ao carregar os produtos.";

    }
}


// Exibe os produtos e calcula o total
function exibirProdutos() {

    let lista = document.getElementById("lista_produtos");

    lista.innerHTML = "";

    let total = 0;

    for (let i = 0; i < produtos_carrinho.length; i++) {

        let produto = produtos_carrinho[i];

        let subtotal = Number(produto.preco_produto) * Number(produto.quantidade);

        total += subtotal;

        let item = document.createElement("p");

        item.textContent =
            produto.nome_produto +
            " - Quantidade: " + produto.quantidade +
            " - Subtotal: R$ " + subtotal.toFixed(2).replace(".", ",");

        lista.appendChild(item);
    }

    document.getElementById("valor_total").textContent =
        total.toFixed(2).replace(".", ",");

}


// Mostra ou esconde a área de endereço
function alterarRecebimento() {

    let forma = document.querySelector('input[name="forma_recebimento"]:checked');

    if (forma && forma.value == "Entrega") {

        document.getElementById("area_endereco").style.display = "block";

    } else {

        document.getElementById("area_endereco").style.display = "none";

    }
}


// Mostra o endereço escolhido
function alterarEndereco() {

    let tipo = document.querySelector('input[name="tipo_endereco"]:checked');

    document.getElementById("endereco_cadastrado").style.display = "none";
    document.getElementById("endereco_alternativo").style.display = "none";

    if (tipo && tipo.value == "Cadastrado") {

        document.getElementById("endereco_cadastrado").style.display = "block";

    } else if (tipo && tipo.value == "Alternativo") {

        document.getElementById("endereco_alternativo").style.display = "block";

    }
}


// Busca o endereço alternativo pelo CEP
async function buscarCepAlternativo() {

    let cep = document.getElementById("cep_alternativo").value;
    let cep_numeros = "";

    for (let i = 0; i < cep.length; i++) {

        if (cep[i] >= "0" && cep[i] <= "9") {
            cep_numeros += cep[i];
        }

    }

    if (cep_numeros.length != 8) {

        document.getElementById("mensagem").textContent =
            "Informe um CEP válido com 8 números.";

        return;
    }

    try {

        let resposta = await fetch("https://viacep.com.br/ws/" + cep_numeros + "/json/");
        let dados = await resposta.json();

        if (dados.erro) {

            document.getElementById("mensagem").textContent =
                "CEP não encontrado.";

            return;
        }

        document.getElementById("rua_alternativa").value = dados.logradouro || "";
        document.getElementById("bairro_alternativo").value = dados.bairro || "";
        document.getElementById("cidade_alternativa").value = dados.localidade || "";
        document.getElementById("estado_alternativo").value = dados.uf || "";

        document.getElementById("mensagem").textContent =
            "Endereço preenchido! Confira os dados.";

    } catch (erro) {

        document.getElementById("mensagem").textContent =
            "Não foi possível consultar o CEP.";

    }
}


// Confirma o pedido
async function confirmarPedido() {

    let recebimento = document.querySelector('input[name="forma_recebimento"]:checked');
    let pagamento = document.querySelector('input[name="forma_pagamento"]:checked');

    let mensagem = document.getElementById("mensagem");
    let id_cliente = sessionStorage.getItem("id_cliente");
    let identificador = localStorage.getItem("identificador_carrinho");

    if (!id_cliente) {
        mensagem.textContent = "Faça login para continuar.";
        return;
    }

    if (!identificador) {
        mensagem.textContent = "Carrinho não encontrado.";
        return;
    }

    if (produtos_carrinho.length == 0) {
        mensagem.textContent = "Seu carrinho está vazio.";
        return;
    }

    if (!recebimento) {
        mensagem.textContent = "Selecione a forma de recebimento.";
        return;
    }

    if (!pagamento) {
        mensagem.textContent = "Selecione a forma de pagamento.";
        return;
    }

    // Dados básicos do pedido
    let pedido = {
        id_cliente: Number(id_cliente),
        identificador_temporario: identificador,
        forma_recebimento: recebimento.value,
        forma_pagamento: pagamento.value
    };

    // Verifica o endereço escolhido para entrega
    if (recebimento.value == "Entrega") {

        let tipo_endereco = document.querySelector('input[name="tipo_endereco"]:checked');

        if (!tipo_endereco) {
            mensagem.textContent = "Selecione um endereço de entrega.";
            return;
        }

        pedido.tipo_endereco = tipo_endereco.value;

        if (tipo_endereco.value == "Cadastrado") {

            if (!dados_cliente.cep_cliente || !dados_cliente.rua_cliente ||
                !dados_cliente.numero_cliente || !dados_cliente.bairro_cliente ||
                !dados_cliente.cidade_cliente || !dados_cliente.estado_cliente) {

                mensagem.textContent =
                    "Complete seu endereço cadastrado na área Minha conta.";

                return;
            }

            pedido.cep_entrega = dados_cliente.cep_cliente;
            pedido.rua_entrega = dados_cliente.rua_cliente;
            pedido.numero_entrega = dados_cliente.numero_cliente;
            pedido.complemento_entrega = dados_cliente.complemento_cliente;
            pedido.bairro_entrega = dados_cliente.bairro_cliente;
            pedido.cidade_entrega = dados_cliente.cidade_cliente;
            pedido.estado_entrega = dados_cliente.estado_cliente;

        } else {

            let cep = document.getElementById("cep_alternativo").value;
            let rua = document.getElementById("rua_alternativa").value.trim();
            let numero = document.getElementById("numero_alternativo").value.trim();
            let complemento = document.getElementById("complemento_alternativo").value.trim();
            let bairro = document.getElementById("bairro_alternativo").value.trim();
            let cidade = document.getElementById("cidade_alternativa").value.trim();
            let estado = document.getElementById("estado_alternativo").value.trim().toUpperCase();

            let cep_numeros = "";

            for (let i = 0; i < cep.length; i++) {

                if (cep[i] >= "0" && cep[i] <= "9") {
                    cep_numeros += cep[i];
                }

            }

            if (cep_numeros.length != 8 || rua == "" || numero == "" ||
                bairro == "" || cidade == "" || estado == "") {

                mensagem.textContent =
                    "Preencha corretamente todos os campos obrigatórios do endereço.";

                return;
            }

            if (estado.length != 2) {

                mensagem.textContent =
                    "Informe a sigla do estado com 2 letras.";

                return;
            }

            pedido.cep_entrega = cep_numeros;
            pedido.rua_entrega = rua;
            pedido.numero_entrega = numero;
            pedido.complemento_entrega = complemento;
            pedido.bairro_entrega = bairro;
            pedido.cidade_entrega = cidade;
            pedido.estado_entrega = estado;

        }

    }

    try {

        let resposta = await fetch("http://localhost:3001/api/finalizar-compra", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pedido)
        });

        let dados = await resposta.json();

        if (resposta.ok) {

            localStorage.removeItem("identificador_carrinho");

            mensagem.textContent = "Pedido realizado com sucesso!";

            window.location.href =
                "../../Area_conta/minha_compras/minha_compra.HTML";

        } else {

            mensagem.textContent =
                dados.mensagem || "Não foi possível realizar o pedido.";

        }

    } catch (erro) {

        mensagem.textContent =
            "Erro ao tentar confirmar o pedido.";

    }
}
