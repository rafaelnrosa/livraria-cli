import { EmprestimoService } from '../services/EmprestimoService';
import { IEmprestimo } from '../models/Emprestimo';
import { pergunta, perguntaObrigatoria } from '../utils/input';
import { formatarDataHora, separador, titulo } from '../utils/formatters';
import { validarId } from '../utils/validators';

export class EmprestimoController {
  private readonly service: EmprestimoService;

  constructor() {
    this.service = new EmprestimoService();
  }

  async realizar(): Promise<void> {
    titulo('REALIZAR EMPRÉSTIMO');
    try {
      const livroIdStr = await perguntaObrigatoria('ID do livro: ');
      const idLivro = validarId(livroIdStr);
      if (!idLivro) { console.log('❌ ID do livro inválido.'); return; }

      const clienteIdStr = await perguntaObrigatoria('ID do cliente: ');
      const idCliente = validarId(clienteIdStr);
      if (!idCliente) { console.log('❌ ID do cliente inválido.'); return; }

      const dataPrevista = await pergunta('Data prevista de devolução (AAAA-MM-DD, Enter para pular): ');

      const emprestimo = await this.service.realizar(
        idLivro,
        idCliente,
        dataPrevista || undefined
      );

      console.log(`\n✅ Empréstimo registrado! ID: ${emprestimo.id}`);
      console.log(`   Data: ${formatarDataHora(emprestimo.data_emprestimo)}`);
    } catch (error) {
      console.error(`\n❌ Erro: ${(error as Error).message}`);
    }
  }

  async registrarDevolucao(): Promise<void> {
    titulo('REGISTRAR DEVOLUÇÃO');
    try {
      const entrada = await perguntaObrigatoria('ID do empréstimo: ');
      const id = validarId(entrada);
      if (!id) { console.log('❌ ID inválido.'); return; }

      const devolvido = await this.service.registrarDevolucao(id);
      console.log(`\n✅ Devolução registrada! Empréstimo #${devolvido.id}`);
      console.log(`   Data devolução: ${formatarDataHora(devolvido.data_devolucao)}`);
    } catch (error) {
      console.error(`\n❌ Erro: ${(error as Error).message}`);
    }
  }

  async listar(): Promise<void> {
    titulo('TODOS OS EMPRÉSTIMOS');
    try {
      const emprestimos = await this.service.listar();
      if (emprestimos.length === 0) {
        console.log('Nenhum empréstimo cadastrado.');
        return;
      }
      this.exibirEmprestimos(emprestimos);
      console.log(`Total: ${emprestimos.length} empréstimo(s)`);
    } catch (error) {
      console.error(`\n❌ Erro: ${(error as Error).message}`);
    }
  }

  async listarAtivos(): Promise<void> {
    titulo('EMPRÉSTIMOS ATIVOS');
    try {
      const emprestimos = await this.service.listarAtivos();
      if (emprestimos.length === 0) {
        console.log('Nenhum empréstimo ativo no momento.');
        return;
      }
      this.exibirEmprestimos(emprestimos);
      console.log(`Total: ${emprestimos.length} empréstimo(s) ativo(s)`);
    } catch (error) {
      console.error(`\n❌ Erro: ${(error as Error).message}`);
    }
  }

  async buscarPorId(): Promise<void> {
    titulo('CONSULTAR EMPRÉSTIMO');
    try {
      const entrada = await perguntaObrigatoria('ID do empréstimo: ');
      const id = validarId(entrada);
      if (!id) { console.log('❌ ID inválido.'); return; }

      const e = await this.service.buscarPorId(id);
      console.log(separador(65));
      console.log(`ID:           ${e.id}`);
      console.log(`Livro:        ${e.titulo_livro}`);
      console.log(`Cliente:      ${e.nome_cliente}`);
      console.log(`Emprestado em: ${formatarDataHora(e.data_emprestimo)}`);
      console.log(`Devolução prev: ${e.data_prevista_devolucao ?? 'N/A'}`);
      console.log(`Devolvido em: ${e.data_devolucao ? formatarDataHora(e.data_devolucao) : 'Não devolvido'}`);
      console.log(`Status:       ${e.status}`);
      console.log(separador(65));
    } catch (error) {
      console.error(`\n❌ Erro: ${(error as Error).message}`);
    }
  }

  private exibirEmprestimos(emprestimos: IEmprestimo[]): void {
    console.log(separador(65));
    emprestimos.forEach((e) => {
      const status = e.status === 'ATIVO' ? '🟢 ATIVO' : '🔴 DEVOLVIDO';
      console.log(`#${e.id} | ${status}`);
      console.log(`   Livro:   ${e.titulo_livro}`);
      console.log(`   Cliente: ${e.nome_cliente}`);
      console.log(`   Data:    ${formatarDataHora(e.data_emprestimo)}`);
      console.log(separador(65));
    });
  }
}
