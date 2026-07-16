import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export function pergunta(texto: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(texto, (resposta) => {
      resolve(resposta.trim());
    });
  });
}

export async function perguntaObrigatoria(texto: string): Promise<string> {
  let resposta = '';
  while (!resposta) {
    resposta = await pergunta(texto);
    if (!resposta) console.log('  ⚠️  Este campo é obrigatório.');
  }
  return resposta;
}

export async function perguntaNumero(texto: string): Promise<number | null> {
  const entrada = await pergunta(texto);
  if (!entrada) return null;
  const numero = parseFloat(entrada.replace(',', '.'));
  return isNaN(numero) ? null : numero;
}

export async function perguntaInteiro(texto: string): Promise<number | null> {
  const entrada = await pergunta(texto);
  if (!entrada) return null;
  const numero = parseInt(entrada, 10);
  return isNaN(numero) ? null : numero;
}

export function fecharInput(): void {
  rl.close();
}
