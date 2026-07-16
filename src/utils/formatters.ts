export function formatarData(data: Date | string | null | undefined): string {
  if (!data) return 'N/A';
  const d = typeof data === 'string' ? new Date(data) : data;
  return d.toLocaleDateString('pt-BR');
}

export function formatarDataHora(data: Date | string | null | undefined): string {
  if (!data) return 'N/A';
  const d = typeof data === 'string' ? new Date(data) : data;
  return d.toLocaleString('pt-BR');
}

export function formatarMoeda(valor: number | string): string {
  const v = typeof valor === 'string' ? parseFloat(valor) : valor;
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function separador(tamanho = 50): string {
  return '─'.repeat(tamanho);
}

export function titulo(texto: string): void {
  const linha = '═'.repeat(texto.length + 4);
  console.log(`\n${linha}`);
  console.log(`  ${texto}`);
  console.log(`${linha}`);
}
