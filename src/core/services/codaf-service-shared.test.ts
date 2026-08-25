import api from './api';
import { downloadDocumentosLote } from './codaf-service-shared';

jest.mock('./api', () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));

const postMock = api.post as jest.Mock;

describe('codaf-service-shared', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('downloadDocumentosLote', () => {
    it('retorna o blob ao baixar em lote', async () => {
      const blob = new Blob(['arquivo zip']);
      postMock.mockResolvedValue({ data: blob });

      const resultado = await downloadDocumentosLote('v1/Mock/download-lote', [1, 2], 'Erro mock');

      expect(postMock).toHaveBeenCalledWith('v1/Mock/download-lote', [1, 2], {
        responseType: 'blob',
      });
      expect(resultado).toEqual({ sucesso: true, blob });
    });

    it('retorna as mensagens de erro presentes no blob da API', async () => {
      const blobErro = { text: jest.fn().mockResolvedValue('{"mensagensErro":["Erro na API"]}') };
      postMock.mockRejectedValue({ response: { data: blobErro } });

      const resultado = await downloadDocumentosLote('v1/Mock/download-lote', [1], 'Erro mock');

      expect(resultado).toEqual({
        sucesso: false,
        mensagensErro: ['Erro na API'],
      });
    });

    it('retorna mensagem padrão quando o erro não contém JSON válido', async () => {
      const blobErro = { text: jest.fn().mockResolvedValue('erro inesperado') };
      postMock.mockRejectedValue({ response: { data: blobErro } });

      const resultado = await downloadDocumentosLote('v1/Mock/download-lote', [1], 'Erro mock');

      expect(resultado).toEqual({
        sucesso: false,
        mensagensErro: ['Erro mock'],
      });
    });
  });
});
