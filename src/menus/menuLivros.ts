import { LivroController } from '../controllers/LivroController';
import { pergunta } from '../utils/input';

const controller = new LivroController();

export async function menuLivros(): Promise<void> {
  let continuar = true;

  while (continuar) {
    console.log('\n=== GERENCIAR LIVROS ===');
    console.log('1. Cadastrar livro');
    console.log('2. Listar livros');
    console.log('3. Consultar livro por ID');
    console.log('4. Atualizar livro');
    console.log('5. Remover livro');
    console.log('0. Voltar ao menu principal');
    console.log('========================');

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
