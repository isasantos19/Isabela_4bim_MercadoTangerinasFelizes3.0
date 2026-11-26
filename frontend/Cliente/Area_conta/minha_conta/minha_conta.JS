
let formulario = document.getElementById("form_conta");
let mensagem = document.getElementById("mensagem_conta");

let botao_editar = document.getElementById("editar_dados");
let botao_salvar = document.getElementById("salvar_dados");
let botao_cancelar = document.getElementById("cancelar_edicao");
let botao_cep = document.getElementById("buscar_cep");

let id_cliente = sessionStorage.getItem("id_cliente");

let campos = [
    "nome_pessoa",
    "email_pessoa",
    "telefone_cliente",
    "cep_cliente",
    "rua_cliente",
    "numero_cliente",
    "complemento_cliente",
    "bairro_cliente",
    "cidade_cliente",
    "estado_cliente"
];

let dados_originais = {};

// Carrega os dados do cliente
async function carregarDados() {

    if (!id_cliente) {
        mensagem.innerHTML = "Faça login para visualizar seus dados.";
        return;
    }

    try {
        let resposta = await fetch("http://localhost:3001/api/minha-conta/" + id_cliente);

        let dados = await resposta.json();

        if (resposta.ok) {

            let cliente = dados.cliente;

            document.getElementById("nome_pessoa").value = cliente.nome_pessoa;
            document.getElementById("email_pessoa").value = cliente.email_pessoa;
            document.getElementById("cpf_cliente").value = cliente.cpf_cliente;
            document.getElementById("telefone_cliente").value = cliente.telefone_cliente;
            document.getElementById("cep_cliente").value = cliente.cep_cliente;
            document.getElementById("rua_cliente").value = cliente.rua_cliente;
            document.getElementById("numero_cliente").value = cliente.numero_cliente;
            document.getElementById("complemento_cliente").value = cliente.complemento_cliente || "";
            document.getElementById("bairro_cliente").value = cliente.bairro_cliente;
            document.getElementById("cidade_cliente").value = cliente.cidade_cliente;
            document.getElementById("estado_cliente").value = cliente.estado_cliente;

        } else {
            mensagem.innerHTML = dados.mensagem || "Não foi possível carregar seus dados.";
        }

    } catch (erro) {
        mensagem.innerHTML = "Erro ao conectar com o servidor.";
    }
}


// Guarda os dados atuais para permitir o cancelamento
function guardarDados() {

    dados_originais = {};

    for (let i = 0; i < campos.length; i++) {

        let campo = document.getElementById(campos[i]);

        dados_originais[campos[i]] = campo.value;
    }
}


// Permite editar os dados
botao_editar.onclick = function() {

    guardarDados();

    for (let i = 0; i < campos.length; i++) {

        document.getElementById(campos[i]).readOnly = false;
    }

    botao_editar.hidden = true;
    botao_salvar.hidden = false;
    botao_cancelar.hidden = false;
    botao_cep.hidden = false;

    mensagem.innerHTML = "Você pode editar seus dados.";
};


// Cancela a edição
botao_cancelar.onclick = function() {

    for (let i = 0; i < campos.length; i++) {

        let campo = document.getElementById(campos[i]);

        campo.value = dados_originais[campos[i]];
        campo.readOnly = true;
    }

    botao_editar.hidden = false;
    botao_salvar.hidden = true;
    botao_cancelar.hidden = true;
    botao_cep.hidden = true;

    mensagem.innerHTML = "Alterações canceladas.";
};


