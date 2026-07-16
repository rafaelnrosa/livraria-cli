import { EmprestimoRepository } from '../repositories/EmprestimoRepository';
import { LivroRepository } from '../repositories/LivroRepository';
import { ClienteRepository } from '../repositories/ClienteRepository';
import { IEmprestimo } from '../models/Emprestimo';

export class EmprestimoService {
  private readonly emprestimoRepository: EmprestimoRepository;
  private readonly livroRepository: LivroRepository;
  private readonly clienteRepository: ClienteRepository;

  constructor() {
    this.emprestimoRepository = new EmprestimoRepository();
    this.livroRepository = new LivroRepository();
    this.clienteRepository = new ClienteRepository();
  }

  async realizar(idLivro: number, idCliente: number, dataPrevistaDevolucao?: string): Promise<IEmprestimo> {
    // Valida livro
    const livro = await this.livroRepository.buscarPorId(idLivro);
    if (!livro) throw new Error(`Livro com ID ${idLivro} não encontrado.`);

    // Valida cliente
    const cliente = await this.clienteRepository.buscarPorId(idCliente);
    if (!cliente) throw new Error(`Cliente com ID ${idCliente} não encontrado.`);

    // Valida disponibilidade
    if (livro.quantidade_estoque <= 0) {
      throw new Error(`O livro "${livro.titulo}" não está disponível no estoque.`);
    }

    // Cria empréstimo
    const emprestimo = await this.emprestimoRepository.criar({
      id_livro: idLivro,
      id_cliente: idCliente,
      data_prevista_devolucao: dataPrevistaDevolucao,
    });

    // Decrementa estoque
    await this.livroRepository.atualizarEstoque(idLivro, livro.quantidade_estoque - 1);

    return emprestimo;
  }

  async registrarDevolucao(idEmprestimo: number): Promise<IEmprestimo> {
    const emprestimo = await this.emprestimoRepository.buscarPorId(idEmprestimo);
    if (!emprestimo) throw new Error(`Empréstimo com ID ${idEmprestimo} não encontrado.`);
    if (emprestimo.status === 'DEVOLVIDO') {
      throw new Error(`O empréstimo #${idEmprestimo} já foi devolvido.`);
    }

    const devolvido = await this.emprestimoRepository.registrarDevolucao(idEmprestimo);
    if (!devolvido) throw new Error('Falha ao registrar devolução.');

    // Incrementa estoque
    const livro = await this.livroRepository.buscarPorId(emprestimo.id_livro);
    if (livro) {
      await this.livroRepository.atualizarEstoque(emprestimo.id_livro, livro.quantidade_estoque + 1);
    }

    return devolvido;
  }

  async listar(): Promise<IEmprestimo[]> {
    return this.emprestimoRepository.listarTodos();
  }

  async listarAtivos(): Promise<IEmprestimo[]> {
    return this.emprestimoRepository.listarAtivos();
  }

  async buscarPorId(id: number): Promise<IEmprestimo> {
    const emprestimo = await this.emprestimoRepository.buscarPorId(id);
    if (!emprestimo) throw new Error(`Empréstimo com ID ${id} não encontrado.`);
    return emprestimo;
  }
}
