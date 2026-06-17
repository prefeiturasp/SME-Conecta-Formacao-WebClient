import {
  alterarRegistro,
  deletarRegistro,
  inserirRegistro,
  obterRegistro,
} from './api';

import {
  URL_API_COORDENADORIA,
  atualizarCoordenadoria,
  criarCoordenadoria,
  excluirCoordenadoria,
  listarCoordenadorias,
  obterCoordenadoriaPorId,
} from './coordenadoria-service';

jest.mock('./api', () => ({
  inserirRegistro: jest.fn(),
  alterarRegistro: jest.fn(),
  obterRegistro: jest.fn(),
  deletarRegistro: jest.fn(),
}));

describe('coordenadoria-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('criarCoordenadoria', () => {
    it('deve chamar inserirRegistro', async () => {
      const dto = {
        id: 1,
        nome: 'Coordenadoria',
        sigla: 'COD',
      };

      (inserirRegistro as jest.Mock).mockResolvedValue({});

      await criarCoordenadoria(dto);

      expect(inserirRegistro).toHaveBeenCalledWith(
        URL_API_COORDENADORIA,
        dto
      );
    });
  });

  describe('atualizarCoordenadoria', () => {
    it('deve chamar alterarRegistro', async () => {
      const dto = {
        id: 1,
        nome: 'Nova',
        sigla: 'NV',
      };

      (alterarRegistro as jest.Mock).mockResolvedValue({});

      await atualizarCoordenadoria(10, dto);

      expect(alterarRegistro).toHaveBeenCalledWith(
        `${URL_API_COORDENADORIA}/10`,
        dto
      );
    });
  });

  describe('obterCoordenadoriaPorId', () => {
    it('deve chamar obterRegistro', async () => {
      (obterRegistro as jest.Mock).mockResolvedValue({});

      await obterCoordenadoriaPorId(5);

      expect(obterRegistro).toHaveBeenCalledWith(
        `${URL_API_COORDENADORIA}/5`
      );
    });
  });

  describe('excluirCoordenadoria', () => {
    it('deve chamar deletarRegistro', async () => {
      (deletarRegistro as jest.Mock).mockResolvedValue({});

      await excluirCoordenadoria(3);

      expect(deletarRegistro).toHaveBeenCalledWith(
        `${URL_API_COORDENADORIA}/3`
      );
    });
  });

  describe('listarCoordenadorias', () => {
    it('deve listar sem filtros', async () => {
      (obterRegistro as jest.Mock).mockResolvedValue({});

      await listarCoordenadorias({});

      expect(obterRegistro).toHaveBeenCalledWith(
        `${URL_API_COORDENADORIA}?`
      );
    });

    it('deve listar apenas com nome', async () => {
      (obterRegistro as jest.Mock).mockResolvedValue({});

      await listarCoordenadorias({
        nome: 'Teste',
      });

      expect(obterRegistro).toHaveBeenCalledWith(
        `${URL_API_COORDENADORIA}?nome=Teste`
      );
    });

    it('deve listar apenas com sigla', async () => {
      (obterRegistro as jest.Mock).mockResolvedValue({});

      await listarCoordenadorias({
        sigla: 'COD',
      });

      expect(obterRegistro).toHaveBeenCalledWith(
        `${URL_API_COORDENADORIA}?sigla=COD`
      );
    });

    it('deve listar apenas com paginação', async () => {
      (obterRegistro as jest.Mock).mockResolvedValue({});

      await listarCoordenadorias({
        numeroPagina: 2,
        numeroRegistros: 20,
      });

      expect(obterRegistro).toHaveBeenCalledWith(
        `${URL_API_COORDENADORIA}?numeroPagina=2&numeroRegistros=20`
      );
    });

    it('deve listar com todos os filtros', async () => {
      (obterRegistro as jest.Mock).mockResolvedValue({});

      await listarCoordenadorias({
        nome: 'Coordenadoria',
        sigla: 'COD',
        numeroPagina: 3,
        numeroRegistros: 50,
      });

      expect(obterRegistro).toHaveBeenCalledWith(
        `${URL_API_COORDENADORIA}?nome=Coordenadoria&sigla=COD&numeroPagina=3&numeroRegistros=50`
      );
    });

    it('não deve adicionar filtros vazios', async () => {
      (obterRegistro as jest.Mock).mockResolvedValue({});

      await listarCoordenadorias({
        nome: '',
        sigla: '',
      });

      expect(obterRegistro).toHaveBeenCalledWith(
        `${URL_API_COORDENADORIA}?`
      );
    });
  });
});