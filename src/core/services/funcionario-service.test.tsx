import { obterPareceristas, obterUsuariosAdminDf } from './funcionario-service';

jest.mock('./api', () => ({
  __esModule: true,
  obterRegistro: jest.fn(),
}));

import { obterRegistro } from './api';

describe('funcionario-service', () => {
  const URL = 'v1/Funcionario';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call obterUsuariosAdminDf with correct endpoint', () => {
    obterUsuariosAdminDf();

    expect(obterRegistro).toHaveBeenCalledWith(
      `${URL}/obter-usuarios-admin-df`
    );
  });

  it('should call obterPareceristas with correct endpoint', () => {
    obterPareceristas();

    expect(obterRegistro).toHaveBeenCalledWith(
      `${URL}/obter-parecerista`
    );
  });

  it('should return the value from obterRegistro (promise behavior)', async () => {
    const mockResponse = { sucesso: true, dados: [] };
    (obterRegistro as jest.Mock).mockResolvedValue(mockResponse);

    const result = await obterPareceristas();

    expect(result).toEqual(mockResponse);
  });
});