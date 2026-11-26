
let formulario = document.getElementById("form_administrador");
let mensagem = document.getElementById("mensagem");
let lista = document.getElementById("lista_administradores");
let botao_listar = document.getElementById("listar_administradores");

// Cadastra um administrador
formulario.onsubmit = async function(event) {
    event.preventDefault();

    let email_adm = document.getElementById("email_adm").value.trim();
    let senha_adm = document.getElementById("senha_adm").value;

    let nome_pessoa = document.getElementById("nome_pessoa").value.trim();
    let email_pessoa = document.getElementById("email_pessoa").value.trim();
    let senha_pessoa = document.getElementById("senha_pessoa").value;

    if (email_adm == "" || senha_adm == "" ||
        nome_pessoa == "" || email_pessoa == "" ||
        senha_pessoa == "") {

        mensagem.innerHTML = "Preencha todos os campos.";
        return;
    }

    try {
        let resposta = await fetch("http://localhost:3001/administradores/cadastrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email_adm: email_adm,
                senha_adm: senha_adm,
                nome_pessoa: nome_pessoa,
                email_pessoa: email_pessoa,
                senha_pessoa: senha_pessoa
            })
        });

        let dados = await resposta.json();

        mensagem.innerHTML = dados.mensagem;

        if (resposta.ok) {
            formulario.reset();
            document.getElementById("senha_adm").value = "";
            lista.innerHTML = "";
        }

    } catch (erro) {
        mensagem.innerHTML = "Erro ao conectar com o servidor.";
    }
};

// Consulta os administradores
botao_listar.onclick = async function() {
    let email_adm = document.getElementById("email_adm").value.trim();
    let senha_adm = document.getElementById("senha_adm").value;

    if (email_adm == "" || senha_adm == "") {
        mensagem.innerHTML = "Informe seu e-mail e senha de administrador.";
        return;
    }

    try {
        let resposta = await fetch("http://localhost:3001/administradores/listar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email_adm: email_adm,
                senha_adm: senha_adm
            })
        });

        let dados = await resposta.json();

        if (resposta.ok) {
            lista.innerHTML = "";

            if (dados.administradores.length == 0) {
                lista.innerHTML = "Nenhum administrador cadastrado.";
                return;
            }

            for (let i = 0; i < dados.administradores.length; i++) {
                lista.innerHTML += `
                    <div class="administrador">
                        <strong>${dados.administradores[i].nome_pessoa}</strong>
                        <p>${dados.administradores[i].email_pessoa}</p>
                    </div>
                `;
            }

            mensagem.innerHTML = "Administradores consultados com sucesso.";

        } else {
            mensagem.innerHTML = dados.mensagem;
        }

    } catch (erro) {
        mensagem.innerHTML = "Erro ao consultar os administradores.";
    }
};
