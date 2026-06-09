import { obterComponenteCurricular } from './componentes-curriculares-service'; // ajuste o caminho
import { obterRegistro } from './api';

jest.mock('./api', () => ({
  obterRegistro: jest.fn(),
}));

const mockObterRegistro = obterRegistro as jest.Mock;

describe('obterComponenteCurricular', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve chamar obterRegistro com os parâmetros corretos', async () => {
    mockObterRegistro.mockResolvedValueOnce({});

    const anos = [1, 2, 3];

    await obterComponenteCurricular(anos, true);

    expect(mockObterRegistro).toHaveBeenCalledWith(
      'v1/componentes-curriculares',
      {
        params: {
          exibirOpcaoTodos: true,
          anoTurmaId: anos,
        },
      }
    );
  });

  test('deve funcionar sem exibirOpcaoTodos', async () => {
    mockObterRegistro.mockResolvedValueOnce({});

    const anos = [5];

    await obterComponenteCurricular(anos);

    expect(mockObterRegistro).toHaveBeenCalledWith(
      'v1/componentes-curriculares',
      {
        params: {
          exibirOpcaoTodos: undefined,
          anoTurmaId: anos,
        },
      }
    );
  });

  test('deve retornar o resultado de obterRegistro', async () => {
    const mockResponse = {
      sucesso: true,
      dados: [{ descricao: 'Matemática' }],
    };

    mockObterRegistro.mockResolvedValueOnce(mockResponse);

    const result = await obterComponenteCurricular([1], false);

    expect(result).toEqual(mockResponse);
  });
});