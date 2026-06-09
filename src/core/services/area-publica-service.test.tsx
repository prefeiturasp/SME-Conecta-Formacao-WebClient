import {
  obterAreaPromotoraPublico,
  obterDadosFormacao,
  obterFormacaoPaginada,
  obterFormatoPublico,
  obterPalavraChavePublico,
  obterPublicoAlvoPublico,
} from './area-publica-service'; // ajuste o caminho

jest.mock('~/core/services/api', () => ({
  __esModule: true,
  obterRegistro: jest.fn(),
}));

import { obterRegistro } from '~/core/services/api';
import { CargoFuncaoTipo } from '../enum/cargo-funcao-tipo';

describe('publico-service', () => {
  const URL = 'v1/publico';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call obterPublicoAlvoPublico with correct endpoint', () => {
    obterPublicoAlvoPublico();

    expect(obterRegistro).toHaveBeenCalledWith(
      `${URL}/cargo-funcao/tipo/${CargoFuncaoTipo.Cargo}`
    );
  });

  it('should call obterPalavraChavePublico correctly', () => {
    obterPalavraChavePublico();

    expect(obterRegistro).toHaveBeenCalledWith(
      `${URL}/palavra-chave`
    );
  });

  it('should call obterAreaPromotoraPublico correctly', () => {
    obterAreaPromotoraPublico();

    expect(obterRegistro).toHaveBeenCalledWith(
      `${URL}/area-promotora`
    );
  });

  it('should call obterFormatoPublico correctly', () => {
    obterFormatoPublico();

    expect(obterRegistro).toHaveBeenCalledWith(
      `${URL}/formato`
    );
  });

  it('should call obterFormacaoPaginada with correct params and headers', () => {
    const filtro = { nome: 'teste' } as any;

    obterFormacaoPaginada(filtro, 2, 10);

    expect(obterRegistro).toHaveBeenCalledWith(
      `${URL}/formacao-listagem`,
      {
        headers: {
          numeroPagina: 2,
          numeroRegistros: 10,
        },
        params: {
          ...filtro,
        },
      }
    );
  });

  it('should call obterFormacaoPaginada with undefined pagination when not provided', () => {
    const filtro = { nome: 'teste' } as any;

    obterFormacaoPaginada(filtro);

    expect(obterRegistro).toHaveBeenCalledWith(
      `${URL}/formacao-listagem`,
      {
        headers: {
          numeroPagina: undefined,
          numeroRegistros: undefined,
        },
        params: {
          ...filtro,
        },
      }
    );
  });

  it('should call obterDadosFormacao with correct endpoint', () => {
    obterDadosFormacao(123);

    expect(obterRegistro).toHaveBeenCalledWith(
      `${URL}/formacao-detalhada/123`
    );
  });

  it('should return resolved value from obterRegistro', async () => {
    const mockResponse = { sucesso: true, dados: [] };
    (obterRegistro as jest.Mock).mockResolvedValue(mockResponse);

    const result = await obterFormatoPublico();

    expect(result).toEqual(mockResponse);
  });

  it('should propagate errors from obterRegistro', async () => {
    const mockError = new Error('API error');
    (obterRegistro as jest.Mock).mockRejectedValue(mockError);

    await expect(obterPalavraChavePublico()).rejects.toThrow('API error');
  });
});