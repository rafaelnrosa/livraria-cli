import { ClienteController } from '../controllers/ClienteController';
import { pergunta } from '../utils/input';

const controller = new ClienteController();

export async function menuClientes(): Promise<void> {
  let continuar = true;

  while (continuar) {
    console.log('\n=== GERENCIAR CLIENTES ===');
    console.log('1. Cadastrar cliente');
    console.log('2. Listar clientes');
    console.log('3. Consultar cliente por ID');
    console.log('4. Atualizar cliente');
    console.log('5. Remover cliente');
    console.log('0. Voltar ao menu principal');
    console.log('==========================');

    const opcao = await pergunta('Escolha uma opção: ');

    switch (opcao) {
      case '1': await controller.cadastrar(); break;
      case '2': await controller.listar(); break;
      case '3': await controller.buscarPorId(); break;
      case '4': await controller.atualizar(); break;
      case '5': await controller.remover(); break;
      case '0': continuar = false; break;
      default: console.log('❌ Opção inválida. Tente novamente.');
    }
  }
}
