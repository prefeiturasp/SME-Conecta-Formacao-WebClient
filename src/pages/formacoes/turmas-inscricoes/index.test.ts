import { FiltroTurmaInscricoesProps } from './index';

describe('FiltroTurmaInscricoesProps', () => {
  test('deve criar um objeto de filtro válido com todos os campos nulos', () => {
    const filtro: FiltroTurmaInscricoesProps = {
      cpf: null,
      turmasId: null,
      nomeCursista: null,
      registroFuncional: null,
      Situacao: null,
      CargoFuncaoId: null,
    };

    expect(filtro.cpf).toBeNull();
    expect(filtro.turmasId).toBeNull();
    expect(filtro.nomeCursista).toBeNull();
    expect(filtro.registroFuncional).toBeNull();
  });

  test('deve criar um objeto de filtro com valores preenchidos', () => {
    const filtro: FiltroTurmaInscricoesProps = {
      cpf: 12345678900,
      turmasId: [1, 2, 3],
      nomeCursista: 'João da Silva',
      registroFuncional: 123456,
      Situacao: 1,
      CargoFuncaoId: 1,
    };

    expect(filtro.cpf).toBe(12345678900);
    expect(filtro.turmasId).toEqual([1, 2, 3]);
    expect(filtro.nomeCursista).toBe('João da Silva');
    expect(filtro.registroFuncional).toBe(123456);
  });

  test('deve aceitar CPF como número', () => {
    const filtro: FiltroTurmaInscricoesProps = {
      cpf: 12345678900,
      turmasId: null,
      nomeCursista: null,
      registroFuncional: null,
      Situacao: null,
      CargoFuncaoId: null,
    };

    expect(typeof filtro.cpf).toBe('number');
  });

  test('deve aceitar array de IDs de turmas', () => {
    const filtro: FiltroTurmaInscricoesProps = {
      cpf: null,
      turmasId: [10, 20, 30],
      nomeCursista: null,
      registroFuncional: null,
      Situacao: null,
      CargoFuncaoId: null,
    };

    expect(Array.isArray(filtro.turmasId)).toBe(true);
    expect(filtro.turmasId?.length).toBe(3);
  });

  test('deve aceitar string para nome do cursista', () => {
    const filtro: FiltroTurmaInscricoesProps = {
      cpf: null,
      turmasId: null,
      nomeCursista: 'Maria Santos',
      registroFuncional: null,
      Situacao: null,
      CargoFuncaoId: null,
    };

    expect(typeof filtro.nomeCursista).toBe('string');
    expect(filtro.nomeCursista).toBe('Maria Santos');
  });
});
