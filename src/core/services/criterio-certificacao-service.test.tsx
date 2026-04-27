import { obterCriterioCertificacao, URL_API_PALAVRA_CHAVE } from './criterio-certificacao-service'; // ajuste o caminho
import { obterRegistro } from './api';

jest.mock('./api', () => ({
  obterRegistro: jest.fn(),
}));

const mockObterRegistro = obterRegistro as jest.Mock;

describe('obterCriterioCertificacao', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve chamar obterRegistro com a URL correta', async () => {
    mockObterRegistro.mockResolvedValueOnce({});

    await obterCriterioCertificacao();

    expect(mockObterRegistro).toHaveBeenCalledWith(
      URL_API_PALAVRA_CHAVE
    );
  });

  test('deve retornar o resultado de obterRegistro', async () => {
    const mockResponse = {
      sucesso: true,
      dados: [{ descricao: 'Critério A' }],
      mensagens: [],
      status: 200,
    };

    mockObterRegistro.mockResolvedValueOnce(mockResponse);

    const result = await obterCriterioCertificacao();

    expect(result).toEqual(mockResponse);
  });

  test('deve chamar apenas uma vez', async () => {
    mockObterRegistro.mockResolvedValueOnce({});

    await obterCriterioCertificacao();

    expect(mockObterRegistro).toHaveBeenCalledTimes(1);
  });
});