import { BaseDTO } from './base-dto';

describe('BaseDTO', () => {
  test('deve aceitar objeto válido com todos os campos', () => {
    const base: BaseDTO = {
      id: 1,
      excluido: false,
    };

    expect(base.id).toBe(1);
    expect(base.excluido).toBe(false);
  });

  test('deve aceitar objeto com excluido true', () => {
    const base: BaseDTO = {
      id: 123,
      excluido: true,
    };

    expect(base.id).toBe(123);
    expect(base.excluido).toBe(true);
  });

  test('id deve ser number', () => {
    const base: BaseDTO = {
      id: 999,
      excluido: false,
    };

    expect(typeof base.id).toBe('number');
  });

  test('excluido deve ser boolean', () => {
    const base1: BaseDTO = {
      id: 1,
      excluido: true,
    };

    const base2: BaseDTO = {
      id: 2,
      excluido: false,
    };

    expect(typeof base1.excluido).toBe('boolean');
    expect(typeof base2.excluido).toBe('boolean');
  });

  test('deve aceitar diferentes valores de id', () => {
    const base1: BaseDTO = { id: 0, excluido: false };
    const base2: BaseDTO = { id: -1, excluido: false };
    const base3: BaseDTO = { id: 999999, excluido: false };

    expect(base1.id).toBe(0);
    expect(base2.id).toBe(-1);
    expect(base3.id).toBe(999999);
  });
});