// Busca o endereço pelo CEP
botao_cep.onclick = async function() {

    let cep = document.getElementById("cep_cliente").value;
    let cep_numeros = "";

    for (let i = 0; i < cep.length; i++) {

        if (cep[i] >= "0" && cep[i] <= "9") {
            cep_numeros += cep[i];
        }
    }

    cep = cep_numeros;

    if (cep.length != 8) {
        mensagem.innerHTML = "Informe um CEP válido com 8 números.";
        return;
    }

    try {

        let resposta = await fetch("https://viacep.com.br/ws/" + cep + "/json/");
        let dados = await resposta.json();

        if (dados.erro) {
            mensagem.innerHTML = "CEP não encontrado.";
            return;
        }

        document.getElementById("rua_cliente").value = dados.logradouro || "";
        document.getElementById("bairro_cliente").value = dados.bairro || "";
        document.getElementById("cidade_cliente").value = dados.localidade || "";
        document.getElementById("estado_cliente").value = dados.uf || "";

        mensagem.innerHTML = "Endereço preenchido! Confira os dados.";

    } catch (erro) {
        mensagem.innerHTML = "Não foi possível consultar o CEP.";
    }
};


// Salva as alterações
formulario.onsubmit = async function(event) {

    event.preventDefault();

    let nome = document.getElementById("nome_pessoa").value.trim();
    let email = document.getElementById("email_pessoa").value.trim();
    let telefone = document.getElementById("telefone_cliente").value;
    let cep = document.getElementById("cep_cliente").value;

    let rua = document.getElementById("rua_cliente").value.trim();
    let numero = document.getElementById("numero_cliente").value.trim();
    let complemento = document.getElementById("complemento_cliente").value.trim();
    let bairro = document.getElementById("bairro_cliente").value.trim();
    let cidade = document.getElementById("cidade_cliente").value.trim();
    let estado = document.getElementById("estado_cliente").value.trim().toUpperCase();

    // Guarda somente os números do telefone e CEP
    let telefone_numeros = "";
    let cep_numeros = "";

    for (let i = 0; i < telefone.length; i++) {

        if (telefone[i] >= "0" && telefone[i] <= "9") {
            telefone_numeros += telefone[i];
        }
    }

    for (let i = 0; i < cep.length; i++) {

        if (cep[i] >= "0" && cep[i] <= "9") {
            cep_numeros += cep[i];
        }
    }

    telefone = telefone_numeros;
    cep = cep_numeros;

    // Verifica os campos obrigatórios
    if (nome == "" || email == "" || telefone == "" || cep == "" ||
        rua == "" || numero == "" || bairro == "" || cidade == "" || estado == "") {

        mensagem.innerHTML = "Preencha todos os campos obrigatórios.";
        return;
    }

    if (telefone.length != 10 && telefone.length != 11) {
        mensagem.innerHTML = "Informe um telefone válido.";
        return;
    }

    if (cep.length != 8) {
        mensagem.innerHTML = "O CEP deve possuir 8 números.";
        return;
    }

    if (estado.length != 2) {
        mensagem.innerHTML = "Informe a sigla do estado com 2 letras.";
        return;
    }

    // Dados enviados para o servidor
    let cliente = {
        nome_pessoa: nome,
        email_pessoa: email,
        telefone_cliente: telefone,
        cep_cliente: cep,
        rua_cliente: rua,
        numero_cliente: numero,
        complemento_cliente: complemento,
        bairro_cliente: bairro,
        cidade_cliente: cidade,
        estado_cliente: estado
    };

    try {

        let resposta = await fetch("http://localhost:3001/api/minha-conta/" + id_cliente, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cliente)
        });

        let dados = await resposta.json();

        if (resposta.ok) {

            mensagem.innerHTML = "Dados atualizados com sucesso!";

            for (let i = 0; i < campos.length; i++) {
                document.getElementById(campos[i]).readOnly = true;
            }

            botao_editar.hidden = false;
            botao_salvar.hidden = true;
            botao_cancelar.hidden = true;
            botao_cep.hidden = true;

            carregarDados();

        } else {
            mensagem.innerHTML = dados.mensagem || "Não foi possível atualizar os dados.";
        }

    } catch (erro) {
        mensagem.innerHTML = "Erro ao conectar com o servidor.";
    }
};


// Carrega os dados ao abrir a página
carregarDados();
