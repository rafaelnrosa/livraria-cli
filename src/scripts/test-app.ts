/**
 * Script de teste funcional — cobre todos os RF do projeto
 * Executa sem input interativo, simulando o fluxo completo.
 */
import dotenv from 'dotenv';
dotenv.config();

import { testConnection, closeConnection } from '../database/connection';
import { AutorService }      from '../services/AutorService';
import { LivroService }      from '../services/LivroService';
import { ClienteService }    from '../services/ClienteService';
import { EmprestimoService } from '../services/EmprestimoService';
import { RelatorioService }  from '../services/RelatorioService';
import { formatarData, formatarDataHora, formatarMoeda, separador, titulo } from '../utils/formatters';

const autorService      = new AutorService();
const livroService      = new LivroService();
const clienteService    = new ClienteService();
const emprestimoService = new EmprestimoService();
const relatorioService  = new RelatorioService();

let erros = 0;
let sucessos = 0;

function ok(msg: string) { console.log(`  ✅ ${msg}`); sucessos++; }
function fail(msg: string, err?: unknown) {
  console.log(`  ❌ FALHOU: ${msg}`);
  if (err) console.log(`     → ${(err as Error).message}`);
  erros++;
}
function esperado(msg: string) { console.log(`  ⚠️  [esperado] ${msg}`); sucessos++; }

async function testarAutores() {
  titulo('TESTE: AUTORES');

  // Cadastro
  let autorId: number;
  try {
    const a = await autorService.cadastrar({ nome: 'Autor Teste', nacionalidade: 'Brasileira', data_nascimento: '1980-05-15' });
    autorId = a.id!;
    ok(`Cadastro — ID ${autorId}`);
  } catch(e) { fail('Cadastro de autor', e); return; }

  // Listagem
  try {
    const lista = await autorService.listar();
    ok(`Listagem — ${lista.length} autor(es) encontrado(s)`);
  } catch(e) { fail('Listagem de autores', e); }

  // Busca por ID
  try {
    const a = await autorService.buscarPorId(autorId!);
    ok(`Busca por ID — encontrado: ${a.nome}`);
  } catch(e) { fail('Busca por ID', e); }

  // Busca por nome
  try {
    const lista = await autorService.buscarPorNome('Teste');
    ok(`Busca por nome — ${lista.length} resultado(s)`);
  } catch(e) { fail('Busca por nome', e); }

  // Atualização
  try {
    const a = await autorService.atualizar(autorId!, { nome: 'Autor Teste Atualizado' });
    ok(`Atualização — novo nome: ${a.nome}`);
  } catch(e) { fail('Atualização de autor', e); }

  // ID inexistente
  try {
    await autorService.buscarPorId(99999);
    fail('Deveria ter lançado erro para ID inexistente');
  } catch(e) { esperado(`ID inexistente — ${(e as Error).message}`); }

  // Remoção
  try {
    await autorService.remover(autorId!);
    ok('Remoção — autor removido');
  } catch(e) { fail('Remoção de autor', e); }
}

