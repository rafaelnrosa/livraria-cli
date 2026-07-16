import { executeQuery } from '../database/connection';
import { IAutor } from '../models/Autor';

export class AutorRepository {
  async criar(autor: IAutor): Promise<IAutor> {
    const query = `
      INSERT INTO autores (nome, nacionalidade, data_nascimento)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const rows = await executeQuery<IAutor>(query, [
      autor.nome,
      autor.nacionalidade ?? null,
      autor.data_nascimento ?? null,
    ]);
    return rows[0];
  }

  async listarTodos(): Promise<IAutor[]> {
    const query = `SELECT * FROM autores ORDER BY nome ASC`;
    return executeQuery<IAutor>(query);
  }

  async buscarPorId(id: number): Promise<IAutor | null> {
    const query = `SELECT * FROM autores WHERE id = $1`;
    const rows = await executeQuery<IAutor>(query, [id]);
    return rows[0] ?? null;
  }

  async buscarPorNome(nome: string): Promise<IAutor[]> {
    const query = `SELECT * FROM autores WHERE nome ILIKE $1 ORDER BY nome ASC`;
    return executeQuery<IAutor>(query, [`%${nome}%`]);
  }

  async atualizar(id: number, dados: Partial<IAutor>): Promise<IAutor | null> {
    const query = `
      UPDATE autores
      SET nome = COALESCE($1, nome),
          nacionalidade = COALESCE($2, nacionalidade),
          data_nascimento = COALESCE($3, data_nascimento)
      WHERE id = $4
      RETURNING *
    `;
    const rows = await executeQuery<IAutor>(query, [
      dados.nome ?? null,
      dados.nacionalidade ?? null,
      dados.data_nascimento ?? null,
      id,
    ]);
    return rows[0] ?? null;
  }

  async remover(id: number): Promise<boolean> {
    const query = `DELETE FROM autores WHERE id = $1 RETURNING id`;
    const rows = await executeQuery<{ id: number }>(query, [id]);
    return rows.length > 0;
  }

  async possuiLivros(id: number): Promise<boolean> {
    const query = `SELECT COUNT(*) AS total FROM livros WHERE id_autor = $1`;
    const rows = await executeQuery<{ total: string }>(query, [id]);
    return parseInt(rows[0].total) > 0;
  }
}
