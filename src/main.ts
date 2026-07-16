import dotenv from 'dotenv';
dotenv.config();

import { testConnection, closeConnection } from './database/connection';
import { menuAutores } from './menus/menuAutores';
import { menuLivros } from './menus/menuLivros';
import { menuClientes } from './menus/menuClientes';
import { menuEmprestimos } from './menus/menuEmprestimos';
import { menuRelatorios } from './menus/menuRelatorios';
import { pergunta } from './utils/input';
import { fecharInput } from './utils/input';

function exibirBanner(): void {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║      📚  BookStore Manager CLI         ║');
  console.log('║    Sistema de Gerenciamento Livraria   ║');
  console.log('╚════════════════════════════════════════╝\n');
}

async function menuPrincipal(): Promise<void> {
  let continuar = true;

  while (continuar) {
    console.log('\n======== MENU PRINCIPAL ========');
    console.log('1. Autores');
    console.log('2. Livros');
    console.log('3. Clientes');
    console.log('4. Empréstimos');
    console.log('5. Relatórios');
    console.log('0. Encerrar aplicação');
    console.log('================================');

    const opcao = await pergunta('Escolha uma opção: ');

    switch (opcao) {
      case '1': await menuAutores(); break;
      case '2': await menuLivros(); break;
      case '3': await menuClientes(); break;
      case '4': await menuEmprestimos(); break;
      case '5': await menuRelatorios(); break;
      case '0':
        continuar = false;
        break;
      default:
        console.log('❌ Opção inválida. Tente novamente.');
    }
  }
}

async function main(): Promise<void> {
  exibirBanner();

  const conectado = await testConnection();
  if (!conectado) {
    console.error('\n❌ Não foi possível conectar ao banco de dados.');
    console.error('   Verifique as variáveis no arquivo .env e se o PostgreSQL está rodando.');
    process.exit(1);
  }

  await menuPrincipal();

  fecharInput();
  await closeConnection();
  console.log('\n👋 Até logo! BookStore Manager encerrado.\n');
}

main().catch((err) => {
  console.error('💥 Erro inesperado na aplicação:', err);
  fecharInput();
  process.exit(1);
});
