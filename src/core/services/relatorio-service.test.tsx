import {
  gerarRelatorioInscritosPorFormacao,
  RelatorioInscritosPorFormacaoFiltrosDTO,
} from './relatorio-service';

jest.mock('~/core/services/api', () => ({
  inserirRegistro: jest.fn(),
}));

import { inserirRegistro } from '~/core/services/api';

describe('relatorio-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('gerarRelatorioInscritosPorFormacao', () => {
    it('calls inserirRegistro with correct URL', () => {
      const params: RelatorioInscritosPorFormacaoFiltrosDTO = { propostaId: 1 };
      gerarRelatorioInscritosPorFormacao(params);
      expect(inserirRegistro).toHaveBeenCalledWith('v1/relatorio/inscritos-por-formacao', params);
    });

    it('passes full params to inserirRegistro', () => {
      const params: RelatorioInscritosPorFormacaoFiltrosDTO = {
        propostaId: 10,
        nomeFormacao: 'Formação Teste',
        formato: 1,
        dreId: 5,
        documentoCursista: '12345678900',
      };
      gerarRelatorioInscritosPorFormacao(params);
      expect(inserirRegistro).toHaveBeenCalledWith('v1/relatorio/inscritos-por-formacao', params);
    });

    it('passes empty params object', () => {
      gerarRelatorioInscritosPorFormacao({});
      expect(inserirRegistro).toHaveBeenCalledWith('v1/relatorio/inscritos-por-formacao', {});
    });

    it('returns the result of inserirRegistro', () => {
      const mockResult = Promise.resolve({ sucesso: true, dados: {} });
      (inserirRegistro as jest.Mock).mockReturnValue(mockResult);
      const result = gerarRelatorioInscritosPorFormacao({});
      expect(result).toBe(mockResult);
    });

    it('calls inserirRegistro once per invocation', () => {
      gerarRelatorioInscritosPorFormacao({ propostaId: 1 });
      gerarRelatorioInscritosPorFormacao({ propostaId: 2 });
      expect(inserirRegistro).toHaveBeenCalledTimes(2);
    });
  });
});
