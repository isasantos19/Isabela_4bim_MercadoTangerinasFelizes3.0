# 🍊 Mercado Tangerinas Felizes

**Sistema Web de Gerenciamento de Mercado**

Projeto desenvolvido para a disciplina de **Desenvolvimento Web 1 (DW1)**, como atividade avaliativa do **4º bimestre de 2026**, do curso Técnico Integrado em Informática para Internet.

O **Mercado Tangerinas Felizes** é uma aplicação web que simula o funcionamento de um mercado, integrando funcionalidades de consulta e compra de produtos para clientes e ferramentas administrativas para o gerenciamento do estabelecimento.

O sistema foi desenvolvido utilizando HTML5, CSS3, JavaScript, Node.js, Express e PostgreSQL, seguindo a arquitetura Cliente/Servidor e o padrão de desenvolvimento MVC (Model-View-Controller).

---

# 1. Apresentação do projeto

O Mercado Tangerinas Felizes foi desenvolvido com o objetivo de oferecer uma plataforma que reúna, em um único sistema, as operações de gerenciamento de um mercado e as funcionalidades necessárias para a experiência de compra dos clientes.

A aplicação é dividida em duas áreas principais:

- **Área do Cliente:** destinada à navegação pelos produtos, utilização do carrinho de compras, realização de pedidos e gerenciamento das informações pessoais.
- **Área Administrativa:** destinada ao gerenciamento dos cadastros, produtos, categorias, estoque, fornecedores, clientes e administradores.

A aplicação permite que os visitantes consultem os produtos disponíveis sem a necessidade de realizar login. O carrinho também pode ser utilizado antes da autenticação, enquanto a finalização da compra exige que o usuário esteja identificado no sistema.

O projeto busca integrar as duas áreas por meio de um banco de dados relacional, mantendo as informações organizadas e permitindo que as operações realizadas sejam refletidas nas funcionalidades correspondentes.

---

# 2. Objetivos

## 2.1 Objetivo geral

Desenvolver uma aplicação web funcional para simular o gerenciamento de um mercado, integrando as funcionalidades destinadas aos clientes e aos administradores, utilizando os conhecimentos adquiridos durante a disciplina de Desenvolvimento Web 1.

## 2.2 Objetivos específicos

- Desenvolver uma interface web organizada e intuitiva.
- Implementar funcionalidades de cadastro, consulta, atualização e exclusão de registros.
- Aplicar a arquitetura Cliente/Servidor.
- Utilizar o padrão MVC para organizar o Back-end.
- Desenvolver uma API para comunicação entre Front-end e Back-end.
- Integrar a aplicação a um banco de dados PostgreSQL.
- Implementar relacionamentos entre as entidades do banco de dados.
- Gerenciar contas, clientes e permissões administrativas.
- Desenvolver funcionalidades de consulta e gerenciamento de produtos.
- Implementar um carrinho de compras e o processo de registro de pedidos.
- Trabalhar com o envio e a exibição de imagens.
- Aplicar validações e restrições para manter a integridade das informações.

---

# 3. Tecnologias utilizadas

O desenvolvimento do projeto utiliza tecnologias voltadas à construção de interfaces web, processamento de requisições no servidor e armazenamento de informações.

## 3.1 Front-end

| Tecnologia | Utilização |
|---|---|
| HTML5 | Estruturação das páginas da aplicação. |
| CSS3 | Estilização e organização visual das interfaces. |
| JavaScript | Validações, interações e comunicação com o servidor. |

## 3.2 Back-end

| Tecnologia | Utilização |
|---|---|
| Node.js | Ambiente de execução JavaScript no servidor. |
| Express | Criação do servidor e gerenciamento das rotas. |
| CORS | Configuração da comunicação entre diferentes origens. |
| Multer | Recebimento e processamento de arquivos enviados pela aplicação. |

## 3.3 Banco de dados

| Tecnologia | Utilização |
|---|---|
| PostgreSQL | Sistema gerenciador de banco de dados relacional. |
| SQL | Criação, consulta e manipulação das informações. |

## 3.4 Versionamento

| Tecnologia | Utilização |
|---|---|
| Git | Controle de versões do código-fonte. |
| GitHub | Hospedagem e compartilhamento do repositório. |

---

# 4. Arquitetura e organização do sistema

O projeto utiliza a arquitetura Cliente/Servidor e o padrão MVC (Model-View-Controller), separando as responsabilidades de apresentação, processamento das requisições e manipulação dos dados.

## 4.1 Arquitetura Cliente/Servidor

A aplicação é dividida em duas partes que trabalham de forma integrada:

**Cliente:**
- Apresenta as páginas e os elementos visuais.
- Recebe as informações fornecidas pelos usuários.
- Realiza validações no Front-end.
- Envia requisições ao servidor.
- Apresenta os resultados recebidos.

