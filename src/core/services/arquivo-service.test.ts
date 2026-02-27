import arquivoService from './arquivo-service';

jest.mock('./api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
  inserirRegistro: jest.fn(),
}));

import api, { inserirRegistro } from './api';

const mockApiGet = api.get as jest.MockedFunction<typeof api.get>;
const mockInserirRegistro = inserirRegistro as jest.MockedFunction<typeof inserirRegistro>;

describe('ArquivoService', () => {
  const URL_DEFAULT = 'v1/Arquivo';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fazerUploadArquivo', () => {
    test('deve fazer upload de arquivo com sucesso', async () => {
      const formData = new FormData();
      formData.append('arquivo', new Blob(['conteúdo do arquivo']), 'teste.pdf');

      const configuracaoHeader = {
        headers: { 'content-type': 'multipart/form-data' },
      };

      const mockResponse = {
        sucesso: true,
        dados: {
          codigo: 'ABC123',
          nome: 'teste.pdf',
        },
        mensagens: [],
        status: 201,
      };

      mockInserirRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await arquivoService.fazerUploadArquivo(formData, configuracaoHeader);

      expect(mockInserirRegistro).toHaveBeenCalledWith(URL_DEFAULT, formData, configuracaoHeader);
      expect(result).toEqual(mockResponse);
    });

    test('deve fazer upload com diferentes configurações de header', async () => {
      const formData = new FormData();
      formData.append('arquivo', new Blob(['outro arquivo']), 'documento.docx');

      const configuracaoHeader = {
        headers: {
          'content-type': 'multipart/form-data',
          'x-custom-header': 'valor-customizado',
        },
      };

      const mockResponse = {
        sucesso: true,
        dados: { codigo: 'XYZ789' },
        mensagens: [],
        status: 201,
      };

      mockInserirRegistro.mockResolvedValueOnce(mockResponse as any);

      await arquivoService.fazerUploadArquivo(formData, configuracaoHeader);

      expect(mockInserirRegistro).toHaveBeenCalledWith(URL_DEFAULT, formData, configuracaoHeader);
    });

    test('deve lidar com erro ao fazer upload', async () => {
      const formData = new FormData();
      const configuracaoHeader = {
        headers: { 'content-type': 'multipart/form-data' },
      };

      const mockError = {
        sucesso: false,
        dados: null,
        mensagens: ['Erro ao fazer upload do arquivo'],
        status: 500,
      };

      mockInserirRegistro.mockResolvedValueOnce(mockError as any);

      const result = await arquivoService.fazerUploadArquivo(formData, configuracaoHeader);

      expect(result.sucesso).toBe(false);
      expect(result.mensagens).toContain('Erro ao fazer upload do arquivo');
    });

    test('deve fazer upload de arquivo vazio', async () => {
      const formData = new FormData();
      formData.append('arquivo', new Blob([]), 'vazio.txt');

      const configuracaoHeader = {
        headers: { 'content-type': 'multipart/form-data' },
      };

      const mockResponse = {
        sucesso: true,
        dados: { codigo: 'EMPTY123' },
        mensagens: [],
        status: 201,
      };

      mockInserirRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await arquivoService.fazerUploadArquivo(formData, configuracaoHeader);

      expect(result.sucesso).toBe(true);
    });
  });

  describe('obterArquivoParaDownload', () => {
    test('deve obter arquivo para download com sucesso', async () => {
      const codigoArquivo = 'ABC123';
      const mockArrayBuffer = new ArrayBuffer(8);
      const mockResponse = {
        data: mockArrayBuffer,
        status: 200,
        headers: {
          'content-type': 'application/pdf',
        },
      };

      mockApiGet.mockResolvedValueOnce(mockResponse as any);

      const result = await arquivoService.obterArquivoParaDownload(codigoArquivo);

      expect(mockApiGet).toHaveBeenCalledWith(`${URL_DEFAULT}/${codigoArquivo}`, {
        responseType: 'arraybuffer',
      });
      expect(result.data).toEqual(mockArrayBuffer);
      expect(result.status).toBe(200);
    });

    test('deve obter arquivo com diferentes códigos', async () => {
      const codigoArquivo = 'XYZ789';
      const mockArrayBuffer = new ArrayBuffer(16);
      const mockResponse = {
        data: mockArrayBuffer,
        status: 200,
      };

      mockApiGet.mockResolvedValueOnce(mockResponse as any);

      await arquivoService.obterArquivoParaDownload(codigoArquivo);

      expect(mockApiGet).toHaveBeenCalledWith(`${URL_DEFAULT}/${codigoArquivo}`, {
        responseType: 'arraybuffer',
      });
    });

    test('deve lidar com erro ao obter arquivo inexistente', async () => {
      const codigoArquivo = 'INVALIDO';
      const mockError = {
        response: {
          status: 404,
          data: 'Arquivo não encontrado',
        },
      };

      mockApiGet.mockRejectedValueOnce(mockError);

      await expect(arquivoService.obterArquivoParaDownload(codigoArquivo)).rejects.toEqual(
        mockError,
      );

      expect(mockApiGet).toHaveBeenCalledWith(`${URL_DEFAULT}/${codigoArquivo}`, {
        responseType: 'arraybuffer',
      });
    });

    test('deve obter arquivo de diferentes tipos', async () => {
      const codigoArquivo = 'IMG456';
      const mockArrayBuffer = new ArrayBuffer(1024);
      const mockResponse = {
        data: mockArrayBuffer,
        status: 200,
        headers: {
          'content-type': 'image/png',
        },
      };

      mockApiGet.mockResolvedValueOnce(mockResponse as any);

      const result = await arquivoService.obterArquivoParaDownload(codigoArquivo);

      expect(result.data).toEqual(mockArrayBuffer);
      expect(result.headers['content-type']).toBe('image/png');
    });

    test('deve configurar responseType como arraybuffer', async () => {
      const codigoArquivo = 'DOC789';
      const mockResponse = {
        data: new ArrayBuffer(0),
        status: 200,
      };

      mockApiGet.mockResolvedValueOnce(mockResponse as any);

      await arquivoService.obterArquivoParaDownload(codigoArquivo);

      expect(mockApiGet).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          responseType: 'arraybuffer',
        }),
      );
    });
  });

  describe('Integração entre métodos', () => {
    test('deve fazer upload e depois download do mesmo arquivo', async () => {
      const formData = new FormData();
      formData.append('arquivo', new Blob(['dados de teste']), 'arquivo-teste.txt');

      const configuracaoHeader = {
        headers: { 'content-type': 'multipart/form-data' },
      };

      const mockResponseUpload = {
        sucesso: true,
        dados: {
          codigo: 'UPLOAD123',
          nome: 'arquivo-teste.txt',
        },
        mensagens: [],
        status: 201,
      };

      mockInserirRegistro.mockResolvedValueOnce(mockResponseUpload as any);

      const resultUpload = await arquivoService.fazerUploadArquivo(formData, configuracaoHeader);

      expect(resultUpload.sucesso).toBe(true);
      expect(resultUpload.dados?.codigo).toBe('UPLOAD123');

      const mockResponseDownload = {
        data: new ArrayBuffer(8),
        status: 200,
      };

      mockApiGet.mockResolvedValueOnce(mockResponseDownload as any);

      const resultDownload = await arquivoService.obterArquivoParaDownload(
        resultUpload.dados!.codigo,
      );

      expect(mockApiGet).toHaveBeenCalledWith(`${URL_DEFAULT}/UPLOAD123`, {
        responseType: 'arraybuffer',
      });
      expect(resultDownload.status).toBe(200);
    });

    test('deve lidar com múltiplos uploads sequenciais', async () => {
      const arquivo1 = new FormData();
      arquivo1.append('arquivo', new Blob(['arquivo 1']), 'arquivo1.txt');

      const arquivo2 = new FormData();
      arquivo2.append('arquivo', new Blob(['arquivo 2']), 'arquivo2.txt');

      const configuracao = {
        headers: { 'content-type': 'multipart/form-data' },
      };

      mockInserirRegistro
        .mockResolvedValueOnce({
          sucesso: true,
          dados: { codigo: 'ARQ1' },
          mensagens: [],
          status: 201,
        } as any)
        .mockResolvedValueOnce({
          sucesso: true,
          dados: { codigo: 'ARQ2' },
          mensagens: [],
          status: 201,
        } as any);

      const result1 = await arquivoService.fazerUploadArquivo(arquivo1, configuracao);
      const result2 = await arquivoService.fazerUploadArquivo(arquivo2, configuracao);

      expect(result1.dados?.codigo).toBe('ARQ1');
      expect(result2.dados?.codigo).toBe('ARQ2');
      expect(mockInserirRegistro).toHaveBeenCalledTimes(2);
    });
  });
});
