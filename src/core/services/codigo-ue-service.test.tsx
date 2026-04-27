import unidadeEolService from './codigo-ue-service';

jest.mock('./api', () => ({
  __esModule: true,
  obterRegistro: jest.fn(),
}));

import { obterRegistro } from './api';

describe('unidade-eol-service', () => {
  const URL = 'v1/UnidadeEol';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call obterUePorCodigoEOL with correct URL', () => {
    unidadeEolService.obterUePorCodigoEOL('123');

    expect(obterRegistro).toHaveBeenCalledWith(`${URL}/123`);
  });

  it('should return the value from obterRegistro', async () => {
    const mockResponse = { id: '123', nome: 'UE Teste' };
    (obterRegistro as jest.Mock).mockResolvedValue(mockResponse);

    const result = await unidadeEolService.obterUePorCodigoEOL('123');

    expect(result).toEqual(mockResponse);
  });

  it('should propagate errors from obterRegistro', async () => {
    const mockError = new Error('API error');
    (obterRegistro as jest.Mock).mockRejectedValue(mockError);

    await expect(
      unidadeEolService.obterUePorCodigoEOL('123')
    ).rejects.toThrow('API error');
  });
});