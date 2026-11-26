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

Essa funcionalidade possibilita controlar quais usuários estão autorizados a acessar a área administrativa.

## 6.2 Gerenciamento de categorias

Responsável pela organização dos produtos em categorias.

Permite:

- Cadastrar categorias.
- Consultar categorias.
- Listar categorias.
- Atualizar informações.
- Excluir categorias quando permitido.

## 6.3 Gerenciamento de produtos

Responsável pelo cadastro e pela manutenção dos produtos comercializados pelo mercado.

Permite:

- Cadastrar produtos.
- Consultar produtos.
- Listar produtos.
- Atualizar informações.
- Excluir produtos quando permitido.
- Associar produtos às respectivas categorias.
- Gerenciar imagens dos produtos.

## 6.4 Gerenciamento de estoque

Responsável pelo controle das informações relacionadas à disponibilidade dos produtos.

Permite acompanhar e atualizar os registros de estoque, auxiliando no gerenciamento dos produtos comercializados.

## 6.5 Gerenciamento de fornecedores

Responsável pelo armazenamento e gerenciamento das informações dos fornecedores.

Permite:

- Cadastrar fornecedores.
- Consultar fornecedores.
- Listar fornecedores.
- Atualizar informações.
- Excluir fornecedores quando permitido.

## 6.6 Gerenciamento de clientes

Responsável pela consulta e pelo gerenciamento dos cadastros dos clientes.

O sistema considera a desativação de clientes como alternativa à exclusão definitiva, preservando os registros e o histórico de compras relacionados ao cadastro.

---

# 7. Banco de dados

O projeto utiliza o PostgreSQL para armazenar e organizar as informações necessárias ao funcionamento do sistema.

A modelagem relacional contempla as entidades relacionadas às contas, aos clientes, aos produtos, às compras e ao gerenciamento administrativo.

## 7.1 Principais entidades

Entre as principais entidades utilizadas na estrutura do banco estão:

| Entidade | Responsabilidade |
|---|---|
| PESSOA | Armazenar informações relacionadas às pessoas e às permissões das contas. |
| CLIENTES | Armazenar informações específicas dos clientes. |
| ENDERECOS | Registrar os endereços associados aos clientes. |
| CATEGORIAS | Organizar os produtos em categorias. |
| PRODUTOS | Armazenar os dados dos produtos comercializados. |
| ESTOQUE | Registrar informações relacionadas à disponibilidade dos produtos. |
| FORNECEDORES | Armazenar os dados dos fornecedores. |
| CARRINHOS | Registrar os carrinhos de compras. |
| ITENS_CARRINHO | Armazenar os produtos adicionados aos carrinhos. |
| PEDIDOS | Registrar os pedidos realizados pelos clientes. |

A estrutura também contempla tabelas associativas necessárias aos relacionamentos N:N definidos na modelagem.

## 7.2 Relacionamentos

O banco utiliza relacionamentos para conectar as informações das diferentes entidades.

Entre os relacionamentos presentes na modelagem estão:

- **PESSOA e CLIENTES (1:1):** relaciona uma pessoa ao seu cadastro de cliente.
- **CLIENTES e ENDERECOS:** relaciona os clientes aos seus endereços.
- **CATEGORIAS e PRODUTOS (1:N):** permite associar diversos produtos a uma categoria.
- **CLIENTES e PEDIDOS (1:N):** permite que um cliente possua vários pedidos.
- **CLIENTES e CARRINHOS (1:N):** permite relacionar carrinhos aos clientes, considerando também a possibilidade de carrinhos temporários.
- **CARRINHOS e ITENS_CARRINHO (1:N):** permite armazenar vários itens em um mesmo carrinho.
- **Relacionamentos N:N:** são representados por tabelas associativas, responsáveis por conectar as entidades envolvidas.

## 7.3 Integridade dos dados

A modelagem utiliza restrições para manter a consistência das informações armazenadas.

Entre elas estão:

