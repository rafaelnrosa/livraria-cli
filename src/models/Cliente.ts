export interface ICliente {
  id?: number;
  nome: string;
  email: string;
  cpf?: string;
  telefone?: string;
  criado_em?: Date;
}

export class Cliente implements ICliente {
  public id?: number;
  public nome: string;
  public email: string;
  public cpf?: string;
  public telefone?: string;
  public criado_em?: Date;

  constructor(data: ICliente) {
    this.id = data.id;
    this.nome = data.nome;
    this.email = data.email;
    this.cpf = data.cpf;
    this.telefone = data.telefone;
    this.criado_em = data.criado_em;
  }

  public toString(): string {
    return `[${this.id}] ${this.nome} - ${this.email}`;
  }
}
