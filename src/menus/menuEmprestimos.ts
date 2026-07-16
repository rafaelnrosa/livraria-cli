import { EmprestimoController } from '../controllers/EmprestimoController';
import { pergunta } from '../utils/input';

const controller = new EmprestimoController();

export async function menuEmprestimos(): Promise<void> {
  let continuar = true;

  while (continuar) {
    console.log('\n=== GERENCIAR EMPRÉSTIMOS ===');
    console.log('1. Realizar empréstimo');
    console.log('2. Registrar devolução');
    console.log('3. Listar todos os empréstimos');
    console.log('4. Listar empréstimos ativos');
    console.log('5. Consultar empréstimo por ID');
    console.log('0. Voltar ao menu principal');
    console.log('=============================');

    const opcao = await pergunta('Escolha uma opção: ');

    switch (opcao) {
      case '1': await controller.realizar(); break;
      case '2': await controller.registrarDevolucao(); break;
      case '3': await controller.listar(); break;
      case '4': await controller.listarAtivos(); break;
      case '5': await controller.buscarPorId(); break;
      case '0': continuar = false; break;
      default: console.log('❌ Opção inválida. Tente novamente.');
    }
  }
}
