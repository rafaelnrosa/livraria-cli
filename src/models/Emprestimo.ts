export type StatusEmprestimo = 'ATIVO' | 'DEVOLVIDO';

export interface IEmprestimo {
  id?: number;
  id_livro: number;
  id_cliente: number;
  data_emprestimo?: Date;
  data_prevista_devolucao?: string;
  data_devolucao?: Date | null;
  status?: StatusEmprestimo;
  // campos auxiliares dos JOINs
  titulo_livro?: string;
  nome_cliente?: string;
}

export class Emprestimo implements IEmprestimo {
  public id?: number;
  public id_livro: number;
  public id_cliente: number;
  public data_emprestimo?: Date;
  public data_prevista_devolucao?: string;
  public data_devolucao?: Date | null;
  public status?: StatusEmprestimo;
  public titulo_livro?: string;
  public nome_cliente?: string;

  constructor(data: IEmprestimo) {
    this.id = data.id;
    this.id_livro = data.id_livro;
    this.id_cliente = data.id_cliente;
    this.data_emprestimo = data.data_emprestimo;
    this.data_prevista_devolucao = data.data_prevista_devolucao;
    this.data_devolucao = data.data_devolucao;
    this.status = data.status ?? 'ATIVO';
    this.titulo_livro = data.titulo_livro;
    this.nome_cliente = data.nome_cliente;
  }

  public get ativo(): boolean {
    return this.status === 'ATIVO';
  }

  public toString(): string {
    return `[${this.id}] Livro: ${this.titulo_livro ?? this.id_livro} | Cliente: ${this.nome_cliente ?? this.id_cliente} | Status: ${this.status}`;
  }
}
