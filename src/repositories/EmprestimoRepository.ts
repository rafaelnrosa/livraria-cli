import { executeQuery } from '../database/connection';
import { IEmprestimo } from '../models/Emprestimo';

export class EmprestimoRepository {
  async criar(emprestimo: IEmprestimo): Promise<IEmprestimo> {
    const query = `
      INSERT INTO emprestimos (id_livro, id_cliente, data_prevista_devolucao)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const rows = await executeQuery<IEmprestimo>(query, [
      emprestimo.id_livro,
      emprestimo.id_cliente,
      emprestimo.data_prevista_devolucao ?? null,
    ]);
    return rows[0];
  }

  async listarTodos(): Promise<IEmprestimo[]> {
    const query = `
      SELECT e.*,
             l.titulo AS titulo_livro,
             c.nome   AS nome_cliente
      FROM emprestimos e
      INNER JOIN livros   l ON l.id = e.id_livro
      INNER JOIN clientes c ON c.id = e.id_cliente
      ORDER BY e.data_emprestimo DESC
    `;
    return executeQuery<IEmprestimo>(query);
  }

  async listarAtivos(): Promise<IEmprestimo[]> {
    const query = `
      SELECT e.*,
             l.titulo AS titulo_livro,
             c.nome   AS nome_cliente
      FROM emprestimos e
      INNER JOIN livros   l ON l.id = e.id_livro
      INNER JOIN clientes c ON c.id = e.id_cliente
      WHERE e.status = 'ATIVO'
      ORDER BY e.data_emprestimo DESC
    `;
    return executeQuery<IEmprestimo>(query);
  }

  async buscarPorId(id: number): Promise<IEmprestimo | null> {
    const query = `
      SELECT e.*,
             l.titulo AS titulo_livro,
             c.nome   AS nome_cliente
      FROM emprestimos e
      INNER JOIN livros   l ON l.id = e.id_livro
      INNER JOIN clientes c ON c.id = e.id_cliente
      WHERE e.id = $1
    `;
    const rows = await executeQuery<IEmprestimo>(query, [id]);
    return rows[0] ?? null;
  }

  async buscarAtivosPorCliente(idCliente: number): Promise<IEmprestimo[]> {
    const query = `
      SELECT e.*,
             l.titulo AS titulo_livro,
             c.nome   AS nome_cliente
      FROM emprestimos e
      INNER JOIN livros   l ON l.id = e.id_livro
      INNER JOIN clientes c ON c.id = e.id_cliente
      WHERE e.id_cliente = $1 AND e.status = 'ATIVO'
    `;
    return executeQuery<IEmprestimo>(query, [idCliente]);
  }

  async registrarDevolucao(id: number): Promise<IEmprestimo | null> {
    const query = `
      UPDATE emprestimos
      SET status = 'DEVOLVIDO',
          data_devolucao = CURRENT_TIMESTAMP
      WHERE id = $1 AND status = 'ATIVO'
      RETURNING *
    `;
    const rows = await executeQuery<IEmprestimo>(query, [id]);
    return rows[0] ?? null;
  }
}
