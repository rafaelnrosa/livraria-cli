-- ============================================================
-- BookStore Manager CLI - Script de criação do banco de dados
-- PostgreSQL
-- ============================================================

-- Criação do banco (executar manualmente se necessário):
-- CREATE DATABASE livraria_db;

-- Extensão para UUID (opcional)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Tabela de Autores
-- ============================================================
CREATE TABLE IF NOT EXISTS autores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    nacionalidade VARCHAR(50),
    data_nascimento DATE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Tabela de Clientes
-- ============================================================
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    telefone VARCHAR(20),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Tabela de Livros
-- ============================================================
CREATE TABLE IF NOT EXISTS livros (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    isbn VARCHAR(13) UNIQUE,
    ano_publicacao INTEGER,
    preco NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    quantidade_estoque INTEGER NOT NULL DEFAULT 0,
    id_autor INTEGER NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_livros_autor FOREIGN KEY (id_autor)
        REFERENCES autores(id) ON DELETE RESTRICT
);

-- ============================================================
-- Tabela de Empréstimos
-- ============================================================
CREATE TABLE IF NOT EXISTS emprestimos (
    id SERIAL PRIMARY KEY,
    id_livro INTEGER NOT NULL,
    id_cliente INTEGER NOT NULL,
    data_emprestimo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_prevista_devolucao DATE,
    data_devolucao TIMESTAMP NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ATIVO'
        CHECK (status IN ('ATIVO', 'DEVOLVIDO')),
    CONSTRAINT fk_emprestimos_livro FOREIGN KEY (id_livro)
        REFERENCES livros(id) ON DELETE RESTRICT,
    CONSTRAINT fk_emprestimos_cliente FOREIGN KEY (id_cliente)
        REFERENCES clientes(id) ON DELETE RESTRICT
);

-- ============================================================
-- Índices para performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_livros_autor       ON livros(id_autor);
CREATE INDEX IF NOT EXISTS idx_emprestimos_livro   ON emprestimos(id_livro);
CREATE INDEX IF NOT EXISTS idx_emprestimos_cliente ON emprestimos(id_cliente);
CREATE INDEX IF NOT EXISTS idx_emprestimos_status  ON emprestimos(status);
