let formulario = document.getElementById("form_login");
let mensagem = document.getElementById("mensagem_login");
let mostrar_senha = document.getElementById("mostrar_senha");
let campo_senha = document.getElementById("senha_pessoa");

let opcoes_acesso = document.getElementById("opcoes_acesso");
let link_cadastro = document.getElementById("link_cadastro");

// Caminhos das páginas
let pagina_cliente = "../../../../index.html";
let pagina_adm = "/frontend/Area_administrativa/Menu/menu.HTML";

// Mostra ou esconde a senha
mostrar_senha.onchange = function() {

    if (mostrar_senha.checked) {
        campo_senha.type = "text";
    } else {
        campo_senha.type = "password";
    }

};

// Entra na área do cliente
function entrarCliente() {

    sessionStorage.setItem("tipo_acesso", "cliente");

    let pagina_retorno = sessionStorage.getItem("pagina_retorno");

    if (pagina_retorno) {

        sessionStorage.removeItem("pagina_retorno");
        window.location.href = pagina_retorno;

    } else {

        window.location.href = pagina_cliente;

    }

}

// Entra na área administrativa
function entrarAdm() {

    sessionStorage.setItem("tipo_acesso", "adm");
    window.location.href = pagina_adm;

}

// Mostra as opções de acesso
function mostrarAcessos(acessos) {

    if (acessos.cliente && acessos.adm) {

        formulario.style.display = "none";
        link_cadastro.style.display = "none";

        opcoes_acesso.style.display = "block";

        mensagem.innerHTML = "Login realizado com sucesso! Escolha como deseja entrar:";

        document.getElementById("acesso_cliente").onclick = entrarCliente;
        document.getElementById("acesso_adm").onclick = entrarAdm;

    } else if (acessos.cliente) {

        entrarCliente();

    } else if (acessos.adm) {

        entrarAdm();

    }

}

// Realiza o login
formulario.onsubmit = async function(event) {

    event.preventDefault();

    let email = document.getElementById("email_pessoa").value.trim();
    let senha = campo_senha.value;

    if (email == "" || senha == "") {

        mensagem.innerHTML = "Preencha o e-mail e a senha.";
        return;

    }

    if (!email.includes("@") || !email.includes(".")) {

        mensagem.innerHTML = "Informe um e-mail válido.";
        return;

    }

    let dados_login = {
        email_pessoa: email,
        senha_pessoa: senha
    };

    try {

        let resposta = await fetch("http://localhost:3001/api/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(dados_login)

        });

        let dados = await resposta.json();

        if (resposta.ok) {

            sessionStorage.setItem("id_pessoa", dados.pessoa.id_pessoa);
            sessionStorage.setItem("permissao_adm", dados.acessos.adm);

            if (dados.cliente) {

                sessionStorage.setItem("id_cliente", dados.cliente.id_cliente);

            } else {

                sessionStorage.removeItem("id_cliente");

            }

            mostrarAcessos(dados.acessos);

        } else {

            mensagem.innerHTML = dados.mensagem || "E-mail ou senha incorretos.";

        }

    } catch (erro) {

        mensagem.innerHTML = "Erro ao conectar com o servidor.";

    }

};