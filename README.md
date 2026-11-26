# Mercado Tangerinas Felizes

Projeto desenvolvido para a disciplina de Desenvolvimento Web 1 (DW1), como atividade avaliativa do 4º bimestre de 2026.

O **Mercado Tangerinas Felizes** é uma aplicação web desenvolvida para simular o funcionamento de um mercado, oferecendo funcionalidades para clientes e administradores por meio de uma interface integrada a um banco de dados PostgreSQL.

O sistema utiliza a arquitetura Cliente/Servidor e o padrão MVC (Model-View-Controller), com Node.js e Express no Back-end.

---

# 1. Sobre o projeto

O projeto consiste no desenvolvimento de um sistema de gerenciamento de mercado, dividido em duas áreas principais:

- **Área do Cliente:** permite navegar pelos produtos, utilizar o carrinho de compras, realizar pedidos e gerenciar informações da conta.
- **Área Administrativa:** permite gerenciar os dados e as operações relacionadas ao funcionamento do mercado.

A aplicação foi organizada para oferecer uma experiência de navegação integrada, permitindo que os clientes consultem os produtos antes de realizar o login e acessem as funcionalidades que exigem identificação durante o processo de compra.

---

# 2. Objetivo

Desenvolver uma aplicação web funcional que simule as operações de um mercado, aplicando os conhecimentos de desenvolvimento Web, integração com banco de dados, arquitetura Cliente/Servidor e padrão MVC.

O sistema busca integrar as funcionalidades destinadas aos clientes com os recursos administrativos necessários para o gerenciamento do mercado.

---

# 3. Tecnologias utilizadas

## Front-end
- HTML5
- CSS3
- JavaScript

## Back-end
- Node.js
- Express
- CORS
- Multer

## Banco de dados
- PostgreSQL

## Versionamento
- Git
- GitHub

---

# 4. Arquitetura do projeto

O sistema utiliza a arquitetura Cliente/Servidor e o padrão MVC (Model-View-Controller).

## 4.1 Front-end

O Front-end é responsável pela interface visual e pela interação com os usuários.

Foi desenvolvido utilizando HTML, CSS e JavaScript, sendo organizado em duas áreas:

- Área do Cliente;
- Área Administrativa.

As páginas realizam requisições ao servidor utilizando `fetch()`, permitindo consultar, enviar e atualizar informações.

## 4.2 Back-end

O Back-end foi desenvolvido utilizando Node.js e Express.

É responsável por:

- Receber as requisições do Front-end;
- Encaminhar as requisições para as rotas correspond
