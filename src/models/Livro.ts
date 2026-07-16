export interface ILivro {
  id?: number;
  titulo: string;
  isbn?: string;
  ano_publicacao?: number;
  preco: number;
  quantidade_estoque: number;
  id_autor: number;
  nome_autor?: string; // campo auxiliar dos JOINs
  criado_em?: Date;
}

export class Livro implements ILivro {
  public id?: number;
  public titulo: string;
  public isbn?: string;
  public ano_publicacao?: number;
  public preco: number;
  public quantidade_estoque: number;
  public id_autor: number;
  public nome_autor?: string;
  public criado_em?: Date;

  constructor(data: ILivro) {
    this.id = data.id;
    this.titulo = data.titulo;
    this.isbn = data.isbn;
    this.ano_publicacao = data.ano_publicacao;
    this.preco = data.preco;
    this.quantidade_estoque = data.quantidade_estoque;
    this.id_autor = data.id_autor;
    this.nome_autor = data.nome_autor;
    this.criado_em = data.criado_em;
  }

  public get disponivel(): boolean {
    return this.quantidade_estoque > 0;
  }

  public toString(): string {
    return `[${this.id}] ${this.titulo} - Autor: ${this.nome_autor ?? this.id_autor} | Estoque: ${this.quantidade_estoque}`;
  }
}