| Restrição | Finalidade |
|---|---|
| PRIMARY KEY | Identificar exclusivamente cada registro. |
| FOREIGN KEY | Estabelecer relacionamentos entre tabelas. |
| UNIQUE | Impedir valores duplicados em campos específicos. |
| NOT NULL | Impedir valores nulos em campos obrigatórios. |
| DEFAULT | Definir valores automaticamente quando não forem informados. |

Também são consideradas regras para controlar a exclusão e a atualização de registros relacionados.

## 7.4 Desativação de clientes

O sistema utiliza o conceito de desativação para preservar os registros dos clientes.

Em vez de excluir definitivamente um cadastro, é possível alterar seu status, mantendo as informações e os relacionamentos necessários para a consulta do histórico de compras.

Essa abordagem contribui para a preservação da integridade dos dados.

## 7.5 Contas e permissões

O gerenciamento das contas considera a separação entre as informações gerais da pessoa e os dados específicos do cadastro de cliente.

A permissão administrativa é associada à conta, permitindo que um mesmo usuário autorizado utilize a Área do Cliente e a Área Administrativa.

---

# 8. Gerenciamento de imagens

O sistema permite trabalhar com imagens dos produtos, contribuindo para a apresentação visual do catálogo.

O envio dos arquivos é processado pelo Back-end utilizando o Multer.

As imagens são armazenadas na pasta `imagens/` e disponibilizadas pelo servidor para utilização nas páginas do Front-end.

Esse processo permite associar imagens aos produtos cadastrados e exibi-las durante a navegação pelo mercado.

---

# 9. Validações e regras de negócio

O sistema utiliza validações para reduzir o envio de informações incorretas e garantir que as operações respeitem as regras estabelecidas.

As validações são realizadas no JavaScript do Front-end e complementadas pelas restrições do banco de dados e pelo processamento do Back-end.

Entre as regras consideradas estão:

- Verificação das informações fornecidas nos formulários.
- Validação dos dados necessários para cadastro e autenticação.
- Controle de acesso às funcionalidades administrativas.
- Exigência de autenticação para finalizar compras.
- Associação dos pedidos aos clientes correspondentes.
- Preservação do histórico de compras.
- Controle dos relacionamentos entre os registros.
- Verificação das operações permitidas antes de atualizar ou excluir informações.

---

# 10. Comunicação entre Front-end e Back-end

A comunicação entre as interfaces e o servidor é realizada por requisições HTTP.

O JavaScript utiliza `fetch()` para enviar solicitações e receber respostas da API.

O processo ocorre da seguinte maneira:

1. O usuário realiza uma ação na interface.
2. O Front-end prepara e envia uma requisição HTTP.
3. O servidor recebe a solicitação por meio de uma rota.
4. A rota encaminha a operação ao Controller correspondente.
5. O Controller executa a lógica necessária.
6. Quando necessário, ocorre uma operação no PostgreSQL.
7. O servidor retorna uma resposta.
8. O Front-end apresenta o resultado ao usuário.

Essa organização permite separar a interface visual das operações responsáveis pelo processamento dos dados.

---

# 11. Estrutura de diretórios

A aplicação possui uma organização dividida entre os arquivos do Front-end, do Back-end e os recursos utilizados pelo sistema.

A estrutura principal é composta por:

```text
Mercado-Tangerinas-Felizes/
│
├── backend/
│   ├── controllers/
│   │   ├── Adm Controllers/
│   │   └── Clientes Controllers/
│   │
│   ├── routes/
│   │   ├── Adm Routes/
│   │   └── Clientes Routes/
│   │
│   ├── Gerar Senha/
│   ├── database.js
│   └── server.js
│
├── frontend/
│   ├── Area_administrativa/
│   ├── Cliente/
│   └── Menu/
│
├── imagens/
│
├── index.html
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

**Observação:** a estrutura acima apresenta a organização principal do projeto. Algumas pastas possuem arquivos e subpastas adicionais destinados às funcionalidades específicas de cada área.

## 11.1 Pasta backend

Contém os arquivos responsáveis pelo funcionamento do servidor, incluindo:

- Controllers;
- Routes;
- Conexão com o banco de dados;
- Configuração e inicialização do servidor;
- Recursos auxiliares.

## 11.2 Pasta frontend

Contém as páginas, os arquivos CSS e os scripts JavaScript utilizados nas interfaces.

Está organizada de acordo com as áreas do sistema:

- Área Administrativa;
- Área do Cliente;
- Menu.

## 11.3 Pasta imagens

Armazena as imagens utilizadas pela aplicação, incluindo os arquivos associados aos produtos e aos elementos visuais do site.

---

# 12. Configuração do ambiente

Para executar o projeto, é necessário possuir o Node.js e o PostgreSQL instalados e configurados.

A conexão com o banco de dados utiliza variáveis de ambiente, evitando deixar informações de acesso diretamente no código-fonte.

As variáveis utilizadas são:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=nome_do_banco
```

