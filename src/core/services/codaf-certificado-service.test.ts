import api, { obterRegistro } from './api';
import {
  downloadCertificadosLote,
  obterCertificadosCodaf,
} from './codaf-certificado-service';

jest.mock('./api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
  obterRegistro: jest.fn(),
}));

jest.mock('./codaf-service-shared', () => ({
  downloadDocumentosLote: jest.fn(),
}));

describe('codaf-certificado-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('obterCertificadosCodaf', () => {
    it('deve utilizar paginação padrão', async () => {
      (obterRegistro as jest.Mock).mockResolvedValue({});

      await obterCertificadosCodaf({});

      expect(obterRegistro).toHaveBeenCalledWith(
        'v1/CodafCertificado',
        {
          params: {
            NumeroPagina: 1,
            NumeroRegistros: 10,
          },
        }
      );
    });

    it('deve enviar todos os filtros preenchidos', async () => {
      (obterRegistro as jest.Mock).mockResolvedValue({});

      await obterCertificadosCodaf({
        NumeroPagina: 2,
        NumeroRegistros: 20,
        NumeroHomologacao: 100,
        NomeFormacao: 'Formação',
        CodigoFormacao: 10,
        CodigoCertificado: 30,
        TipoCertificado: 1,
        DocumentoCursista: '111',
        DocumentoRegente: '222',
        NomeCursista: 'João',
        DataEmissao: '01/01/2025',
        DreId: 5,
        PropostaTurmaId: 8,
      });

      expect(obterRegistro).toHaveBeenCalledWith(
        'v1/CodafCertificado',
        {
          params: {
            NumeroPagina: 2,
            NumeroRegistros: 20,
            NumeroHomologacao: 100,
            NomeFormacao: 'Formação',
            CodigoFormacao: 10,
            CodigoCertificado: 30,
            TipoCertificado: 1,
            DocumentoCursista: '111',
            DocumentoRegente: '222',
            NomeCursista: 'João',
            DataEmissao: '01/01/2025',
            DreId: 5,
            PropostaTurmaId: 8,
          },
        }
      );
    });

    it('deve enviar TipoCertificado igual a zero', async () => {
      (obterRegistro as jest.Mock).mockResolvedValue({});

      await obterCertificadosCodaf({
        TipoCertificado: 0,
      });

      expect(obterRegistro).toHaveBeenCalledWith(
        'v1/CodafCertificado',
        {
          params: {
            NumeroPagina: 1,
            NumeroRegistros: 10,
            TipoCertificado: 0,
          },
        }
      );
    });

    it('não deve enviar filtros nulos', async () => {
      (obterRegistro as jest.Mock).mockResolvedValue({});

      await obterCertificadosCodaf({
        NumeroHomologacao: null,
        NomeFormacao: null,
        CodigoFormacao: null,
        CodigoCertificado: null,
        TipoCertificado: null,
        DocumentoCursista: null,
        DocumentoRegente: null,
        NomeCursista: null,
        DataEmissao: null,
        DreId: null,
        PropostaTurmaId: null,
      });

      expect(obterRegistro).toHaveBeenCalledWith(
        'v1/CodafCertificado',
        {
          params: {
            NumeroPagina: 1,
            NumeroRegistros: 10,
          },
        }
      );
    });
  });

  describe('downloadCertificadosLote', () => {
    it('deve chamar downloadDocumentosLote com parametros corretos', async () => {
      const { downloadDocumentosLote } = require('./codaf-service-shared');
      (downloadDocumentosLote as jest.Mock).mockResolvedValue({ sucesso: true, blob: new Blob() });

      const resultado = await downloadCertificadosLote([1, 2]);

      expect(downloadDocumentosLote).toHaveBeenCalledWith(
        'v1/CodafCertificado/download-lote',
        [1, 2],
        'Erro ao baixar os certificados.'
      );
      expect(resultado.sucesso).toBe(true);
    });
  });
});