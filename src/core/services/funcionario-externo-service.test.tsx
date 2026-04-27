import funcionarioExternoService from './funcionario-externo-service';
import { obterRegistro } from './api';

jest.mock('./api', () => ({
  obterRegistro: jest.fn(),
}));

const mockObterRegistro = obterRegistro as jest.Mock;

describe('funcionarioExternoService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve chamar obterRegistro com a URL correta contendo o CPF', async () => {
    mockObterRegistro.mockResolvedValueOnce({});

    const cpf = '12345678900';

    await funcionarioExternoService.obterFuncionarioExterno(cpf);

    expect(mockObterRegistro).toHaveBeenCalledWith(
      `v1/FuncionarioExterno/${cpf}`
    );
  });

  test('deve retornar o resultado de obterRegistro', async () => {
    const mockResponse = {
      sucesso: true,
      dados: { nome: 'João' },
      mensagens: [],
      status: 200,
    };

    mockObterRegistro.mockResolvedValueOnce(mockResponse);

    const result =
      await funcionarioExternoService.obterFuncionarioExterno('123');

    expect(result).toEqual(mockResponse);
  });

  test('deve chamar obterRegistro apenas uma vez', async () => {
    mockObterRegistro.mockResolvedValueOnce({});

    await funcionarioExternoService.obterFuncionarioExterno('999');

    expect(mockObterRegistro).toHaveBeenCalledTimes(1);
  });
});