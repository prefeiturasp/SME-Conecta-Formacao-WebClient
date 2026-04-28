import { autocompletarUe, carregarUesPorDre } from './ue-service';

jest.mock('./api', () => ({
  __esModule: true,
  obterRegistro: jest.fn(),
}));

import { obterRegistro } from './api';

describe('ue-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('autocompletarUe', () => {
    it('should call obterRegistro with correct params when dreId is provided', () => {
      autocompletarUe('teste', 123);

      expect(obterRegistro).toHaveBeenCalledWith('ue/autocompletar-nome', {
        params: {
          termoBusca: 'teste',
          dreId: 123,
          numeroPagina: 1,
          numeroRegistros: 99999999,
        },
      });
    });

    it('should call obterRegistro with dreId undefined when not provided', () => {
      autocompletarUe('teste');

      expect(obterRegistro).toHaveBeenCalledWith('ue/autocompletar-nome', {
        params: {
          termoBusca: 'teste',
          dreId: undefined,
          numeroPagina: 1,
          numeroRegistros: 99999999,
        },
      });
    });
  });

  describe('carregarUesPorDre', () => {
    it('should call obterRegistro with correct params', () => {
      carregarUesPorDre(456);

      expect(obterRegistro).toHaveBeenCalledWith('v1/Ue/autocompletar-nome', {
        params: {
          DreId: 456,
          NumeroPagina: 1,
          NumeroRegistros: 99999,
        },
      });
    });
  });
});