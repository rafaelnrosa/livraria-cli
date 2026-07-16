import { RelatorioRepository } from '../repositories/RelatorioRepository';

export class RelatorioService {
  private readonly repository: RelatorioRepository;

  constructor() {
    this.repository = new RelatorioRepository();
  }

  async livrosDisponiveis() {
    return this.repository.livrosDisponiveis();
  }

  async livrosEmprestados() {
    return this.repository.livrosEmprestados();
  }

  async livrosPorAutor() {
    return this.repository.livrosPorAutor();
  }

  async emprestimosPorLivro() {
    return this.repository.emprestimosPorLivro();
  }

  async clientesComEmprestimosAtivos() {
    return this.repository.clientesComEmprestimosAtivos();
  }
}
