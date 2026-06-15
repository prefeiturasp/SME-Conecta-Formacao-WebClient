import { obterRegistro } from './api';
import { obterAnoEtapa, URL_ANO_ETAPA } from './ano-etapa-service';

jest.mock('./api', () => ({
  obterRegistro: jest.fn(),
}));

describe('ano-etapa-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar obterRegistro com os parâmetros informados', async () => {
    (obterRegistro as jest.Mock).mockResolvedValue({});

    await obterAnoEtapa(2025, 3, true);

    expect(obterRegistro).toHaveBeenCalledWith(
      URL_ANO_ETAPA,
      {
        params: {
          AnoLetivo: 2025,
          Modalidade: 3,
          ExibirOpcaoTodos: true,
        },
      }
    );
  });

  it('deve enviar ExibirOpcaoTodos undefined quando não informado', async () => {
    (obterRegistro as jest.Mock).mockResolvedValue({});

    await obterAnoEtapa(2024, 2);

    expect(obterRegistro).toHaveBeenCalledWith(
      URL_ANO_ETAPA,
      {
        params: {
          AnoLetivo: 2024,
          Modalidade: 2,
          ExibirOpcaoTodos: undefined,
        },
      }
    );
  });

  it('deve retornar o resultado de obterRegistro', async () => {
    const retorno = {
      sucesso: true,
      dados: [],
    };

    (obterRegistro as jest.Mock).mockResolvedValue(retorno);

    const resultado = await obterAnoEtapa(2025, 1, false);

    expect(resultado).toBe(retorno);
  });
});