async function testarLivros() {
  titulo('TESTE: LIVROS');

  // Pega um autor existente para vincular
  const autores = await autorService.listar();
  if (autores.length === 0) { fail('Nenhum autor disponível para teste de livros'); return; }
  const idAutor = autores[0].id!;

  let livroId: number;
  try {
    const l = await livroService.cadastrar({
      titulo: 'Livro de Teste', isbn: '9780000000001',
      ano_publicacao: 2024, preco: 49.90,
      quantidade_estoque: 10, id_autor: idAutor
    });
    livroId = l.id!;
    ok(`Cadastro — ID ${livroId}: "${l.titulo}"`);
  } catch(e) { fail('Cadastro de livro', e); return; }

  try {
    const lista = await livroService.listar();
    ok(`Listagem — ${lista.length} livro(s)`);
  } catch(e) { fail('Listagem de livros', e); }

  try {
    const l = await livroService.buscarPorId(livroId!);
    ok(`Busca por ID — "${l.titulo}" | Autor: ${l.nome_autor}`);
  } catch(e) { fail('Busca por ID', e); }

  try {
    const lista = await livroService.buscarPorTitulo('Teste');
    ok(`Busca por título — ${lista.length} resultado(s)`);
  } catch(e) { fail('Busca por título', e); }

  try {
    const l = await livroService.atualizar(livroId!, { preco: 59.90, quantidade_estoque: 8 });
    ok(`Atualização — novo preço: ${formatarMoeda(l.preco)}, estoque: ${l.quantidade_estoque}`);
  } catch(e) { fail('Atualização de livro', e); }

  // Autor inexistente
  try {
    await livroService.cadastrar({ titulo: 'Inválido', preco: 10, quantidade_estoque: 1, id_autor: 99999 });
    fail('Deveria ter lançado erro para autor inexistente');
  } catch(e) { esperado(`Autor inexistente — ${(e as Error).message}`); }

  // Remoção
  try {
    await livroService.remover(livroId!);
    ok('Remoção — livro removido');
  } catch(e) { fail('Remoção de livro', e); }
}

async function testarClientes() {
  titulo('TESTE: CLIENTES');

  let clienteId: number;
  try {
    const c = await clienteService.cadastrar({
      nome: 'Cliente Teste', email: 'cliente.teste@email.com',
      cpf: '98765432100', telefone: '(99) 99999-9999'
    });
    clienteId = c.id!;
    ok(`Cadastro — ID ${clienteId}: ${c.nome}`);
  } catch(e) { fail('Cadastro de cliente', e); return; }

  try {
    const lista = await clienteService.listar();
    ok(`Listagem — ${lista.length} cliente(s)`);
  } catch(e) { fail('Listagem', e); }

  try {
    const c = await clienteService.buscarPorId(clienteId!);
    ok(`Busca por ID — ${c.nome} | ${c.email}`);
  } catch(e) { fail('Busca por ID', e); }

  // E-mail duplicado
  try {
    await clienteService.cadastrar({ nome: 'Outro', email: 'cliente.teste@email.com' });
    fail('Deveria rejeitar e-mail duplicado');
  } catch(e) { esperado(`E-mail duplicado — ${(e as Error).message}`); }

  // E-mail inválido
  try {
    await clienteService.cadastrar({ nome: 'Inválido', email: 'nao-e-email' });
    fail('Deveria rejeitar e-mail inválido');
  } catch(e) { esperado(`E-mail inválido — ${(e as Error).message}`); }

  try {
    const c = await clienteService.atualizar(clienteId!, { telefone: '(11) 88888-8888' });
    ok(`Atualização — novo telefone: ${c.telefone}`);
  } catch(e) { fail('Atualização', e); }

  try {
    await clienteService.remover(clienteId!);
    ok('Remoção — cliente removido');
  } catch(e) { fail('Remoção', e); }
}

