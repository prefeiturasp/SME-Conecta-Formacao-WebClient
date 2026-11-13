import { TipoFormacao } from './tipo-formacao';

describe('TipoFormacao Enum', () => {
  it('deve possuir os valores numéricos corretos para cada tipo', () => {
    expect(TipoFormacao.Curso).toBe(1);
    expect(TipoFormacao.Evento).toBe(2);
    expect(TipoFormacao.Conferencia).toBe(3);
  });

  it('deve possuir os nomes corretos para o mapeamento reverso dos valores numéricos', () => {
    expect(TipoFormacao[1]).toBe('Curso');
    expect(TipoFormacao[2]).toBe('Evento');
    expect(TipoFormacao[3]).toBe('Conferencia');
  });

  it('deve conter o novo tipo Conferencia com valor 3', () => {
    expect(TipoFormacao.Conferencia).toBeDefined();
    expect(TipoFormacao.Conferencia).toBe(3);
  });

  it('deve possuir exatamente três tipos de formação', () => {
    const valores = Object.values(TipoFormacao).filter(
      (value): value is TipoFormacao => typeof value === 'number',
    );

    expect(valores).toEqual([
      TipoFormacao.Curso,
      TipoFormacao.Evento,
      TipoFormacao.Conferencia,
    ]);
    expect(valores).toHaveLength(3);
  });

  it('não deve possuir valores duplicados no enum', () => {
    const valores = Object.values(TipoFormacao).filter(
      (value): value is TipoFormacao => typeof value === 'number',
    );

    expect(new Set(valores).size).toBe(valores.length);
  });

  it('deve possuir somente as chaves esperadas', () => {
    const chaves = Object.keys(TipoFormacao).filter((key) =>
      Number.isNaN(Number(key)),
    );

    expect(chaves).toEqual(['Curso', 'Evento', 'Conferencia']);
  });
});
