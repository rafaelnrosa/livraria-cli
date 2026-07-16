# 📚 BookStore Manager CLI - Rafael Novo da Rosa

Sistema de gerenciamento de livraria via terminal (CLI) desenvolvido com Node.js, TypeScript e PostgreSQL.

---

## 🎯 Objetivo

Permitir o gerenciamento completo de uma livraria pelo terminal, controlando autores, livros, clientes e empréstimos com persistência em banco de dados PostgreSQL.

---

## 🛠️ Tecnologias Utilizadas

- **Node.js** v18+
- **TypeScript** v5
- **PostgreSQL** v14+
- **pg** — driver PostgreSQL para Node.js
- **dotenv** — gerenciamento de variáveis de ambiente
- **tsx** — execução TypeScript em desenvolvimento

---

## ✅ Pré-requisitos

- Node.js v18 ou superior instalado
- PostgreSQL instalado e em execução
- npm instalado

---

## ⚙️ Configuração do Ambiente

### 1. Clonar o repositório

```bash
git clone https://github.com/rafaelnrosa/livraria-cli.git
cd livraria-cli
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie (ou edite) o arquivo `.env` na raiz do projeto:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
DB_NAME=livraria_db
```

> ⚠️ Substitua `sua_senha_aqui` pela senha do seu PostgreSQL.

### 4. Criar o banco de dados

Conecte-se ao PostgreSQL e execute:

```sql
CREATE DATABASE livraria_db;
```

Em seguida, aplique o schema:

```bash
psql -U postgres -d livraria_db -f src/database/schema.sql
```

Ou cole o conteúdo de `src/database/schema.sql` diretamente no seu cliente PostgreSQL (pgAdmin, DBeaver, etc.).

---

## ▶️ Execução

### Modo desenvolvimento (com hot-reload)

```bash
npm run dev
```

### Build de produção

```bash
npm run build
npm start
```

---

## 🏗️ Arquitetura do Projeto

```
livraria-cli/
├── src/
│   ├── main.ts                    # Entrada da aplicação
│   ├── controllers/               # Interação com o usuário (inputs/outputs)
│   │   ├── AutorController.ts
│   │   ├── LivroController.ts
│   │   ├── ClienteController.ts
│   │   ├── EmprestimoController.ts
│   │   └── RelatorioController.ts
│   ├── services/                  # Regras de negócio e validações
│   │   ├── AutorService.ts
│   │   ├── LivroService.ts
│   │   ├── ClienteService.ts
│   │   ├── EmprestimoService.ts
│   │   └── RelatorioService.ts
│   ├── repositories/              # Comunicação com o banco de dados (SQL)
│   │   ├── AutorRepository.ts
│   │   ├── LivroRepository.ts
│   │   ├── ClienteRepository.ts
│   │   ├── EmprestimoRepository.ts
│   │   └── RelatorioRepository.ts
│   ├── models/                    # Interfaces e classes das entidades
│   │   ├── Autor.ts
│   │   ├── Livro.ts
│   │   ├── Cliente.ts
│   │   └── Emprestimo.ts
│   ├── database/
│   │   ├── connection.ts          # Configuração do Pool PostgreSQL
│   │   └── schema.sql             # Script de criação das tabelas
│   ├── menus/                     # Menus do terminal
│   │   ├── menuAutores.ts
│   │   ├── menuLivros.ts
│   │   ├── menuClientes.ts
│   │   ├── menuEmprestimos.ts
│   │   └── menuRelatorios.ts
│   └── utils/                     # Funções auxiliares reutilizáveis
│       ├── input.ts               # Leitura de input do terminal
│       ├── formatters.ts          # Formatação de datas, moeda, etc.
│       └── validators.ts          # Validações de dados
├── .env                           # Variáveis de ambiente (não versionado)
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

### Fluxo de execução

```
Usuário → Menu → Controller → Service → Repository → PostgreSQL
```

| Camada | Responsabilidade |
|---|---|
| **Main** | Inicializa a aplicação, conecta ao banco e abre o menu principal |
| **Menus** | Exibem opções e delegam para os controllers |
| **Controllers** | Recebem input do usuário e acionam os services |
| **Services** | Aplicam regras de negócio e validações |
| **Repositories** | Executam comandos SQL no PostgreSQL |
| **Models** | Definem interfaces e classes das entidades |
| **Utils** | Funções auxiliares (input, formatação, validação) |

---

## 📋 Funcionalidades

### Autores
- Cadastrar, listar, consultar por ID, atualizar e remover autores
- Validação: não permite remover autor com livros vinculados

### Livros
- Cadastrar, listar, consultar por ID, atualizar e remover livros
- Cada livro é obrigatoriamente vinculado a um autor
- Validação: não permite remover livro com empréstimos ativos

### Clientes
- Cadastrar, listar, consultar por ID, atualizar e remover clientes
- Validação de e-mail único e formato
- Validação: não permite remover cliente com empréstimos ativos

### Empréstimos
- Registrar empréstimo com validação de disponibilidade do livro
- Registrar devolução com atualização automática do estoque
- Listar todos ou apenas os ativos
- Consultar empréstimo por ID

### Relatórios
- Livros disponíveis em estoque
- Livros emprestados com dados do cliente
- Quantidade de livros cadastrados por autor
- Ranking de empréstimos por livro (Top 20)
- Clientes com empréstimos ativos

---

## 🗃️ Modelagem do Banco de Dados

```
autores (id, nome, nacionalidade, data_nascimento, criado_em)
   │
   └── livros (id, titulo, isbn, ano_publicacao, preco, quantidade_estoque, id_autor, criado_em)
                 │
                 └── emprestimos (id, id_livro, id_cliente, data_emprestimo,
                                  data_prevista_devolucao, data_devolucao, status)
clientes (id, nome, email, cpf, telefone, criado_em)
   │
   └── emprestimos (via id_cliente)
```

---

## 👤 Integrante

- **Rafael** — Desenvolvedor Back-End

---

## 🔗 Links

- Repositório: https://github.com/rafaelnrosa/livraria-cli
