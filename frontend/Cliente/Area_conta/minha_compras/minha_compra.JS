
let lista_compras = document.getElementById("lista_compras");
let mensagem = document.getElementById("mensagem_compras");

// Busca as compras do cliente
async function carregarCompras() {
    try {
        let idCliente = sessionStorage.getItem("id_cliente");

        if (!idCliente) {
            mensagem.textContent = "Faça login para consultar suas compras.";
            return;
        }

        let resposta = await fetch("http://localhost:3001/api/minhas-compras/" + idCliente);
        let dados = await resposta.json();

        if (resposta.ok) {
            lista_compras.innerHTML = "";

            if (dados.compras.length == 0) {
                lista_compras.innerHTML = "<p>Você ainda não realizou nenhuma compra.</p>";
                return;
            }

            // Cria a tabela de compras
            let tabela = document.createElement("table");
            let cabecalho = document.createElement("tr");

            let coluna_numero = document.createElement("th");
            coluna_numero.textContent = "Pedido";

            let coluna_data = document.createElement("th");
            coluna_data.textContent = "Data";

            let coluna_status = document.createElement("th");
            coluna_status.textContent = "Status";

            let coluna_total = document.createElement("th");
            coluna_total.textContent = "Total";

            let coluna_detalhes = document.createElement("th");
            coluna_detalhes.textContent = "Detalhes";

            cabecalho.appendChild(coluna_numero);
            cabecalho.appendChild(coluna_data);
            cabecalho.appendChild(coluna_status);
            cabecalho.appendChild(coluna_total);
            cabecalho.appendChild(coluna_detalhes);
            tabela.appendChild(cabecalho);

            // Exibe cada pedido
            for (let i = 0; i < dados.compras.length; i++) {
                let pedido = dados.compras[i];
                let linha = document.createElement("tr");

                let numero = document.createElement("td");
                numero.textContent = pedido.id_pedido;

                let data = document.createElement("td");
                data.textContent = new Date(pedido.data_pedido).toLocaleDateString("pt-BR");

                let status = document.createElement("td");
                status.textContent = pedido.status_pedido;

                let total = document.createElement("td");
                total.textContent = Number(pedido.total_pedido).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                });

                let detalhes = document.createElement("td");
                let link = document.createElement("a");
                link.textContent = "Ver pedido";

                link.href = "../detalhar_pedido/detalhar_pedido.HTML?id_pedido=" + pedido.id_pedido;

                detalhes.appendChild(link);
                linha.appendChild(numero);
                linha.appendChild(data);
                linha.appendChild(status);
                linha.appendChild(total);
                linha.appendChild(detalhes);
                tabela.appendChild(linha);
            }

            lista_compras.appendChild(tabela);

        } else {
            mensagem.textContent = dados.mensagem || "Não foi possível carregar suas compras.";
        }

    } catch (erro) {
        mensagem.textContent = "Erro ao conectar com o servidor.";
    }
}

carregarCompras();
