import { executeQuery } from '../database/connection';
import { ILivro } from '../models/Livro';

export class LivroRepository {
  async criar(livro: ILivro): Promise<ILivro> {
    const query = `
      INSERT INTO livros (titulo, isbn, ano_publicacao, preco, quantidade_estoque, id_autor)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const rows = await executeQuery<ILivro>(query, [
      livro.titulo,
      livro.isbn ?? null,
      livro.ano_publicacao ?? null,
      livro.preco,
      livro.quantidade_estoque,
      livro.id_autor,
    ]);
    return rows[0];
  }

  async listarTodos(): Promise<ILivro[]> {
    const query = `
      SELECT l.*, a.nome AS nome_autor
      FROM livros l
      INNER JOIN autores a ON a.id = l.id_autor
      ORDER BY l.titulo ASC
    `;
    return executeQuery<ILivro>(query);
  }

  async buscarPorId(id: number): Promise<ILivro | null> {
    const query = `
      SELECT l.*, a.nome AS nome_autor
      FROM livros l
      INNER JOIN autores a ON a.id = l.id_autor
      WHERE l.id = $1
    `;
    const rows = await executeQuery<ILivro>(query, [id]);
    return rows[0] ?? null;
  }

  async buscarPorTitulo(titulo: string): Promise<ILivro[]> {
    const query = `
      SELECT l.*, a.nome AS nome_autor
      FROM livros l
      INNER JOIN autores a ON a.id = l.id_autor
      WHERE l.titulo ILIKE $1
      ORDER BY l.titulo ASC
    `;
    return executeQuery<ILivro>(query, [`%${titulo}%`]);
  }

  async atualizar(id: number, dados: Partial<ILivro>): Promise<ILivro | null> {
    const query = `
      UPDATE livros
      SET titulo             = COALESCE($1, titulo),
          isbn               = COALESCE($2, isbn),
          ano_publicacao     = COALESCE($3, ano_publicacao),
          preco              = COALESCE($4, preco),
          quantidade_estoque = COALESCE($5, quantidade_estoque),
          id_autor           = COALESCE($6, id_autor)
      WHERE id = $7
      RETURNING *
    `;
    const rows = await executeQuery<ILivro>(query, [
      dados.titulo ?? null,
      dados.isbn ?? null,
      dados.ano_publicacao ?? null,
      dados.preco ?? null,
      dados.quantidade_estoque ?? null,
      dados.id_autor ?? null,
      id,
    ]);
    return rows[0] ?? null;
  }

  async atualizarEstoque(id: number, novaQuantidade: number): Promise<void> {
    const query = `UPDATE livros SET quantidade_estoque = $1 WHERE id = $2`;
    await executeQuery(query, [novaQuantidade, id]);
  }

  async remover(id: number): Promise<boolean> {
    const query = `DELETE FROM livros WHERE id = $1 RETURNING id`;
    const rows = await executeQuery<{ id: number }>(query, [id]);
    return rows.length > 0;
  }

  async possuiEmprestimosAtivos(id: number): Promise<boolean> {
    const query = `
      SELECT COUNT(*) AS total FROM emprestimos
      WHERE id_livro = $1 AND status = 'ATIVO'
    `;
    const rows = await executeQuery<{ total: string }>(query, [id]);
    return parseInt(rows[0].total) > 0;
  }
}
