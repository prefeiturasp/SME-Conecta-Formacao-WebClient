import { PaginacaoResultadoDTO } from './paginacao-resultado-dto';

describe('PaginacaoResultadoDTO', () => {
  test('deve aceitar paginação com array de objetos', () => {
    const paginacao: PaginacaoResultadoDTO<Array<{ id: number; nome: string }>> = {
      sucesso: true,
      items: [
        { id: 1, nome: 'Item 1' },
        { id: 2, nome: 'Item 2' },
      ],
      totalPaginas: 5,
      totalRegistros: 50,
    };

    expect(paginacao.sucesso).toBe(true);
    expect(paginacao.items).toHaveLength(2);
    expect(paginacao.totalPaginas).toBe(5);
    expect(paginacao.totalRegistros).toBe(50);
  });

  test('deve aceitar paginação com array vazio', () => {
    const paginacao: PaginacaoResultadoDTO<never[]> = {
      sucesso: true,
      items: [],
      totalPaginas: 0,
      totalRegistros: 0,
    };

    expect(paginacao.items).toHaveLength(0);
    expect(paginacao.totalPaginas).toBe(0);
    expect(paginacao.totalRegistros).toBe(0);
  });

  test('deve aceitar paginação com sucesso false', () => {
    const paginacao: PaginacaoResultadoDTO<never[]> = {
      sucesso: false,
      items: [],
      totalPaginas: 0,
      totalRegistros: 0,
    };

    expect(paginacao.sucesso).toBe(false);
  });

  test('totalRegistros deve ser maior ou igual a quantidade de items', () => {
    const paginacao: PaginacaoResultadoDTO<Array<{ id: number }>> = {
      sucesso: true,
      items: [{ id: 1 }, { id: 2 }, { id: 3 }],
      totalPaginas: 10,
      totalRegistros: 100,
    };

    expect(paginacao.totalRegistros).toBeGreaterThanOrEqual(paginacao.items.length);
  });

  test('deve aceitar diferentes tipos genéricos', () => {
    const paginacaoStrings: PaginacaoResultadoDTO<string[]> = {
      sucesso: true,
      items: ['a', 'b', 'c'],
      totalPaginas: 1,
      totalRegistros: 3,
    };

    const paginacaoNumbers: PaginacaoResultadoDTO<number[]> = {
      sucesso: true,
      items: [1, 2, 3],
      totalPaginas: 1,
      totalRegistros: 3,
    };

    expect(paginacaoStrings.items).toEqual(['a', 'b', 'c']);
    expect(paginacaoNumbers.items).toEqual([1, 2, 3]);
  });
});
