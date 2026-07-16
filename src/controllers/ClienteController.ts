import { ClienteService } from '../services/ClienteService';
import { pergunta, perguntaObrigatoria } from '../utils/input';
import { separador, titulo } from '../utils/formatters';
import { validarId } from '../utils/validators';
import { ICliente } from '../models/Cliente';

export class ClienteController {
  private readonly service: ClienteService;

  constructor() {
    this.service = new ClienteService();
  }

  async cadastrar(): Promise<void> {
    titulo('CADASTRAR CLIENTE');
    try {
      const nome = await perguntaObrigatoria('Nome: ');
      const email = await perguntaObrigatoria('E-mail: ');
      const cpf = await pergunta('CPF (somente números, Enter para pular): ');
      const telefone = await pergunta('Telefone (Enter para pular): ');

      const cliente: ICliente = {
        nome,
        email,
        cpf: cpf || undefined,
        telefone: telefone || undefined,
      };

      const criado = await this.service.cadastrar(cliente);
      console.log(`\n✅ Cliente cadastrado com sucesso! ID: ${criado.id}`);
    } catch (error) {
      console.error(`\n❌ Erro: ${(error as Error).message}`);
    }
  }

  async listar(): Promise<void> {
    titulo('LISTA DE CLIENTES');
    try {
      const clientes = await this.service.listar();
      if (clientes.length === 0) {
        console.log('Nenhum cliente cadastrado.');
        return;
      }
      console.log(separador(60));
      clientes.forEach((c) => {
        console.log(`ID: ${c.id} | ${c.nome}`);
        console.log(`    E-mail: ${c.email} | Telefone: ${c.telefone ?? 'N/A'}`);
        console.log(separador(60));
      });
      console.log(`Total: ${clientes.length} cliente(s)`);
    } catch (error) {
      console.error(`\n❌ Erro: ${(error as Error).message}`);
    }
  }

  async buscarPorId(): Promise<void> {
    titulo('CONSULTAR CLIENTE');
    try {
      const entrada = await perguntaObrigatoria('ID do cliente: ');
      const id = validarId(entrada);
      if (!id) { console.log('❌ ID inválido.'); return; }

      const cliente = await this.service.buscarPorId(id);
      console.log(separador(60));
      console.log(`ID:       ${cliente.id}`);
      console.log(`Nome:     ${cliente.nome}`);
      console.log(`E-mail:   ${cliente.email}`);
      console.log(`CPF:      ${cliente.cpf ?? 'N/A'}`);
      console.log(`Telefone: ${cliente.telefone ?? 'N/A'}`);
      console.log(separador(60));
    } catch (error) {
      console.error(`\n❌ Erro: ${(error as Error).message}`);
    }
  }

  async atualizar(): Promise<void> {
    titulo('ATUALIZAR CLIENTE');
    try {
      const entrada = await perguntaObrigatoria('ID do cliente: ');
      const id = validarId(entrada);
      if (!id) { console.log('❌ ID inválido.'); return; }

      const cliente = await this.service.buscarPorId(id);
      console.log(`Editando: ${cliente.nome} (Enter para manter o valor atual)`);

      const nome = await pergunta(`Nome [${cliente.nome}]: `);
      const email = await pergunta(`E-mail [${cliente.email}]: `);
      const cpf = await pergunta(`CPF [${cliente.cpf ?? ''}]: `);
      const telefone = await pergunta(`Telefone [${cliente.telefone ?? ''}]: `);

      const dados: Partial<ICliente> = {};
      if (nome) dados.nome = nome;
      if (email) dados.email = email;
      if (cpf) dados.cpf = cpf;
      if (telefone) dados.telefone = telefone;

      if (Object.keys(dados).length === 0) {
        console.log('ℹ️  Nenhuma alteração realizada.');
        return;
      }

      const atualizado = await this.service.atualizar(id, dados);
      console.log(`\n✅ Cliente atualizado: ${atualizado.nome}`);
    } catch (error) {
      console.error(`\n❌ Erro: ${(error as Error).message}`);
    }
  }

  async remover(): Promise<void> {
    titulo('REMOVER CLIENTE');
    try {
      const entrada = await perguntaObrigatoria('ID do cliente: ');
      const id = validarId(entrada);
      if (!id) { console.log('❌ ID inválido.'); return; }

      const cliente = await this.service.buscarPorId(id);
      const confirmacao = await pergunta(`Confirma remoção de "${cliente.nome}"? (s/N): `);
      if (confirmacao.toLowerCase() !== 's') {
        console.log('Operação cancelada.');
        return;
      }

      await this.service.remover(id);
      console.log('\n✅ Cliente removido com sucesso!');
    } catch (error) {
      console.error(`\n❌ Erro: ${(error as Error).message}`);
    }
  }
}
