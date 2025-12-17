import { RetornoBaseDTO } from './retorno-base-dto';

describe('RetornoBaseDTO', () => {
  test('deve aceitar objeto válido com todos os campos', () => {
    const retorno: RetornoBaseDTO = {
      existemErros: false,
      mensagens: ['Sucesso'],
      status: 200,
    };

    expect(retorno.existemErros).toBe(false);
    expect(retorno.mensagens).toEqual(['Sucesso']);
    expect(retorno.status).toBe(200);
  });

  test('deve aceitar objeto com status undefined', () => {
    const retorno: RetornoBaseDTO = {
      existemErros: true,
      mensagens: ['Erro ao processar'],
      status: undefined,
    };

    expect(retorno.existemErros).toBe(true);
    expect(retorno.mensagens).toHaveLength(1);
    expect(retorno.status).toBeUndefined();
  });

  test('deve aceitar múltiplas mensagens', () => {
    const retorno: RetornoBaseDTO = {
      existemErros: true,
      mensagens: ['Erro 1', 'Erro 2', 'Erro 3'],
      status: 400,
    };

    expect(retorno.mensagens).toHaveLength(3);
    expect(retorno.mensagens).toContain('Erro 1');
  });

  test('deve aceitar array vazio de mensagens', () => {
    const retorno: RetornoBaseDTO = {
      existemErros: false,
      mensagens: [],
      status: 204,
    };

    expect(retorno.mensagens).toEqual([]);
    expect(retorno.mensagens).toHaveLength(0);
  });

  test('status deve ser number ou undefined', () => {
    const retorno1: RetornoBaseDTO = {
      existemErros: false,
      mensagens: [],
      status: 500,
    };

    const retorno2: RetornoBaseDTO = {
      existemErros: false,
      mensagens: [],
      status: undefined,
    };

    expect(typeof retorno1.status).toBe('number');
    expect(retorno2.status).toBeUndefined();
  });
});
