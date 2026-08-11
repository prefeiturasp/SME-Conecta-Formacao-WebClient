import { montarParametrosFiltroCodaf, CodafListagemFiltroBaseDTO } from './codaf-service-shared';

describe('montarParametrosFiltroCodaf', () => {
  it('deve usar paginação padrão quando nenhum filtro é passado', () => {
    const resultado = montarParametrosFiltroCodaf({});

    expect(resultado).toEqual({
      NumeroPagina: 1,
      NumeroRegistros: 10,
    });
  });

  it('deve incluir todos os filtros preenchidos', () => {
    const filtros: CodafListagemFiltroBaseDTO = {
      NumeroPagina: 2,
      NumeroRegistros: 20,
      NomeFormacao: 'Formação X',
      CodigoFormacao: 100,
      NumeroHomologacao: 200,
      PropostaTurmaId: 300,
      AreaPromotoraId: 400,
      Status: 1,
    };

    const resultado = montarParametrosFiltroCodaf(filtros);

    expect(resultado).toMatchObject({
      NumeroPagina: 2,
      NumeroRegistros: 20,
      NomeFormacao: 'Formação X',
      CodigoFormacao: 100,
      NumeroHomologacao: 200,
      PropostaTurmaId: 300,
      AreaPromotoraId: 400,
      Status: 1,
    });
  });

  it('deve incluir Status 0 (não deve ser ignorado)', () => {
    const resultado = montarParametrosFiltroCodaf({ Status: 0 });
    expect(resultado).toHaveProperty('Status', 0);
  });

  it('não deve incluir Status null', () => {
    const resultado = montarParametrosFiltroCodaf({ Status: null });
    expect(resultado).not.toHaveProperty('Status');
  });

  describe('com incluirDataEnvioDf = true', () => {
    it('deve incluir DataEnvioDf quando presente', () => {
      const filtros: CodafListagemFiltroBaseDTO = { DataEnvioDf: '2026-08-10' };
      const resultado = montarParametrosFiltroCodaf(filtros, true);
      expect(resultado).toHaveProperty('DataEnvioDf', '2026-08-10');
    });

    it('não deve incluir DataEnvioDf quando false', () => {
      const filtros: CodafListagemFiltroBaseDTO = { DataEnvioDf: '2026-08-10' };
      const resultado = montarParametrosFiltroCodaf(filtros, false);
      expect(resultado).not.toHaveProperty('DataEnvioDf');
    });

    it('não deve incluir DataEnvioDf quando nulo mesmo com flag true', () => {
      const filtros: CodafListagemFiltroBaseDTO = { DataEnvioDf: null };
      const resultado = montarParametrosFiltroCodaf(filtros, true);
      expect(resultado).not.toHaveProperty('DataEnvioDf');
    });
  });

  describe('com incluirDataFinalizacao = true (módulo não homologado)', () => {
    it('deve incluir DataFinalizacao quando presente', () => {
      const filtros: CodafListagemFiltroBaseDTO = { DataFinalizacao: '2026-08-15' };
      const resultado = montarParametrosFiltroCodaf(filtros, false, true);
      expect(resultado).toHaveProperty('DataFinalizacao', '2026-08-15');
    });

    it('não deve incluir DataFinalizacao quando flag está false', () => {
      const filtros: CodafListagemFiltroBaseDTO = { DataFinalizacao: '2026-08-15' };
      const resultado = montarParametrosFiltroCodaf(filtros, false, false);
      expect(resultado).not.toHaveProperty('DataFinalizacao');
    });

    it('não deve incluir DataFinalizacao quando nulo mesmo com flag true', () => {
      const filtros: CodafListagemFiltroBaseDTO = { DataFinalizacao: null };
      const resultado = montarParametrosFiltroCodaf(filtros, false, true);
      expect(resultado).not.toHaveProperty('DataFinalizacao');
    });
  });

  it('não deve incluir campos undefined', () => {
    const filtros: CodafListagemFiltroBaseDTO = {
      NomeFormacao: undefined,
      CodigoFormacao: undefined,
    };
    const resultado = montarParametrosFiltroCodaf(filtros);
    expect(resultado).not.toHaveProperty('NomeFormacao');
    expect(resultado).not.toHaveProperty('CodigoFormacao');
  });
});
