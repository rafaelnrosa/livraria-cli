import { RelatorioService } from '../services/RelatorioService';
import { formatarDataHora, formatarMoeda, separador, titulo } from '../utils/formatters';

export class RelatorioController {
  private readonly service: RelatorioService;

  constructor() {
    this.service = new RelatorioService();
  }

  async livrosDisponiveis(): Promise<void> {
    titulo('RELATÓRIO: LIVROS DISPONÍVEIS');
    try {
      const livros = await this.service.livrosDisponiveis();
      if (livros.length === 0) {
        console.log('Nenhum livro disponível no momento.');
        return;
      }
      console.log(separador(65));
      livros.forEach((l) => {
        console.log(`[${l.id}] ${l.titulo}`);
        console.log(`     Autor: ${l.nome_autor} | Estoque: ${l.quantidade_estoque}`);
      });
      console.log(separador(65));
      console.log(`Total disponíveis: ${livros.length}`);
    } catch (error) {
      console.error(`\n❌ Erro: ${(error as Error).message}`);
    }
  }

  async livrosEmprestados(): Promise<void> {
    titulo('RELATÓRIO: LIVROS EMPRESTADOS');
    try {
      const emprestados = await this.service.livrosEmprestados();
      if (emprestados.length === 0) {
        console.log('Nenhum livro emprestado no momento.');
        return;
      }
      console.log(separador(65));
      emprestados.forEach((e) => {
        console.log(`📖 ${e.titulo}`);
        console.log(`   Cliente: ${e.nome_cliente}`);
        console.log(`   Emprestado em: ${formatarDataHora(e.data_emprestimo)}`);
        console.log(`   Prev. devolução: ${e.data_prevista_devolucao ? formatarDataHora(e.data_prevista_devolucao) : 'N/A'}`);
        console.log(separador(65));
      });
      console.log(`Total emprestados: ${emprestados.length}`);
    } catch (error) {
      console.error(`\n❌ Erro: ${(error as Error).message}`);
    }
  }

  async livrosPorAutor(): Promise<void> {
    titulo('RELATÓRIO: LIVROS POR AUTOR');
    try {
      const dados = await this.service.livrosPorAutor();
      if (dados.length === 0) {
        console.log('Nenhum dado encontrado.');
        return;
      }
      console.log(separador(55));
      dados.forEach((d) => {
        const barra = '█'.repeat(Math.min(parseInt(d.total_livros), 20));
        console.log(`${d.nome_autor.padEnd(30)} ${d.total_livros.padStart(3)} livro(s) ${barra}`);
      });
      console.log(separador(55));
    } catch (error) {
      console.error(`\n❌ Erro: ${(error as Error).message}`);
    }
  }

  async emprestimosPorLivro(): Promise<void> {
    titulo('RELATÓRIO: EMPRÉSTIMOS POR LIVRO (TOP 20)');
    try {
      const dados = await this.service.emprestimosPorLivro();
      if (dados.length === 0) {
        console.log('Nenhum empréstimo registrado.');
        return;
      }
      console.log(separador(60));
      dados.forEach((d, index) => {
        console.log(`${String(index + 1).padStart(2)}. ${d.titulo.padEnd(40)} ${d.total_emprestimos} empréstimo(s)`);
      });
      console.log(separador(60));
    } catch (error) {
      console.error(`\n❌ Erro: ${(error as Error).message}`);
    }
  }

  async clientesComEmprestimosAtivos(): Promise<void> {
    titulo('RELATÓRIO: CLIENTES COM EMPRÉSTIMOS ATIVOS');
    try {
      const dados = await this.service.clientesComEmprestimosAtivos();
      if (dados.length === 0) {
        console.log('Nenhum cliente com empréstimo ativo.');
        return;
      }
      console.log(separador(65));
      dados.forEach((c) => {
        console.log(`[${c.id}] ${c.nome}`);
        console.log(`     E-mail: ${c.email} | Empréstimos ativos: ${c.total_emprestimos_ativos}`);
      });
      console.log(separador(65));
      console.log(`Total de clientes com empréstimos ativos: ${dados.length}`);
    } catch (error) {
      console.error(`\n❌ Erro: ${(error as Error).message}`);
    }
  }
}
