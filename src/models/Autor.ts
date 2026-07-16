export interface IAutor {
  id?: number;
  nome: string;
  nacionalidade?: string;
  data_nascimento?: string;
  criado_em?: Date;
}

export class Autor implements IAutor {
  public id?: number;
  public nome: string;
  public nacionalidade?: string;
  public data_nascimento?: string;
  public criado_em?: Date;

  constructor(data: IAutor) {
    this.id = data.id;
    this.nome = data.nome;
    this.nacionalidade = data.nacionalidade;
    this.data_nascimento = data.data_nascimento;
    this.criado_em = data.criado_em;
  }

  public toString(): string {
    return `[${this.id}] ${this.nome} - ${this.nacionalidade ?? 'Nacionalidade não informada'}`;
  }
}
