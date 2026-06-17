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
    it('deve baixar certificados com sucesso', async () => {
      const blob = new Blob(['arquivo']);

      (api.post as jest.Mock).mockResolvedValue({
        data: blob,
      });

      const resultado = await downloadCertificadosLote([1, 2]);

      expect(api.post).toHaveBeenCalledWith(
        'v1/CodafCertificado/download-lote',
        [1, 2],
        {
          responseType: 'blob',
        }
      );

      expect(resultado).toEqual({
        sucesso: true,
        blob,
      });
    });

    it('deve retornar mensagens de erro vindas da api', async () => {
      const blob = new Blob(
        [
          JSON.stringify({
            mensagensErro: ['Erro 1', 'Erro 2'],
          }),
        ],
        { type: 'application/json' }
      );

      (api.post as jest.Mock).mockRejectedValue({
        response: {
          data: blob,
        },
      });

      const resultado = await downloadCertificadosLote([1]);

      expect(resultado).toEqual({
        sucesso: false,
        mensagensErro: ['Erro 1', 'Erro 2'],
      });
    });

    it('deve retornar erro padrão quando blob não for json', async () => {
      const blob = new Blob(['texto inválido']);

      (api.post as jest.Mock).mockRejectedValue({
        response: {
          data: blob,
        },
      });

      const resultado = await downloadCertificadosLote([1]);

      expect(resultado).toEqual({
        sucesso: false,
        mensagensErro: ['Erro ao baixar os certificados.'],
      });
    });

    it('deve retornar erro padrão quando não existir response', async () => {
      (api.post as jest.Mock).mockRejectedValue({});

      const resultado = await downloadCertificadosLote([1]);

      expect(resultado).toEqual({
        sucesso: false,
        mensagensErro: ['Erro ao baixar os certificados.'],
      });
    });
  });
});