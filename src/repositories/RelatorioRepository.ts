import { executeQuery } from '../database/connection';

export interface ILivroDisponivel {
  id: number;
  titulo: string;
  nome_autor: string;
  quantidade_estoque: number;
}

export interface ILivroEmprestado {
  id: number;
  titulo: string;
  nome_cliente: string;
  data_emprestimo: Date;
  data_prevista_devolucao: Date | null;
}

export interface ILivrosPorAutor {
  nome_autor: string;
  total_livros: string;
}

export interface IEmprestimosPorLivro {
  titulo: string;
  total_emprestimos: string;
}

export interface IClienteComEmprestimoAtivo {
  id: number;
  nome: string;
  email: string;
  total_emprestimos_ativos: string;
}

export class RelatorioRepository {
  async livrosDisponiveis(): Promise<ILivroDisponivel[]> {
    const query = `
      SELECT l.id, l.titulo, a.nome AS nome_autor, l.quantidade_estoque
      FROM livros l
      INNER JOIN autores a ON a.id = l.id_autor
      WHERE l.quantidade_estoque > 0
      ORDER BY l.titulo ASC
    `;
    return executeQuery<ILivroDisponivel>(query);
  }

  async livrosEmprestados(): Promise<ILivroEmprestado[]> {
    const query = `
      SELECT l.id, l.titulo, c.nome AS nome_cliente,
             e.data_emprestimo, e.data_prevista_devolucao
      FROM emprestimos e
      INNER JOIN livros   l ON l.id = e.id_livro
      INNER JOIN clientes c ON c.id = e.id_cliente
      WHERE e.status = 'ATIVO'
      ORDER BY e.data_emprestimo DESC
    `;
    return executeQuery<ILivroEmprestado>(query);
  }

  async livrosPorAutor(): Promise<ILivrosPorAutor[]> {
    const query = `
      SELECT a.nome AS nome_autor, COUNT(l.id) AS total_livros
      FROM autores a
      LEFT JOIN livros l ON l.id_autor = a.id
      GROUP BY a.id, a.nome
      ORDER BY total_livros DESC, a.nome ASC
    `;
    return executeQuery<ILivrosPorAutor>(query);
  }

  async emprestimosPorLivro(): Promise<IEmprestimosPorLivro[]> {
    const query = `
      SELECT l.titulo, COUNT(e.id) AS total_emprestimos
      FROM livros l
      LEFT JOIN emprestimos e ON e.id_livro = l.id
      GROUP BY l.id, l.titulo
      ORDER BY total_emprestimos DESC
      LIMIT 20
    `;
    return executeQuery<IEmprestimosPorLivro>(query);
  }

  async clientesComEmprestimosAtivos(): Promise<IClienteComEmprestimoAtivo[]> {
    const query = `
      SELECT c.id, c.nome, c.email, COUNT(e.id) AS total_emprestimos_ativos
      FROM clientes c
      INNER JOIN emprestimos e ON e.id_cliente = c.id
      WHERE e.status = 'ATIVO'
      GROUP BY c.id, c.nome, c.email
      ORDER BY total_emprestimos_ativos DESC
    `;
    return executeQuery<IClienteComEmprestimoAtivo>(query);
  }
}