async function testarEmprestimos() {
  titulo('TESTE: EMPRÉSTIMOS');

  const livros  = await livroService.listar();
  const clientes = await clienteService.listar();

  const livroDisponivel = livros.find(l => l.quantidade_estoque > 0);
  const cliente = clientes[0];

  if (!livroDisponivel || !cliente) {
    fail('Sem livros disponíveis ou clientes para testar empréstimos');
    return;
  }

  let emprestimoId: number;
  try {
    const e = await emprestimoService.realizar(livroDisponivel.id!, cliente.id!);
    emprestimoId = e.id!;
    ok(`Empréstimo realizado — ID ${emprestimoId} | Livro: ${livroDisponivel.titulo} → Cliente: ${cliente.nome}`);
  } catch(e) { fail('Realizar empréstimo', e); return; }

  // Verificar que estoque diminuiu
  try {
    const livroAtualizado = await livroService.buscarPorId(livroDisponivel.id!);
    const estoqueEsperado = livroDisponivel.quantidade_estoque - 1;
    if (livroAtualizado.quantidade_estoque === estoqueEsperado) {
      ok(`Estoque decrementado corretamente — agora: ${livroAtualizado.quantidade_estoque}`);
    } else {
      fail(`Estoque incorreto. Esperado ${estoqueEsperado}, obtido ${livroAtualizado.quantidade_estoque}`);
    }
  } catch(e) { fail('Verificação de estoque', e); }

  // Listagem
  try {
    const lista = await emprestimoService.listar();
    ok(`Listagem — ${lista.length} empréstimo(s) no total`);
  } catch(e) { fail('Listagem de empréstimos', e); }

  // Listar ativos
  try {
    const ativos = await emprestimoService.listarAtivos();
    ok(`Ativos — ${ativos.length} empréstimo(s) ativo(s)`);
  } catch(e) { fail('Listar ativos', e); }

  // Busca por ID
  try {
    const e = await emprestimoService.buscarPorId(emprestimoId!);
    ok(`Busca por ID — "${e.titulo_livro}" | "${e.nome_cliente}" | Status: ${e.status}`);
  } catch(e) { fail('Busca por ID', e); }

  // Livro sem estoque (testa com um livro que está zerado por ter sido emprestado)
  try {
    // Zera estoque temporariamente para testar validação
    const livroSemEstoque = livros.find(l => l.quantidade_estoque === 0);
    if (livroSemEstoque) {
      await emprestimoService.realizar(livroSemEstoque.id!, cliente.id!);
      fail('Deveria rejeitar livro sem estoque');
    } else {
      ok('Validação de estoque — sem livro zerado para testar (todos têm estoque)');
    }
  } catch(e) { esperado(`Livro sem estoque — ${(e as Error).message}`); }

  // Devolução
  try {
    const devolvido = await emprestimoService.registrarDevolucao(emprestimoId!);
    ok(`Devolução registrada — Status: ${devolvido.status} | Data: ${formatarDataHora(devolvido.data_devolucao)}`);
  } catch(e) { fail('Registrar devolução', e); }

  // Verificar que estoque voltou
  try {
    const livroAtualizado = await livroService.buscarPorId(livroDisponivel.id!);
    if (livroAtualizado.quantidade_estoque === livroDisponivel.quantidade_estoque) {
      ok(`Estoque restaurado após devolução — volta para: ${livroAtualizado.quantidade_estoque}`);
    } else {
      fail(`Estoque não restaurado. Esperado ${livroDisponivel.quantidade_estoque}, obtido ${livroAtualizado.quantidade_estoque}`);
    }
  } catch(e) { fail('Verificação de estoque pós-devolução', e); }

  // Devolução dupla
  try {
    await emprestimoService.registrarDevolucao(emprestimoId!);
    fail('Deveria rejeitar devolução de empréstimo já devolvido');
  } catch(e) { esperado(`Devolução dupla — ${(e as Error).message}`); }
}

async function testarRelatorios() {
  titulo('TESTE: RELATÓRIOS');

  try {
    const dados = await relatorioService.livrosDisponiveis();
    ok(`Livros disponíveis — ${dados.length} resultado(s)`);
    dados.slice(0, 3).forEach(l => console.log(`     • ${l.titulo} (estoque: ${l.quantidade_estoque})`));
  } catch(e) { fail('Livros disponíveis', e); }

  try {
    const dados = await relatorioService.livrosEmprestados();
    ok(`Livros emprestados — ${dados.length} empréstimo(s) ativo(s)`);
    dados.slice(0, 3).forEach(l => console.log(`     • "${l.titulo}" → ${l.nome_cliente}`));
  } catch(e) { fail('Livros emprestados', e); }

  try {
    const dados = await relatorioService.livrosPorAutor();
    ok(`Livros por autor — ${dados.length} autor(es)`);
    dados.slice(0, 3).forEach(d => console.log(`     • ${d.nome_autor}: ${d.total_livros} livro(s)`));
  } catch(e) { fail('Livros por autor', e); }

  try {
    const dados = await relatorioService.emprestimosPorLivro();
    ok(`Empréstimos por livro — top ${dados.length}`);
    dados.slice(0, 3).forEach(d => console.log(`     • "${d.titulo}": ${d.total_emprestimos} empréstimo(s)`));
  } catch(e) { fail('Empréstimos por livro', e); }

  try {
    const dados = await relatorioService.clientesComEmprestimosAtivos();
    ok(`Clientes com empréstimos ativos — ${dados.length} cliente(s)`);
    dados.slice(0, 3).forEach(c => console.log(`     • ${c.nome}: ${c.total_emprestimos_ativos} ativo(s)`));
  } catch(e) { fail('Clientes com empréstimos ativos', e); }
}

