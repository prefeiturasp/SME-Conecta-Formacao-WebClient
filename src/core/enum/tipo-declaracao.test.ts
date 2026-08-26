import {
  TipoDeclaracao,
  TipoDeclaracaoDescricao,
} from './tipo-declaracao';

describe('TipoDeclaracao', () => {
  it('deve possuir os valores numéricos corretos', () => {
    expect(TipoDeclaracao.NaoDefinido).toBe(0);
    expect(TipoDeclaracao.Cursista).toBe(1);
    expect(TipoDeclaracao.Regente).toBe(2);
  });

  it('deve possuir os nomes corretos para os valores numéricos', () => {
    expect(TipoDeclaracao[0]).toBe('NaoDefinido');
    expect(TipoDeclaracao[1]).toBe('Cursista');
    expect(TipoDeclaracao[2]).toBe('Regente');
  });

  it('deve possuir exatamente três tipos', () => {
    const valores = Object.values(TipoDeclaracao).filter(
      (value) => typeof value === 'number',
    );

    expect(valores).toEqual([
      TipoDeclaracao.NaoDefinido,
      TipoDeclaracao.Cursista,
      TipoDeclaracao.Regente,
    ]);

    expect(valores).toHaveLength(3);
  });
});

describe('TipoDeclaracaoDescricao', () => {
  it('deve mapear NaoDefinido corretamente', () => {
    expect(
      TipoDeclaracaoDescricao[
        TipoDeclaracao.NaoDefinido
      ],
    ).toBe('Não definido');
  });

  it('deve mapear Cursista corretamente', () => {
    expect(
      TipoDeclaracaoDescricao[
        TipoDeclaracao.Cursista
      ],
    ).toBe('Cursista');
  });

  it('deve mapear Regente corretamente', () => {
    expect(
      TipoDeclaracaoDescricao[
        TipoDeclaracao.Regente
      ],
    ).toBe('Regente');
  });

  it('deve possuir uma descrição para todos os valores do enum', () => {
    const valoresEnum = Object.values(
      TipoDeclaracao,
    ).filter(
      (value): value is TipoDeclaracao =>
        typeof value === 'number',
    );

    valoresEnum.forEach((value) => {
      expect(
        TipoDeclaracaoDescricao[value],
      ).toBeDefined();

      expect(
        typeof TipoDeclaracaoDescricao[value],
      ).toBe('string');

      expect(
        TipoDeclaracaoDescricao[value],
      ).not.toBe('');
    });
  });

  it('deve possuir exatamente três entradas', () => {
    expect(
      Object.keys(TipoDeclaracaoDescricao),
    ).toHaveLength(3);
  });

  it('deve possuir o objeto esperado', () => {
    expect(TipoDeclaracaoDescricao).toEqual({
      [TipoDeclaracao.NaoDefinido]: 'Não definido',
      [TipoDeclaracao.Cursista]: 'Cursista',
      [TipoDeclaracao.Regente]: 'Regente',
    });
  });
});
