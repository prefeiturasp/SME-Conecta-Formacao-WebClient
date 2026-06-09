import usuarioRedeParceriaService from './usuario-rede-parceria';

jest.mock('./api', () => ({
  __esModule: true,
  obterRegistro: jest.fn(),
  inserirRegistro: jest.fn(),
  alterarRegistro: jest.fn(),
  deletarRegistro: jest.fn(),
}));

import {
  obterRegistro,
  inserirRegistro,
  alterarRegistro,
  deletarRegistro,
} from './api';

describe('usuarioRedeParceriaService', () => {
  const URL = 'v1/UsuarioRedeParceria';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call obterUsuarioRedeParceriaSituacao correctly', () => {
    usuarioRedeParceriaService.obterUsuarioRedeParceriaSituacao();

    expect(obterRegistro).toHaveBeenCalledWith(`${URL}/situacao`);
  });

  it('should call obterUsuarioRedeParceria and return URL', () => {
    const result = usuarioRedeParceriaService.obterUsuarioRedeParceria();

    expect(obterRegistro).toHaveBeenCalledWith(URL);
    expect(result).toBe(URL);
  });

  it('should call inserirUsuarioRedeParceria correctly', () => {
    const params = { nome: 'teste' } as any;

    usuarioRedeParceriaService.inserirUsuarioRedeParceria(params);

    expect(inserirRegistro).toHaveBeenCalledWith(URL, params);
  });

  it('should call obterUsuarioRedeParceriaId correctly', () => {
    usuarioRedeParceriaService.obterUsuarioRedeParceriaId(1);

    expect(obterRegistro).toHaveBeenCalledWith(`${URL}/1`);
  });

  it('should call alterarUsuarioRedeParceria correctly', () => {
    const params = { nome: 'teste' } as any;

    usuarioRedeParceriaService.alterarUsuarioRedeParceria(1, params);

    expect(alterarRegistro).toHaveBeenCalledWith(`${URL}/1`, params);
  });

  it('should call excluirUsuarioRedeParceria correctly', () => {
    usuarioRedeParceriaService.excluirUsuarioRedeParceria(1);

    expect(deletarRegistro).toHaveBeenCalledWith(`${URL}/1`);
  });
});