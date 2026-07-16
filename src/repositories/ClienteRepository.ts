import { executeQuery } from '../database/connection';
import { ICliente } from '../models/Cliente';

export class ClienteRepository {
  async criar(cliente: ICliente): Promise<ICliente> {
    const query = `
      INSERT INTO clientes (nome, email, cpf, telefone)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const rows = await executeQuery<ICliente>(query, [
      cliente.nome,
      cliente.email,
      cliente.cpf ?? null,
      cliente.telefone ?? null,
    ]);
    return rows[0];
  }

  async listarTodos(): Promise<ICliente[]> {
    const query = `SELECT * FROM clientes ORDER BY nome ASC`;
    return executeQuery<ICliente>(query);
  }

  async buscarPorId(id: number): Promise<ICliente | null> {
    const query = `SELECT * FROM clientes WHERE id = $1`;
    const rows = await executeQuery<ICliente>(query, [id]);
    return rows[0] ?? null;
  }

  async buscarPorEmail(email: string): Promise<ICliente | null> {
    const query = `SELECT * FROM clientes WHERE email = $1`;
    const rows = await executeQuery<ICliente>(query, [email]);
    return rows[0] ?? null;
  }

  async buscarPorNome(nome: string): Promise<ICliente[]> {
    const query = `SELECT * FROM clientes WHERE nome ILIKE $1 ORDER BY nome ASC`;
    return executeQuery<ICliente>(query, [`%${nome}%`]);
  }

  async atualizar(id: number, dados: Partial<ICliente>): Promise<ICliente | null> {
    const query = `
      UPDATE clientes
      SET nome     = COALESCE($1, nome),
          email    = COALESCE($2, email),
          cpf      = COALESCE($3, cpf),
          telefone = COALESCE($4, telefone)
      WHERE id = $5
      RETURNING *
    `;
    const rows = await executeQuery<ICliente>(query, [
      dados.nome ?? null,
      dados.email ?? null,
      dados.cpf ?? null,
      dados.telefone ?? null,
      id,
    ]);
    return rows[0] ?? null;
  }

  async remover(id: number): Promise<boolean> {
    const query = `DELETE FROM clientes WHERE id = $1 RETURNING id`;
    const rows = await executeQuery<{ id: number }>(query, [id]);
    return rows.length > 0;
  }

  async possuiEmprestimosAtivos(id: number): Promise<boolean> {
    const query = `
      SELECT COUNT(*) AS total FROM emprestimos
      WHERE id_cliente = $1 AND status = 'ATIVO'
    `;
    const rows = await executeQuery<{ total: string }>(query, [id]);
    return parseInt(rows[0].total) > 0;
  }
}
