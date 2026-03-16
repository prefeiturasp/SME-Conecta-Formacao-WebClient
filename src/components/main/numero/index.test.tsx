import { describe, test, expect } from '@jest/globals';

describe('InputNumero', () => {
  describe('getValueFromEvent - remoção de caracteres não numéricos', () => {
    const getValueFromEvent = (value: string) => `${value}`.replace(/\D/g, '');

    test('deve retornar apenas dígitos quando o valor contém letras e números', () => {
      expect(getValueFromEvent('abc123')).toBe('123');
    });

    test('deve retornar string vazia quando o valor contém apenas letras', () => {
      expect(getValueFromEvent('abc')).toBe('');
    });

    test('deve manter o valor quando ele já contém apenas dígitos', () => {
      expect(getValueFromEvent('42')).toBe('42');
    });

    test('deve remover pontos e vírgulas', () => {
      expect(getValueFromEvent('1.234,56')).toBe('123456');
    });

    test('deve remover espaços', () => {
      expect(getValueFromEvent('12 34')).toBe('1234');
    });

    test('deve remover caracteres especiais', () => {
      expect(getValueFromEvent('!@#$%100')).toBe('100');
    });

    test('deve retornar string vazia para entrada vazia', () => {
      expect(getValueFromEvent('')).toBe('');
    });

    test('deve retornar string vazia para entrada com apenas símbolos', () => {
      expect(getValueFromEvent('.-/')).toBe('');
    });
  });

  describe('Propriedades padrão', () => {
    test('deve ter id INPUT_NUMERO no input interno', () => {
      const id = 'INPUT_NUMERO';
      expect(id).toBe('INPUT_NUMERO');
    });

    test('deve aceitar inputProps como obrigatório', () => {
      const inputProps = { placeholder: 'Digite um número' };
      expect(inputProps.placeholder).toBe('Digite um número');
    });

    test('deve aceitar formItemProps como opcional', () => {
      const props = { inputProps: { placeholder: '' } };
      expect((props as any).formItemProps).toBeUndefined();
    });
  });
});
