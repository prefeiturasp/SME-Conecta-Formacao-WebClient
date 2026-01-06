import { obterGruposPerfis } from './grupo-service';
import { GrupoDTO } from '../dto/grupo-dto';

jest.mock('./api', () => ({
  obterRegistro: jest.fn(),
}));

import { obterRegistro } from './api';

const mockObterRegistro = obterRegistro as jest.MockedFunction<typeof obterRegistro>;

describe('GrupoService', () => {
  const URL_DEFAULT = 'v1/Grupo';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('obterGruposPerfis', () => {
    test('deve obter lista de grupos de perfis com sucesso', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          {
            id: 1,
            nome: 'Administrador',
            descricao: 'Grupo de administradores do sistema',
            perfis: ['Admin', 'SuperAdmin'],
          },
          {
            id: 2,
            nome: 'Professor',
            descricao: 'Grupo de professores',
            perfis: ['Professor', 'Coordenador'],
          },
          {
            id: 3,
            nome: 'Cursista',
            descricao: 'Grupo de cursistas',
            perfis: ['Cursista'],
          },
        ] as GrupoDTO[],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterGruposPerfis();

      expect(mockObterRegistro).toHaveBeenCalledWith(URL_DEFAULT);
      expect(result).toEqual(mockResponse);
      expect(result.dados).toHaveLength(3);
    });

    test('deve retornar lista vazia quando não há grupos', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [] as GrupoDTO[],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterGruposPerfis();

      expect(result.dados).toEqual([]);
      expect(result.dados).toHaveLength(0);
    });

    test('deve retornar grupos com diferentes estruturas de perfis', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          {
            id: 1,
            nome: 'Grupo A',
            perfis: ['Perfil1', 'Perfil2', 'Perfil3'],
          },
          {
            id: 2,
            nome: 'Grupo B',
            perfis: ['Perfil4'],
          },
        ] as GrupoDTO[],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterGruposPerfis();

      expect(result.dados?.[0].perfis).toHaveLength(3);
      expect(result.dados?.[1].perfis).toHaveLength(1);
    });

    test('deve lidar com erro ao obter grupos de perfis', async () => {
      const mockResponse = {
        sucesso: false,
        dados: null,
        mensagens: ['Erro ao buscar grupos de perfis'],
        status: 500,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterGruposPerfis();

      expect(result.sucesso).toBe(false);
      expect(result.mensagens).toContain('Erro ao buscar grupos de perfis');
      expect(result.dados).toBeNull();
    });

    test('deve manter estrutura de dados GrupoDTO', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          {
            id: 10,
            nome: 'Grupo Teste',
            descricao: 'Descrição do grupo',
            perfis: ['Perfil A', 'Perfil B'],
            ativo: true,
          } as GrupoDTO,
        ],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterGruposPerfis();

      expect(result.dados?.[0]).toHaveProperty('id');
      expect(result.dados?.[0]).toHaveProperty('nome');
      expect(result.dados?.[0]).toHaveProperty('perfis');
      expect(result.dados?.[0].id).toBe(10);
      expect(result.dados?.[0].nome).toBe('Grupo Teste');
    });

    test('deve chamar API apenas uma vez', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [] as GrupoDTO[],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      await obterGruposPerfis();

      expect(mockObterRegistro).toHaveBeenCalledTimes(1);
      expect(mockObterRegistro).toHaveBeenCalledWith(URL_DEFAULT);
    });

    test('deve retornar status 200 em caso de sucesso', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          {
            id: 1,
            nome: 'Grupo 1',
            perfis: [],
          } as GrupoDTO,
        ],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterGruposPerfis();

      expect(result.status).toBe(200);
      expect(result.sucesso).toBe(true);
    });

    test('deve lidar com erro de autenticação', async () => {
      const mockResponse = {
        sucesso: false,
        dados: null,
        mensagens: ['Não autorizado'],
        status: 401,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterGruposPerfis();

      expect(result.sucesso).toBe(false);
      expect(result.status).toBe(401);
      expect(result.mensagens).toContain('Não autorizado');
    });

    test('deve lidar com erro de permissão', async () => {
      const mockResponse = {
        sucesso: false,
        dados: null,
        mensagens: ['Acesso negado'],
        status: 403,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterGruposPerfis();

      expect(result.sucesso).toBe(false);
      expect(result.status).toBe(403);
      expect(result.mensagens).toContain('Acesso negado');
    });

    test('deve processar grupos com nomes variados', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { id: 1, nome: 'Admin DF', perfis: [] },
          { id: 2, nome: 'Parecerista', perfis: [] },
          { id: 3, nome: 'DRE', perfis: [] },
          { id: 4, nome: 'Área Promotora', perfis: [] },
        ] as GrupoDTO[],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterGruposPerfis();

      expect(result.dados).toHaveLength(4);
      expect(result.dados?.map((g) => g.nome)).toEqual([
        'Admin DF',
        'Parecerista',
        'DRE',
        'Área Promotora',
      ]);
    });

    test('deve retornar grupos ordenados por id', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { id: 1, nome: 'Grupo 1', perfis: [] },
          { id: 2, nome: 'Grupo 2', perfis: [] },
          { id: 3, nome: 'Grupo 3', perfis: [] },
        ] as GrupoDTO[],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterGruposPerfis();

      const ids = result.dados?.map((g) => g.id);
      expect(ids).toEqual([1, 2, 3]);
    });

    test('deve processar grupos com múltiplos perfis associados', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          {
            id: 1,
            nome: 'Super Admin',
            perfis: [
              'Admin DF',
              'Admin Geral',
              'Cadastrador',
              'Parecerista',
              'Área Promotora',
            ],
          },
        ] as GrupoDTO[],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterGruposPerfis();

      expect(result.dados?.[0].perfis).toHaveLength(5);
      expect(result.dados?.[0].perfis).toContain('Admin DF');
      expect(result.dados?.[0].perfis).toContain('Parecerista');
    });

    test('deve lidar com timeout de requisição', async () => {
      const mockResponse = {
        sucesso: false,
        dados: null,
        mensagens: ['Timeout na requisição'],
        status: 504,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterGruposPerfis();

      expect(result.sucesso).toBe(false);
      expect(result.status).toBe(504);
      expect(result.mensagens).toContain('Timeout na requisição');
    });

    test('deve retornar tipo correto de Promise', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [] as GrupoDTO[],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const promise = obterGruposPerfis();

      expect(promise).toBeInstanceOf(Promise);
      await promise;
    });
  });
});
