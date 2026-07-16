export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

export function validarNumeroPositivo(valor: number): boolean {
  return !isNaN(valor) && valor >= 0;
}

export function validarId(valor: string): number | null {
  const id = parseInt(valor, 10);
  return isNaN(id) || id <= 0 ? null : id;
}

export function validarData(valor: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(valor)) return false;
  const data = new Date(valor);
  return !isNaN(data.getTime());
}