**Servidor:**
- Recebe as requisições do Front-end.
- Processa as operações solicitadas.
- Acessa o banco de dados.
- Executa as regras de negócio.
- Retorna respostas à aplicação.

A comunicação entre essas partes ocorre por meio de requisições HTTP, utilizando JavaScript e `fetch()`.

## 4.2 Padrão MVC

O padrão MVC organiza a aplicação em responsabilidades distintas:

**Model (Modelo)**

Representa a camada responsável pela interação com os dados e pelo acesso ao banco de dados.

**View (Visualização)**

Corresponde à interface apresentada ao usuário, desenvolvida com HTML, CSS e JavaScript.

**Controller (Controlador)**

Contém a lógica responsável por processar as solicitações recebidas, executar as operações necessárias e retornar as respostas.

## 4.3 Routes (Rotas)

As rotas definem os caminhos utilizados para acessar as funcionalidades do servidor.

Elas recebem as requisições HTTP e encaminham cada operação ao Controller correspondente.

O projeto possui organização de rotas separada para as funcionalidades administrativas e para as funcionalidades dos clientes.

Os principais métodos HTTP utilizados são:

| Método | Finalidade |
|---|---|
| GET | Consultar informações. |
| POST | Cadastrar informações. |
| PUT | Atualizar informações existentes. |
| DELETE | Excluir registros quando permitido. |

## 4.4 Controllers (Controladores)

Os Controllers processam as solicitações encaminhadas pelas rotas.

Entre suas responsabilidades estão:

- Consultar registros no banco de dados.
- Cadastrar novas informações.
- Atualizar dados existentes.
- Excluir registros quando permitido.
- Processar operações relacionadas aos clientes.
- Gerenciar operações administrativas.
- Manipular informações dos produtos e pedidos.
- Processar arquivos enviados pela aplicação.

---

# 5. Funcionalidades da Área do Cliente

A Área do Cliente foi desenvolvida para permitir que os usuários naveguem pelos produtos e realizem compras no Mercado Tangerinas Felizes.

## 5.1 Página inicial

A página inicial apresenta o mercado e funciona como ponto de entrada para a navegação pelo sistema.

Permite acessar as principais funcionalidades destinadas aos visitantes e clientes.

## 5.2 Consulta de produtos

Os visitantes podem visualizar os produtos disponíveis sem precisar realizar login.

As informações apresentadas incluem:

- Nome do produto.
- Imagem.
- Preço.
- Unidade de venda.

Também é possível acessar uma página de detalhes para consultar informações específicas de cada produto.

## 5.3 Cadastro e autenticação

O sistema disponibiliza funcionalidades para criação de contas e autenticação dos usuários.

Entre as operações estão:

- Cadastro de novas contas.
- Login.
- Validação das informações fornecidas.
- Acesso às funcionalidades destinadas aos clientes autenticados.
- Identificação de permissões administrativas.

As permissões são associadas à conta do usuário, permitindo diferenciar o acesso às áreas do sistema.

Uma conta com permissão administrativa também pode utilizar as funcionalidades destinadas aos clientes.

## 5.4 Carrinho de compras

O carrinho permite organizar os produtos selecionados pelo usuário antes da realização de um pedido.

Suas funcionalidades incluem:

- Adicionar produtos.
- Consultar os itens selecionados.
- Alterar quantidades.
- Remover produtos.
- Visualizar os valores correspondentes aos itens.

O carrinho pode ser utilizado antes do login, permitindo que o visitante selecione produtos durante a navegação.

## 5.5 Finalização da compra

A finalização da compra exige autenticação.

Nessa etapa, o cliente pode revisar os produtos selecionados, informar os dados necessários e registrar seu pedido.

As informações são encaminhadas ao Back-end para processamento e armazenamento no banco de dados.

## 5.6 Minha conta

A área Minha Conta permite consultar e gerenciar as informações cadastrais do cliente.

Essa funcionalidade centraliza os dados relacionados à conta e ao cadastro pessoal.

## 5.7 Endereços

O sistema contempla o gerenciamento de endereços associados ao cliente, permitindo utilizar essas informações durante o processo de compra.

## 5.8 Minhas compras

A página Minhas Compras permite consultar os pedidos realizados pelo cliente.

O histórico possibilita acompanhar os registros das compras e acessar informações específicas de cada pedido.

## 5.9 Detalhes do pedido

A página de detalhes apresenta as informações referentes a um pedido selecionado, incluindo os dados relacionados à compra e aos produtos correspondentes.

---

# 6. Funcionalidades da Área Administrativa

A Área Administrativa reúne os recursos destinados ao gerenciamento do Mercado Tangerinas Felizes.

O acesso é permitido às contas que possuem autorização administrativa.

Os módulos são organizados de acordo com as responsabilidades de cada operação.

## 6.1 Gerenciamento de administradores

Permite gerenciar as contas que possuem permissão administrativa no sistema.

Essa