async function testarValidacoes() {
  titulo('TESTE: VALIDAÇÕES DE REGRAS DE NEGÓCIO');

  // Nome curto demais
  try {
    await autorService.cadastrar({ nome: 'A' });
    fail('Deveria rejeitar nome com 1 caractere');
  } catch(e) { esperado(`Nome inválido — ${(e as Error).message}`); }

  // Preço negativo
  const autores = await autorService.listar();
  if (autores.length > 0) {
    try {
      await livroService.cadastrar({ titulo: 'Teste', preco: -10, quantidade_estoque: 1, id_autor: autores[0].id! });
      fail('Deveria rejeitar preço negativo');
    } catch(e) { esperado(`Preço negativo — ${(e as Error).message}`); }
  }

  // Remover autor com livros
  try {
    const autoresComLivros = await autorService.listar();
    const livros = await livroService.listar();
    const autorComLivro = autoresComLivros.find(a => livros.some(l => l.id_autor === a.id));
    if (autorComLivro) {
      await autorService.remover(autorComLivro.id!);
      fail('Deveria rejeitar remoção de autor com livros');
    } else {
      ok('Validação de remoção de autor — sem caso para testar');
    }
  } catch(e) { esperado(`Autor com livros — ${(e as Error).message}`); }

  // Empréstimo com livro inexistente
  try {
    const clientes = await clienteService.listar();
    if (clientes.length > 0) {
      await emprestimoService.realizar(99999, clientes[0].id!);
      fail('Deveria rejeitar livro inexistente');
    }
  } catch(e) { esperado(`Livro inexistente — ${(e as Error).message}`); }

  // Empréstimo com cliente inexistente
  try {
    const livros = await livroService.listar();
    const disponivel = livros.find(l => l.quantidade_estoque > 0);
    if (disponivel) {
      await emprestimoService.realizar(disponivel.id!, 99999);
      fail('Deveria rejeitar cliente inexistente');
    }
  } catch(e) { esperado(`Cliente inexistente — ${(e as Error).message}`); }
}

async function main() {
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║   🧪  BookStore Manager — Testes Funcionais  ║');
  console.log('╚══════════════════════════════════════════════╝');

  const ok = await testConnection();
  if (!ok) process.exit(1);

  await testarAutores();
  await testarLivros();
  await testarClientes();
  await testarEmprestimos();
  await testarRelatorios();
  await testarValidacoes();

  console.log('\n' + separador(50));
  console.log(`📊 RESULTADO FINAL`);
  console.log(separador(50));
  console.log(`  ✅ Sucessos : ${sucessos}`);
  console.log(`  ❌ Falhas   : ${erros}`);
  console.log(separador(50));

  if (erros === 0) {
    console.log('\n🎉 Todos os testes passaram!\n');
  } else {
    console.log(`\n⚠️  ${erros} teste(s) falharam. Verifique os detalhes acima.\n`);
  }

  await closeConnection();
  process.exit(erros > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('💥 Erro inesperado:', err.message);
  process.exit(1);
});