Os valores devem ser substituídos pelas informações correspondentes ao ambiente local.

**Importante:** o arquivo `.env` contém informações privadas e não deve ser compartilhado ou enviado ao GitHub.

---

# 13. Instalação e execução

## 13.1 Obter o projeto

Clone o repositório:

```bash
git clone https://github.com/isasantos19/Isabela_4bim_MercadoTangerinasFelizes3.0.git
```

Entre na pasta do projeto:

```bash
cd Isabela_4bim_MercadoTangerinasFelizes3.0
```

## 13.2 Instalar as dependências

No diretório que contém o `package.json`, execute:

```bash
npm install
```

Esse comando instala as dependências necessárias para o funcionamento da aplicação.

## 13.3 Configurar o banco de dados

1. Inicie o PostgreSQL.
2. Crie o banco de dados que será utilizado.
3. Configure as variáveis de ambiente no arquivo `.env`.
4. Execute o script SQL de criação das tabelas.
5. Realize a carga inicial dos dados, caso esteja disponibilizada no script do projeto.

## 13.4 Iniciar o servidor

Abra o terminal na pasta `backend` e execute:

```bash
node server.js
```

O servidor utiliza a porta `3001` como padrão, quando nenhuma outra porta é definida pela configuração da aplicação.

## 13.5 Acessar o sistema

Com o servidor iniciado, abra o arquivo `index.html` na estrutura do projeto por meio de um servidor local compatível com a aplicação.

---

# 14. Segurança e versionamento

Durante o desenvolvimento, foram consideradas práticas para proteger informações privadas e organizar o código-fonte.

Entre elas estão:

- Utilização de variáveis de ambiente para armazenar informações de conexão.
- Exclusão de arquivos `.env` do repositório.
- Exclusão das pastas `node_modules` do versionamento.
- Organização do código em arquivos e diretórios específicos.
- Utilização do Git para acompanhar alterações.
- Utilização do GitHub para armazenar e compartilhar o projeto.

O arquivo `.gitignore` define os arquivos e diretórios que não devem ser enviados ao repositório.

---

# 15. Considerações finais

O desenvolvimento do Mercado Tangerinas Felizes possibilitou aplicar, de maneira integrada, os conhecimentos relacionados à criação de aplicações web e ao gerenciamento de dados.

A construção das áreas administrativa e do cliente permitiu trabalhar com diferentes funcionalidades, como autenticação, controle de permissões, operações CRUD, gerenciamento de produtos, carrinho de compras e registro de pedidos.

A utilização da arquitetura Cliente/Servidor e do padrão MVC contribuiu para organizar o desenvolvimento e separar as responsabilidades de cada parte da aplicação.

Além disso, a integração com o PostgreSQL permitiu trabalhar com modelagem relacional, chaves primárias, chaves estrangeiras, restrições e relacionamentos entre entidades.

Dessa forma, o projeto representa a aplicação prática dos conteúdos estudados na disciplina de Desenvolvimento Web 1 durante o 4º bimestre de 2026.

---

# 16. Autoria

**Isabela Maria Ferreira dos Santos**

Curso Técnico Integrado em Informática para Internet  
Turma M32  
Ano: 2026

**Disciplina:** Desenvolvimento Web 1 (DW1)

**Projeto:** Mercado Tangerinas Felizes

**Repositório:** [GitHub - Mercado Tangerinas Felizes](https://github.com/isasantos19/Isabela_4bim_MercadoTangerinasFelizes3.0)
