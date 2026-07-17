import {
  AreaPromotoraTipoEnum,
  AreaPromotoraTipoEnumDisplay,
} from './area-promotora-tipo';

describe('AreaPromotoraTipoEnum', () => {
  it('deve possuir os valores numéricos corretos', () => {
    expect(AreaPromotoraTipoEnum.RedeDireta).toBe(1);
    expect(AreaPromotoraTipoEnum.RedeParceria).toBe(2);
  });

  it('deve possuir os nomes corretos para os valores numéricos', () => {
    expect(AreaPromotoraTipoEnum[1]).toBe('RedeDireta');
    expect(AreaPromotoraTipoEnum[2]).toBe('RedeParceria');
  });

  it('deve possuir exatamente dois tipos', () => {
    const valores = Object.values(AreaPromotoraTipoEnum).filter(
      (value) => typeof value === 'number',
    );

    expect(valores).toEqual([
      AreaPromotoraTipoEnum.RedeDireta,
      AreaPromotoraTipoEnum.RedeParceria,
    ]);

    expect(valores).toHaveLength(2);
  });
});

describe('AreaPromotoraTipoEnumDisplay', () => {
  it('deve mapear RedeDireta corretamente', () => {
    expect(
      AreaPromotoraTipoEnumDisplay[
        AreaPromotoraTipoEnum.RedeDireta
      ],
    ).toBe('Rede Direta');
  });

  it('deve mapear RedeParceria corretamente', () => {
    expect(
      AreaPromotoraTipoEnumDisplay[
        AreaPromotoraTipoEnum.RedeParceria
      ],
    ).toBe('Rede Parceria');
  });

  it('deve possuir um display para todos os valores do enum', () => {
    const valoresEnum = Object.values(
      AreaPromotoraTipoEnum,
    ).filter(
      (value): value is AreaPromotoraTipoEnum =>
        typeof value === 'number',
    );

    valoresEnum.forEach((value) => {
      expect(
        AreaPromotoraTipoEnumDisplay[value],
      ).toBeDefined();

      expect(
        typeof AreaPromotoraTipoEnumDisplay[value],
      ).toBe('string');

      expect(
        AreaPromotoraTipoEnumDisplay[value],
      ).not.toBe('');
    });
  });

  it('deve possuir exatamente duas entradas', () => {
    expect(
      Object.keys(AreaPromotoraTipoEnumDisplay),
    ).toHaveLength(2);
  });

  it('deve possuir o objeto esperado', () => {
    expect(AreaPromotoraTipoEnumDisplay).toEqual({
      [AreaPromotoraTipoEnum.RedeDireta]:
        'Rede Direta',
      [AreaPromotoraTipoEnum.RedeParceria]:
        'Rede Parceria',
    });
  });
});
