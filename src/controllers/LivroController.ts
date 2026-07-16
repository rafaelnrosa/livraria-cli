import { LivroService } from '../services/LivroService';
import { pergunta, perguntaObrigatoria, perguntaNumero, perguntaInteiro } from '../utils/input';
import { formatarMoeda, separador, titulo } from '../utils/formatters';
import { validarId } from '../utils/validators';
import { ILivro } from '../models/Livro';

export class LivroController {
  private readonly service: LivroService;

  constructor() {
    this.service = new LivroService();
  }

  async cadastrar(): Promise<void> {
    titulo('CADASTRAR LIVRO');
    try {
      const tituloLivro = await perguntaObrigatoria('Título: ');
      const isbn = await pergunta('ISBN (Enter para pular): ');
      const anoStr = await pergunta('Ano de publicação (Enter para pular): ');
      const precoStr = await perguntaNumero('Preço (ex: 39.90): ');
      const estoqueStr = await perguntaInteiro('Quantidade em estoque: ');
      const autorIdStr = await perguntaObrigatoria('ID do autor: ');

      const id_autor = validarId(autorIdStr);
      if (!id_autor) { console.log('❌ ID do autor inválido.'); return; }
      if (precoStr === null) { console.log('❌ Preço inválido.'); return; }
      if (estoqueStr === null) { console.log('❌ Estoque inválido.'); return; }

      const livro: ILivro = {
        titulo: tituloLivro,
        isbn: isbn || undefined,
        ano_publicacao: anoStr ? parseInt(anoStr) : undefined,
        preco: precoStr,
        quantidade_estoque: estoqueStr,
        id_autor,
      };

      const criado = await this.service.cadastrar(livro);
      console.log(`\n✅ Livro cadastrado com sucesso! ID: ${criado.id}`);
    } catch (error) {
      console.error(`\n❌ Erro: ${(error as Error).message}`);
    }
  }

  async listar(): Promise<void> {
    titulo('LISTA DE LIVROS');
    try {
      const livros = await this.service.listar();
      if (livros.length === 0) {
        console.log('Nenhum livro cadastrado.');
        return;
      }
      console.log(separador(65));
      livros.forEach((l) => {
        const disponibilidade = l.quantidade_estoque > 0 ? '✅ Disponível' : '❌ Indisponível';
        console.log(`ID: ${l.id} | ${l.titulo}`);
        console.log(`    Autor: ${l.nome_autor} | Ano: ${l.ano_publicacao ?? 'N/A'}`);
        console.log(`    Preço: ${formatarMoeda(l.preco)} | Estoque: ${l.quantidade_estoque} | ${disponibilidade}`);
        console.log(separador(65));
      });
      console.log(`Total: ${livros.length} livro(s)`);
    } catch (error) {
      console.error(`\n❌ Erro: ${(error as Error).message}`);
    }
  }

  async buscarPorId(): Promise<void> {
    titulo('CONSULTAR LIVRO');
    try {
      const entrada = await perguntaObrigatoria('ID do livro: ');
      const id = validarId(entrada);
      if (!id) { console.log('❌ ID inválido.'); return; }

      const livro = await this.service.buscarPorId(id);
      console.log(separador(65));
      console.log(`ID:       ${livro.id}`);
      console.log(`Título:   ${livro.titulo}`);
      console.log(`Autor:    ${livro.nome_autor}`);
      console.log(`ISBN:     ${livro.isbn ?? 'N/A'}`);
      console.log(`Ano:      ${livro.ano_publicacao ?? 'N/A'}`);
      console.log(`Preço:    ${formatarMoeda(livro.preco)}`);
      console.log(`Estoque:  ${livro.quantidade_estoque}`);
      console.log(separador(65));
    } catch (error) {
      console.error(`\n❌ Erro: ${(error as Error).message}`);
    }
  }

  async atualizar(): Promise<void> {
    titulo('ATUALIZAR LIVRO');
    try {
      const entrada = await perguntaObrigatoria('ID do livro: ');
      const id = validarId(entrada);
      if (!id) { console.log('❌ ID inválido.'); return; }

      const livro = await this.service.buscarPorId(id);
      console.log(`Editando: ${livro.titulo} (Enter para manter o valor atual)`);

      const tituloNovo = await pergunta(`Título [${livro.titulo}]: `);
      const isbn = await pergunta(`ISBN [${livro.isbn ?? ''}]: `);
      const anoStr = await pergunta(`Ano publicação [${livro.ano_publicacao ?? ''}]: `);
      const precoStr = await pergunta(`Preço [${livro.preco}]: `);
      const estoqueStr = await pergunta(`Estoque [${livro.quantidade_estoque}]: `);
      const autorIdStr = await pergunta(`ID do autor [${livro.id_autor}]: `);

      const dados: Partial<ILivro> = {};
      if (tituloNovo) dados.titulo = tituloNovo;
      if (isbn) dados.isbn = isbn;
      if (anoStr) dados.ano_publicacao = parseInt(anoStr);
      if (precoStr) dados.preco = parseFloat(precoStr.replace(',', '.'));
      if (estoqueStr) dados.quantidade_estoque = parseInt(estoqueStr);
      if (autorIdStr) {
        const novoId = validarId(autorIdStr);
        if (!novoId) { console.log('❌ ID do autor inválido.'); return; }
        dados.id_autor = novoId;
      }

      if (Object.keys(dados).length === 0) {
        console.log('ℹ️  Nenhuma alteração realizada.');
        return;
      }

      const atualizado = await this.service.atualizar(id, dados);
      console.log(`\n✅ Livro atualizado: ${atualizado.titulo}`);
    } catch (error) {
      console.error(`\n❌ Erro: ${(error as Error).message}`);
    }
  }

  async remover(): Promise<void> {
    titulo('REMOVER LIVRO');
    try {
      const entrada = await perguntaObrigatoria('ID do livro: ');
      const id = validarId(entrada);
      if (!id) { console.log('❌ ID inválido.'); return; }

      const livro = await this.service.buscarPorId(id);
      const confirmacao = await pergunta(`Confirma remoção de "${livro.titulo}"? (s/N): `);
      if (confirmacao.toLowerCase() !== 's') {
        console.log('Operação cancelada.');
        return;
      }

      await this.service.remover(id);
      console.log('\n✅ Livro removido com sucesso!');
    } catch (error) {
      console.error(`\n❌ Erro: ${(error as Error).message}`);
    }
  }
}
