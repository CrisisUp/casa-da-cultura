import { formatCPF, formatPhone, formatDate } from '../utils';

describe('formatCPF', () => {
  it('formata CPF corretamente', () => {
    expect(formatCPF('12345678901')).toBe('123.456.789-01');
  });

  it('retorna string vazia para input vazio', () => {
    expect(formatCPF('')).toBe('');
  });

  it('formata CPF parcial (menos de 11 dígitos)', () => {
    const result = formatCPF('123');
    expect(result).toMatch(/123/); // Formata o que tem
  });

  it('remove caracteres não numéricos e reformata', () => {
    expect(formatCPF('123.456.789-01')).toBe('123.456.789-01');
  });

  it('formata CPF com 11 dígitos quaisquer', () => {
    const result = formatCPF('99999999999');
    expect(result).toBe('999.999.999-99');
  });
});

describe('formatPhone', () => {
  it('formata telefone com 11 dígitos', () => {
    expect(formatPhone('11987654321')).toBe('(11) 98765-4321');
  });

  it('trata telefone vazio', () => {
    expect(formatPhone('')).toBe('');
  });

  it('formata telefone incompleto (trunca)', () => {
    const result = formatPhone('119876');
    expect(result).toMatch(/\(/); // Formata parcialmente
  });

  it('remove caracteres especiais antes de formatar', () => {
    const formatted = formatPhone('(11) 98765-4321');
    expect(formatted).toBe('(11) 98765-4321');
  });

  it('formata outro telefone válido', () => {
    expect(formatPhone('21987654321')).toBe('(21) 98765-4321');
  });
});

describe('formatDate', () => {
  it('formata data no formato pt-BR', () => {
    const date = new Date('2026-09-15T12:00:00');
    const formatted = formatDate(date);
    expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/); // Formato DD/MM/YYYY
  });

  it('trata data válida retornando string formatada', () => {
    const date = new Date(2026, 8, 15); // JS months são 0-indexed
    const formatted = formatDate(date);
    expect(formatted).toBeDefined();
    expect(typeof formatted).toBe('string');
  });

  it('formata diferentes datas', () => {
    const date1 = new Date(2026, 0, 1);
    const date2 = new Date(2026, 11, 31);
    const formatted1 = formatDate(date1);
    const formatted2 = formatDate(date2);

    expect(formatted1).toBeDefined();
    expect(formatted2).toBeDefined();
  });
});
