import {
  TipoCertificado,
  TipoCertificadoDescricao,
} from './tipo-certificado';

describe('TipoCertificado', () => {
  it('deve possuir os valores numéricos corretos', () => {
    expect(TipoCertificado.NaoDefinido).toBe(0);
    expect(TipoCertificado.Cursista).toBe(1);
    expect(TipoCertificado.Regente).toBe(2);
  });

  it('deve possuir os nomes corretos para os valores numéricos', () => {
    expect(TipoCertificado[0]).toBe('NaoDefinido');
    expect(TipoCertificado[1]).toBe('Cursista');
    expect(TipoCertificado[2]).toBe('Regente');
  });

  it('deve possuir exatamente três tipos', () => {
    const valores = Object.values(TipoCertificado).filter(
      (value) => typeof value === 'number',
    );

    expect(valores).toEqual([
      TipoCertificado.NaoDefinido,
      TipoCertificado.Cursista,
      TipoCertificado.Regente,
    ]);

    expect(valores).toHaveLength(3);
  });
});

describe('TipoCertificadoDescricao', () => {
  it('deve mapear NaoDefinido corretamente', () => {
    expect(
      TipoCertificadoDescricao[
        TipoCertificado.NaoDefinido
      ],
    ).toBe('Não definido');
  });

  it('deve mapear Cursista corretamente', () => {
    expect(
      TipoCertificadoDescricao[
        TipoCertificado.Cursista
      ],
    ).toBe('Cursista');
  });

  it('deve mapear Regente corretamente', () => {
    expect(
      TipoCertificadoDescricao[
        TipoCertificado.Regente
      ],
    ).toBe('Regente');
  });

  it('deve possuir uma descrição para todos os valores do enum', () => {
    const valoresEnum = Object.values(
      TipoCertificado,
    ).filter(
      (value): value is TipoCertificado =>
        typeof value === 'number',
    );

    valoresEnum.forEach((value) => {
      expect(
        TipoCertificadoDescricao[value],
      ).toBeDefined();

      expect(
        typeof TipoCertificadoDescricao[value],
      ).toBe('string');

      expect(
        TipoCertificadoDescricao[value],
      ).not.toBe('');
    });
  });

  it('deve possuir exatamente três entradas', () => {
    expect(
      Object.keys(TipoCertificadoDescricao),
    ).toHaveLength(3);
  });

  it('deve possuir o objeto esperado', () => {
    expect(TipoCertificadoDescricao).toEqual({
      [TipoCertificado.NaoDefinido]: 'Não definido',
      [TipoCertificado.Cursista]: 'Cursista',
      [TipoCertificado.Regente]: 'Regente',
    });
  });
});
