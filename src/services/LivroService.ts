import { LivroRepository } from '../repositories/LivroRepository';
import { AutorRepository } from '../repositories/AutorRepository';
import { ILivro } from '../models/Livro';

export class LivroService {
  private readonly livroRepository: LivroRepository;
  private readonly autorRepository: AutorRepository;

  constructor() {
    this.livroRepository = new LivroRepository();
    this.autorRepository = new AutorRepository();
  }

  async cadastrar(dados: ILivro): Promise<ILivro> {
    if (!dados.titulo || dados.titulo.trim().length < 2) {
      throw new Error('O título do livro deve ter pelo menos 2 caracteres.');
    }
    if (dados.preco < 0) {
      throw new Error('O preço não pode ser negativo.');
    }
    if (dados.quantidade_estoque < 0) {
      throw new Error('A quantidade em estoque não pode ser negativa.');
    }
    const autorExiste = await this.autorRepository.buscarPorId(dados.id_autor);
    if (!autorExiste) {
      throw new Error(`Autor com ID ${dados.id_autor} não encontrado.`);
    }
    dados.titulo = dados.titulo.trim();
    return this.livroRepository.criar(dados);
  }

  async listar(): Promise<ILivro[]> {
    return this.livroRepository.listarTodos();
  }

  async buscarPorId(id: number): Promise<ILivro> {
    const livro = await this.livroRepository.buscarPorId(id);
    if (!livro) throw new Error(`Livro com ID ${id} não encontrado.`);
    return livro;
  }

  async buscarPorTitulo(titulo: string): Promise<ILivro[]> {
    return this.livroRepository.buscarPorTitulo(titulo);
  }

  async atualizar(id: number, dados: Partial<ILivro>): Promise<ILivro> {
    await this.buscarPorId(id); // valida existência
    if (dados.id_autor !== undefined) {
      const autorExiste = await this.autorRepository.buscarPorId(dados.id_autor);
      if (!autorExiste) {
        throw new Error(`Autor com ID ${dados.id_autor} não encontrado.`);
      }
    }
    if (dados.preco !== undefined && dados.preco < 0) {
      throw new Error('O preço não pode ser negativo.');
    }
    if (dados.quantidade_estoque !== undefined && dados.quantidade_estoque < 0) {
      throw new Error('A quantidade em estoque não pode ser negativa.');
    }
    const atualizado = await this.livroRepository.atualizar(id, dados);
    if (!atualizado) throw new Error('Falha ao atualizar o livro.');
    return atualizado;
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id); // valida existência
    const temEmprestimoAtivo = await this.livroRepository.possuiEmprestimosAtivos(id);
    if (temEmprestimoAtivo) {
      throw new Error(
        'Não é possível remover o livro pois há empréstimos ativos vinculados a ele.'
      );
    }
    await this.livroRepository.remover(id);
  }
}
