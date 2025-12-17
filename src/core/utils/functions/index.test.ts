import { removerTudoQueNaoEhDigito } from './index';

describe('Functions Utilities', () => {
  test('removerTudoQueNaoEhDigito deve remover todos os caracteres não numéricos', () => {
    expect(removerTudoQueNaoEhDigito('123.456.789-00')).toBe('12345678900');
    expect(removerTudoQueNaoEhDigito('abc123def456')).toBe('123456');
    expect(removerTudoQueNaoEhDigito('(11) 98765-4321')).toBe('11987654321');
  });

  test('removerTudoQueNaoEhDigito deve lidar com valores vazios', () => {
    expect(removerTudoQueNaoEhDigito('')).toBe('');
    expect(removerTudoQueNaoEhDigito('abc')).toBe('');
  });

  test('removerTudoQueNaoEhDigito deve manter apenas números', () => {
    expect(removerTudoQueNaoEhDigito('12345')).toBe('12345');
    expect(removerTudoQueNaoEhDigito(12345)).toBe('12345');
  });

  test('removerTudoQueNaoEhDigito deve lidar com caracteres especiais', () => {
    expect(removerTudoQueNaoEhDigito('!@#$%123^&*()')).toBe('123');
    expect(removerTudoQueNaoEhDigito('R$ 1.234,56')).toBe('123456');
  });
});
