import { ClienteRepository } from '../repositories/ClienteRepository';
import { ICliente } from '../models/Cliente';
import { validarEmail } from '../utils/validators';

export class ClienteService {
  private readonly repository: ClienteRepository;

  constructor() {
    this.repository = new ClienteRepository();
  }

  async cadastrar(dados: ICliente): Promise<ICliente> {
    if (!dados.nome || dados.nome.trim().length < 2) {
      throw new Error('O nome do cliente deve ter pelo menos 2 caracteres.');
    }
    if (!validarEmail(dados.email)) {
      throw new Error('E-mail inválido.');
    }
    const existente = await this.repository.buscarPorEmail(dados.email);
    if (existente) {
      throw new Error(`Já existe um cliente cadastrado com o e-mail "${dados.email}".`);
    }
    dados.nome = dados.nome.trim();
    dados.email = dados.email.trim().toLowerCase();
    return this.repository.criar(dados);
  }

  async listar(): Promise<ICliente[]> {
    return this.repository.listarTodos();
  }

  async buscarPorId(id: number): Promise<ICliente> {
    const cliente = await this.repository.buscarPorId(id);
    if (!cliente) throw new Error(`Cliente com ID ${id} não encontrado.`);
    return cliente;
  }

  async buscarPorNome(nome: string): Promise<ICliente[]> {
    return this.repository.buscarPorNome(nome);
  }

  async atualizar(id: number, dados: Partial<ICliente>): Promise<ICliente> {
    await this.buscarPorId(id); // valida existência
    if (dados.email !== undefined) {
      if (!validarEmail(dados.email)) {
        throw new Error('E-mail inválido.');
      }
      const existente = await this.repository.buscarPorEmail(dados.email);
      if (existente && existente.id !== id) {
        throw new Error(`Já existe outro cliente com o e-mail "${dados.email}".`);
      }
    }
    const atualizado = await this.repository.atualizar(id, dados);
    if (!atualizado) throw new Error('Falha ao atualizar o cliente.');
    return atualizado;
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id); // valida existência
    const temEmprestimosAtivos = await this.repository.possuiEmprestimosAtivos(id);
    if (temEmprestimosAtivos) {
      throw new Error(
        'Não é possível remover o cliente pois há empréstimos ativos vinculados a ele.'
      );
    }
    await this.repository.remover(id);
  }
}
