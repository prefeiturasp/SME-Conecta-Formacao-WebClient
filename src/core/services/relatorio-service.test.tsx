import {
  gerarRelatorioInscritosPorFormacao,
  RelatorioInscritosPorFormacaoFiltrosDTO,
  obterRelatorioLaudaCompletaDocx,
} from './relatorio-service';

jest.mock('~/core/services/api', () => ({
  inserirRegistro: jest.fn(),
  obterRegistro: jest.fn(),
}));

import { inserirRegistro, obterRegistro } from '~/core/services/api';

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

  describe('obterRelatorioLaudaCompletaDocx', () => {
    it('calls obterRegistro with correct URL and responseType', () => {
      const propostaId = 123;
      obterRelatorioLaudaCompletaDocx(propostaId);
      expect(obterRegistro).toHaveBeenCalledWith(
        `v1/relatorio/propostas/${propostaId}/lauda-completa/docx`,
        { responseType: 'blob' }
      );
    });

    it('returns the result of obterRegistro', () => {
      const mockResult = Promise.resolve({ sucesso: true, dados: new Blob() });
      (obterRegistro as jest.Mock).mockReturnValue(mockResult);
      const result = obterRelatorioLaudaCompletaDocx(123);
      expect(result).toBe(mockResult);
    });
  });
});
