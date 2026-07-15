import { TipoCodaf } from './tipo-codaf';

describe('TipoCodaf', () => {
  it('deve possuir os valores numéricos corretos', () => {
    expect(TipoCodaf.ListaPresenca).toBe(1);
    expect(TipoCodaf.Suplementar).toBe(2);
  });

  it('deve possuir os nomes corretos para os valores numéricos', () => {
    expect(TipoCodaf[1]).toBe('ListaPresenca');
    expect(TipoCodaf[2]).toBe('Suplementar');
  });

  it('deve possuir exatamente dois tipos', () => {
    const valores = Object.values(TipoCodaf).filter(
      (value): value is TipoCodaf => typeof value === 'number',
    );

    expect(valores).toEqual([
      TipoCodaf.ListaPresenca,
      TipoCodaf.Suplementar,
    ]);

    expect(valores).toHaveLength(2);
  });

  it('não deve possuir valores duplicados', () => {
    const valores = Object.values(TipoCodaf).filter(
      (value): value is TipoCodaf => typeof value === 'number',
    );

    expect(new Set(valores).size).toBe(valores.length);
  });

  it('deve possuir somente as chaves esperadas', () => {
    const chaves = Object.keys(TipoCodaf).filter((key) =>
      Number.isNaN(Number(key)),
    );

    expect(chaves).toEqual([
      'ListaPresenca',
      'Suplementar',
    ]);
  });
});
