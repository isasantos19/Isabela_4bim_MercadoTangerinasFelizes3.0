
let formulario = document.getElementById("form_cadastro");
let mensagem = document.getElementById("mensagem_cadastro");
let botao_cep = document.getElementById("buscar_cep");

// Busca o endereço pelo CEP
botao_cep.onclick = async function() {

    let cep = document.getElementById("cep_cliente").value;
    let cep_numeros = "";

    // Guarda somente os números do CEP
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
        mensagem.innerHTML = "Não foi possível consultar o CEP. Preencha o endereço manualmente.";
    }
};


// Realiza o cadastro
formulario.onsubmit = async function(event) {

    event.preventDefault();

    let nome = document.getElementById("nome_pessoa").value.trim();
    let email = document.getElementById("email_pessoa").value.trim();
    let senha = document.getElementById("senha_pessoa").value;
    let confirmar_senha = document.getElementById("confirmar_senha").value;

    let cpf = document.getElementById("cpf_cliente").value;
    let telefone = document.getElementById("telefone_cliente").value;
    let cep = document.getElementById("cep_cliente").value;

    // Guarda somente os números do CPF, telefone e CEP
    let cpf_numeros = "";
    let telefone_numeros = "";
    let cep_numeros = "";

    for (let i = 0; i < cpf.length; i++) {
        if (cpf[i] >= "0" && cpf[i] <= "9") {
            cpf_numeros += cpf[i];
        }
    }

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

    cpf = cpf_numeros;
    telefone = telefone_numeros;
    cep = cep_numeros;

    let rua = document.getElementById("rua_cliente").value.trim();
    let numero = document.getElementById("numero_cliente").value.trim();
    let complemento = document.getElementById("complemento_cliente").value.trim();
    let bairro = document.getElementById("bairro_cliente").value.trim();
    let cidade = document.getElementById("cidade_cliente").value.trim();
    let estado = document.getElementById("estado_cliente").value.trim().toUpperCase();

    // Verifica os campos obrigatórios
    if (nome == "" || email == "" || senha == "" || confirmar_senha == "" ||
        cpf == "" || telefone == "" || cep == "" || rua == "" ||
        numero == "" || bairro == "" || cidade == "" || estado == "") {

        mensagem.innerHTML = "Preencha todos os campos obrigatórios.";
        return;
    }

    if (senha.length < 8) {
        mensagem.innerHTML = "A senha deve ter pelo menos 8 caracteres.";
        return;
    }

    if (senha != confirmar_senha) {
        mensagem.innerHTML = "As senhas não coincidem.";
        return;
    }

    if (cpf.length != 11) {
        mensagem.innerHTML = "O CPF deve possuir 11 números.";
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
        senha_pessoa: senha,
        cpf_cliente: cpf,
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
        let resposta = await fetch("http://localhost:3001/api/cadastro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cliente)
        });

        let dados = await resposta.json();

        if (resposta.ok) {
            mensagem.innerHTML = "Cadastro realizado com sucesso!";
            formulario.reset();

            window.location.href = "../login/login.HTML";
        } else {
            mensagem.innerHTML = dados.mensagem || "Não foi possível realizar o cadastro.";
        }

    } catch (erro) {
        mensagem.innerHTML = "Erro ao conectar com o servidor.";
    }
};
