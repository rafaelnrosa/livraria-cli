import { AutorService } from '../services/AutorService';
import { pergunta, perguntaObrigatoria } from '../utils/input';
import { formatarData, separador, titulo } from '../utils/formatters';
import { validarId } from '../utils/validators';
import { IAutor } from '../models/Autor';

export class AutorController {
  private readonly service: AutorService;

  constructor() {
    this.service = new AutorService();
  }

  async cadastrar(): Promise<void> {
    titulo('CADASTRAR AUTOR');
    try {
      const nome = await perguntaObrigatoria('Nome: ');
      const nacionalidade = await pergunta('Nacionalidade (Enter para pular): ');
      const data_nascimento = await pergunta('Data de nascimento (AAAA-MM-DD, Enter para pular): ');

      const autor: IAutor = {
        nome,
        nacionalidade: nacionalidade || undefined,
        data_nascimento: data_nascimento || undefined,
      };

      const criado = await this.service.cadastrar(autor);
      console.log(`\n✅ Autor cadastrado com sucesso! ID: ${criado.id}`);
    } catch (error) {
      console.error(`\n❌ Erro: ${(error as Error).message}`);
    }
  }

  async listar(): Promise<void> {
    titulo('LISTA DE AUTORES');
    try {
      const autores = await this.service.listar();
      if (autores.length === 0) {
        console.log('Nenhum autor cadastrado.');
        return;
      }
      console.log(separador(60));
      autores.forEach((a) => {
        console.log(`ID: ${a.id} | Nome: ${a.nome}`);
        console.log(`    Nacionalidade: ${a.nacionalidade ?? 'N/A'} | Nascimento: ${formatarData(a.data_nascimento)}`);
        console.log(separador(60));
      });
      console.log(`Total: ${autores.length} autor(es)`);
    } catch (error) {
      console.error(`\n❌ Erro: ${(error as Error).message}`);
    }
  }

  async buscarPorId(): Promise<void> {
    titulo('CONSULTAR AUTOR');
    try {
      const entrada = await perguntaObrigatoria('ID do autor: ');
      const id = validarId(entrada);
      if (!id) { console.log('❌ ID inválido.'); return; }

      const autor = await this.service.buscarPorId(id);
      console.log(separador(60));
      console.log(`ID:           ${autor.id}`);
      console.log(`Nome:         ${autor.nome}`);
      console.log(`Nacionalidade: ${autor.nacionalidade ?? 'N/A'}`);
      console.log(`Nascimento:   ${formatarData(autor.data_nascimento)}`);
      console.log(separador(60));
    } catch (error) {
      console.error(`\n❌ Erro: ${(error as Error).message}`);
    }
  }

  async atualizar(): Promise<void> {
    titulo('ATUALIZAR AUTOR');
    try {
      const entrada = await perguntaObrigatoria('ID do autor: ');
      const id = validarId(entrada);
      if (!id) { console.log('❌ ID inválido.'); return; }

      const autor = await this.service.buscarPorId(id);
      console.log(`Editando: ${autor.nome} (Enter para manter o valor atual)`);

      const nome = await pergunta(`Nome [${autor.nome}]: `);
      const nacionalidade = await pergunta(`Nacionalidade [${autor.nacionalidade ?? ''}]: `);
      const data_nascimento = await pergunta(`Data nascimento [${autor.data_nascimento ?? ''}]: `);

      const dados: Partial<IAutor> = {};
      if (nome) dados.nome = nome;
      if (nacionalidade) dados.nacionalidade = nacionalidade;
      if (data_nascimento) dados.data_nascimento = data_nascimento;

      if (Object.keys(dados).length === 0) {
        console.log('ℹ️  Nenhuma alteração realizada.');
        return;
      }

      const atualizado = await this.service.atualizar(id, dados);
      console.log(`\n✅ Autor atualizado: ${atualizado.nome}`);
    } catch (error) {
      console.error(`\n❌ Erro: ${(error as Error).message}`);
    }
  }

  async remover(): Promise<void> {
    titulo('REMOVER AUTOR');
    try {
      const entrada = await perguntaObrigatoria('ID do autor: ');
      const id = validarId(entrada);
      if (!id) { console.log('❌ ID inválido.'); return; }

      const autor = await this.service.buscarPorId(id);
      const confirmacao = await pergunta(`Confirma remoção de "${autor.nome}"? (s/N): `);
      if (confirmacao.toLowerCase() !== 's') {
        console.log('Operação cancelada.');
        return;
      }

      await this.service.remover(id);
      console.log('\n✅ Autor removido com sucesso!');
    } catch (error) {
      console.error(`\n❌ Erro: ${(error as Error).message}`);
    }
  }
}
