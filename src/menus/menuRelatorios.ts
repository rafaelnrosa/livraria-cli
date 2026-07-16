import { RelatorioController } from '../controllers/RelatorioController';
import { pergunta } from '../utils/input';

const controller = new RelatorioController();

export async function menuRelatorios(): Promise<void> {
  let continuar = true;

  while (continuar) {
    console.log('\n=== RELATÓRIOS ===');
    console.log('1. Livros disponíveis');
    console.log('2. Livros emprestados');
    console.log('3. Livros por autor');
    console.log('4. Empréstimos por livro (Top 20)');
    console.log('5. Clientes com empréstimos ativos');
    console.log('0. Voltar ao menu principal');
    console.log('==================');

    const opcao = await pergunta('Escolha uma opção: ');

    switch (opcao) {
      case '1': await controller.livrosDisponiveis(); break;
      case '2': await controller.livrosEmprestados(); break;
      case '3': await controller.livrosPorAutor(); break;
      case '4': await controller.emprestimosPorLivro(); break;
      case '5': await controller.clientesComEmprestimosAtivos(); break;
      case '0': continuar = false; break;
      default: console.log('❌ Opção inválida. Tente novamente.');
    }
  }
}
