import {
  SituacaoRegistro,
  SituacaoRegistroTagDisplay,
} from './situacao-registro';

describe('SituacaoRegistro', () => {
  it('deve possuir os valores numéricos corretos', () => {
    expect(SituacaoRegistro.Publicada).toBe(1);
    expect(SituacaoRegistro.Rascunho).toBe(2);
    expect(SituacaoRegistro.Cadastrada).toBe(3);
    expect(SituacaoRegistro.AguardandoAnaliseDF).toBe(4);
  });

  it('deve possuir os nomes corretos para os valores numéricos', () => {
    expect(SituacaoRegistro[1]).toBe('Publicada');
    expect(SituacaoRegistro[2]).toBe('Rascunho');
    expect(SituacaoRegistro[3]).toBe('Cadastrada');
    expect(SituacaoRegistro[4]).toBe('AguardandoAnaliseDF');
  });

  it('deve possuir exatamente quatro situações', () => {
    const valores = Object.values(SituacaoRegistro).filter(
      (value) => typeof value === 'number',
    );

    expect(valores).toEqual([
      SituacaoRegistro.Publicada,
      SituacaoRegistro.Rascunho,
      SituacaoRegistro.Cadastrada,
      SituacaoRegistro.AguardandoAnaliseDF,
    ]);

    expect(valores).toHaveLength(4);
  });
});

describe('SituacaoRegistroTagDisplay', () => {
  it('deve mapear Publicada corretamente', () => {
    expect(
      SituacaoRegistroTagDisplay[
        SituacaoRegistro.Publicada
      ],
    ).toBe('Publicada');
  });

  it('deve mapear Rascunho corretamente', () => {
    expect(
      SituacaoRegistroTagDisplay[
        SituacaoRegistro.Rascunho
      ],
    ).toBe('Rascunho');
  });

  it('deve mapear Cadastrada corretamente', () => {
    expect(
      SituacaoRegistroTagDisplay[
        SituacaoRegistro.Cadastrada
      ],
    ).toBe('Cadastrada');
  });

  it('deve mapear AguardandoAnaliseDF corretamente', () => {
    expect(
      SituacaoRegistroTagDisplay[
        SituacaoRegistro.AguardandoAnaliseDF
      ],
    ).toBe('Aguardando Análise DF');
  });

  it('deve possuir um display para todos os valores do enum', () => {
    const valoresEnum = Object.values(
      SituacaoRegistro,
    ).filter(
      (value): value is SituacaoRegistro =>
        typeof value === 'number',
    );

    valoresEnum.forEach((value) => {
      expect(
        SituacaoRegistroTagDisplay[value],
      ).toBeDefined();

      expect(
        typeof SituacaoRegistroTagDisplay[value],
      ).toBe('string');

      expect(
        SituacaoRegistroTagDisplay[value],
      ).not.toBe('');
    });
  });

  it('deve possuir exatamente quatro entradas', () => {
    expect(
      Object.keys(SituacaoRegistroTagDisplay),
    ).toHaveLength(4);
  });

  it('deve possuir o objeto esperado', () => {
    expect(SituacaoRegistroTagDisplay).toEqual({
      [SituacaoRegistro.Publicada]: 'Publicada',
      [SituacaoRegistro.Rascunho]: 'Rascunho',
      [SituacaoRegistro.Cadastrada]: 'Cadastrada',
      [SituacaoRegistro.AguardandoAnaliseDF]:
        'Aguardando Análise DF',
    });
  });
});
