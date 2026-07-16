import { AutorRepository } from '../repositories/AutorRepository';
import { IAutor } from '../models/Autor';

export class AutorService {
  private readonly repository: AutorRepository;

  constructor() {
    this.repository = new AutorRepository();
  }

  async cadastrar(dados: IAutor): Promise<IAutor> {
    if (!dados.nome || dados.nome.trim().length < 2) {
      throw new Error('O nome do autor deve ter pelo menos 2 caracteres.');
    }
    dados.nome = dados.nome.trim();
    return this.repository.criar(dados);
  }

  async listar(): Promise<IAutor[]> {
    return this.repository.listarTodos();
  }

  async buscarPorId(id: number): Promise<IAutor> {
    const autor = await this.repository.buscarPorId(id);
    if (!autor) throw new Error(`Autor com ID ${id} não encontrado.`);
    return autor;
  }

  async buscarPorNome(nome: string): Promise<IAutor[]> {
    return this.repository.buscarPorNome(nome);
  }

  async atualizar(id: number, dados: Partial<IAutor>): Promise<IAutor> {
    await this.buscarPorId(id); // valida existência
    if (dados.nome !== undefined && dados.nome.trim().length < 2) {
      throw new Error('O nome do autor deve ter pelo menos 2 caracteres.');
    }
    const atualizado = await this.repository.atualizar(id, dados);
    if (!atualizado) throw new Error('Falha ao atualizar o autor.');
    return atualizado;
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id); // valida existência
    const temLivros = await this.repository.possuiLivros(id);
    if (temLivros) {
      throw new Error(
        'Não é possível remover o autor pois existem livros vinculados a ele.'
      );
    }
    await this.repository.remover(id);
  }
}
