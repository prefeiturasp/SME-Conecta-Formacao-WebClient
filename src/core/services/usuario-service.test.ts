import usuarioService from './usuario-service';
import { CadastroUsuarioDTO } from '../dto/cadastro-usuario-dto';
import { RecuperacaoSenhaDTO } from '../dto/recuperacao-senha-dto';
import { SenhaNovaDTO } from '../dto/senha-nova-dto';
import { AlterarEmailValidacaoDto } from '../dto/alterar-email-validacao-dto';

jest.mock('./api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    put: jest.fn(),
    post: jest.fn(),
  },
  inserirRegistro: jest.fn(),
  obterRegistro: jest.fn(),
}));

import api, { inserirRegistro, obterRegistro } from './api';

const mockApiGet = api.get as jest.MockedFunction<typeof api.get>;
const mockApiPut = api.put as jest.MockedFunction<typeof api.put>;
const mockApiPost = api.post as jest.MockedFunction<typeof api.post>;
const mockInserirRegistro = inserirRegistro as jest.MockedFunction<typeof inserirRegistro>;
const mockObterRegistro = obterRegistro as jest.MockedFunction<typeof obterRegistro>;

describe('UsuarioService', () => {
  const URL_DEFAULT = 'v1/usuario';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('obterMeusDados', () => {
    test('deve obter dados do usuário pelo login', async () => {
      const login = 'usuario@teste.com';
      const mockResponse = {
        data: {
          login: 'usuario@teste.com',
          nome: 'Usuário Teste',
          email: 'usuario@teste.com',
        },
        status: 200,
      };

      mockApiGet.mockResolvedValueOnce(mockResponse as any);

      const result = await usuarioService.obterMeusDados(login);

      expect(mockApiGet).toHaveBeenCalledWith(`${URL_DEFAULT}/${login}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('alterarNome', () => {
    test('deve alterar nome do usuário', async () => {
      const login = 'usuario@teste.com';
      const nome = 'Novo Nome';
      const mockResponse = {
        data: true,
        status: 200,
      };

      mockApiPut.mockResolvedValueOnce(mockResponse as any);

      const result = await usuarioService.alterarNome(login, nome);

      expect(mockApiPut).toHaveBeenCalledWith(`${URL_DEFAULT}/${login}/nome`, { nome });
      expect(result.data).toBe(true);
    });
  });

  describe('alterarEmail', () => {
    test('deve alterar email do usuário', async () => {
      const login = 'usuario@teste.com';
      const email = 'novoemail@teste.com';
      const mockResponse = {
        data: true,
        status: 200,
      };

      mockApiPut.mockResolvedValueOnce(mockResponse as any);

      const result = await usuarioService.alterarEmail(login, email);

      expect(mockApiPut).toHaveBeenCalledWith(`${URL_DEFAULT}/${login}/email`, { email });
      expect(result.data).toBe(true);
    });
  });

  describe('alterarEmailDeValidacao', () => {
    test('deve alterar email de validação', async () => {
      const dados: AlterarEmailValidacaoDto = {
        login: 'usuario@teste.com',
        email: 'validacao@teste.com',
      };
      const mockResponse = {
        data: true,
        status: 200,
      };

      mockApiPut.mockResolvedValueOnce(mockResponse as any);

      const result = await usuarioService.alterarEmailDeValidacao(dados);

      expect(mockApiPut).toHaveBeenCalledWith(`${URL_DEFAULT}/alterar-email`, dados);
      expect(result.data).toBe(true);
    });
  });

  describe('alterarUnidade', () => {
    test('deve alterar unidade do usuário', async () => {
      const login = 'usuario@teste.com';
      const codigoEolUnidade = '123456';
      const mockResponse = {
        data: true,
        status: 200,
      };

      mockApiPut.mockResolvedValueOnce(mockResponse as any);

      const result = await usuarioService.alterarUnidade(login, codigoEolUnidade);

      expect(mockApiPut).toHaveBeenCalledWith(`${URL_DEFAULT}/${login}/unidade-eol`, {
        codigoEolUnidade,
      });
      expect(result.data).toBe(true);
    });
  });

  describe('alterarEmailEducacional', () => {
    test('deve alterar email educacional', async () => {
      const login = 'usuario@teste.com';
      const email = 'educacional@teste.com';
      const mockResponse = {
        data: true,
        status: 200,
      };

      mockApiPut.mockResolvedValueOnce(mockResponse as any);

      const result = await usuarioService.alterarEmailEducacional(login, email);

      expect(mockApiPut).toHaveBeenCalledWith(`${URL_DEFAULT}/${login}/email-educacional`, {
        email,
      });
      expect(result.data).toBe(true);
    });
  });

  describe('alterarEmailTipoUsuarioExterno', () => {
    test('deve alterar tipo de email do usuário externo', async () => {
      const login = 'usuario@teste.com';
      const tipo = 1;
      const mockResponse = {
        data: true,
        status: 200,
      };

      mockApiPut.mockResolvedValueOnce(mockResponse as any);

      const result = await usuarioService.alterarEmailTipoUsuarioExterno(login, tipo);

      expect(mockApiPut).toHaveBeenCalledWith(`${URL_DEFAULT}/${login}/tipo-email`, { tipo });
      expect(result.data).toBe(true);
    });
  });

  describe('alterarSenha', () => {
    test('deve alterar senha do usuário', async () => {
      const login = 'usuario@teste.com';
      const dados: SenhaNovaDTO = {
        senhaAtual: 'senhaAntiga123',
        senhaNova: 'novaSenha456',
      };
      const mockResponse = {
        data: true,
        status: 200,
      };

      mockApiPut.mockResolvedValueOnce(mockResponse as any);

      const result = await usuarioService.alterarSenha(login, dados);

      expect(mockApiPut).toHaveBeenCalledWith(`${URL_DEFAULT}/${login}/senha`, dados);
      expect(result.data).toBe(true);
    });
  });

  describe('solicitarRecuperacaoSenha', () => {
    test('deve solicitar recuperação de senha', async () => {
      const login = 'usuario@teste.com';
      const mockResponse = {
        data: 'Email enviado com sucesso',
        status: 200,
      };

      mockApiPost.mockResolvedValueOnce(mockResponse as any);

      const result = await usuarioService.solicitarRecuperacaoSenha(login);

      expect(mockApiPost).toHaveBeenCalledWith(
        `${URL_DEFAULT}/${login}/solicitar-recuperacao-senha`,
      );
      expect(result.data).toBe('Email enviado com sucesso');
    });
  });

  describe('alterarSenhaComTokenRecuperacao', () => {
    test('deve alterar senha com token de recuperação', async () => {
      const params: RecuperacaoSenhaDTO = {
        token: 'token-recuperacao',
        senha: 'novaSenha123',
      };
      const mockResponse = {
        data: {
          token: 'novo-jwt-token',
        },
        status: 200,
      };

      mockApiPut.mockResolvedValueOnce(mockResponse as any);

      const result = await usuarioService.alterarSenhaComTokenRecuperacao(params);

      expect(mockApiPut).toHaveBeenCalledWith(`${URL_DEFAULT}/recuperar-senha`, params);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('tokenRecuperacaoSenhaEstaValido', () => {
    test('deve verificar se token de recuperação está válido', async () => {
      const token = 'token-valido';
      const mockResponse = {
        data: true,
        status: 200,
      };

      mockApiGet.mockResolvedValueOnce(mockResponse as any);

      const result = await usuarioService.tokenRecuperacaoSenhaEstaValido(token);

      expect(mockApiGet).toHaveBeenCalledWith(
        `${URL_DEFAULT}/valida-token-recuperacao-senha/${token}`,
      );
      expect(result.data).toBe(true);
    });

    test('deve retornar false para token inválido', async () => {
      const token = 'token-invalido';
      const mockResponse = {
        data: false,
        status: 200,
      };

      mockApiGet.mockResolvedValueOnce(mockResponse as any);

      const result = await usuarioService.tokenRecuperacaoSenhaEstaValido(token);

      expect(result.data).toBe(false);
    });
  });

  describe('cadastrarUsuarioExterno', () => {
    test('deve cadastrar usuário externo', async () => {
      const dados: CadastroUsuarioDTO = {
        nome: 'Novo Usuário',
        cpf: '12345678900',
        email: 'novousuario@teste.com',
        senha: 'senha123',
      };
      const mockResponse = {
        sucesso: true,
        dados: { id: 1 },
        mensagens: [],
        status: 201,
      };

      mockInserirRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await usuarioService.cadastrarUsuarioExterno(dados);

      expect(mockInserirRegistro).toHaveBeenCalledWith(URL_DEFAULT, dados);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('validaEmailToken', () => {
    test('deve validar email com token', async () => {
      const token = 'token-validacao-email';
      const mockResponse = {
        sucesso: true,
        dados: {
          token: 'jwt-token',
          usuarioLogin: 'usuario@teste.com',
        },
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await usuarioService.validaEmailToken(token);

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_DEFAULT}/validar-email/${token}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('reenviarEmail', () => {
    test('deve reenviar email de validação', async () => {
      const login = 'usuario@teste.com';
      const mockResponse = {
        sucesso: true,
        dados: null,
        mensagens: ['Email reenviado'],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await usuarioService.reenviarEmail(login);

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_DEFAULT}/${login}/reenviar-email`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterEmailTipoUsuarioExterno', () => {
    test('deve obter tipos de email de usuário externo', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { id: 1, descricao: 'Pessoal' },
          { id: 2, descricao: 'Corporativo' },
        ],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await usuarioService.obterEmailTipoUsuarioExterno();

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_DEFAULT}/tipo-email`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Integração entre métodos', () => {
    test('deve cadastrar usuário, validar email e alterar dados', async () => {
      const dadosCadastro: CadastroUsuarioDTO = {
        nome: 'Usuário Novo',
        cpf: '12345678900',
        email: 'usuario@teste.com',
        senha: 'senha123',
      };

      mockInserirRegistro.mockResolvedValueOnce({
        sucesso: true,
        dados: { id: 100 },
        mensagens: [],
        status: 201,
      } as any);

      const resultCadastro = await usuarioService.cadastrarUsuarioExterno(dadosCadastro);
      expect(resultCadastro.sucesso).toBe(true);

      mockObterRegistro.mockResolvedValueOnce({
        sucesso: true,
        dados: { token: 'jwt-token' },
        mensagens: [],
        status: 200,
      } as any);

      const resultValidacao = await usuarioService.validaEmailToken('token-123');
      expect(resultValidacao.sucesso).toBe(true);

      mockApiPut.mockResolvedValueOnce({
        data: true,
        status: 200,
      } as any);

      const resultAlterarNome = await usuarioService.alterarNome(
        'usuario@teste.com',
        'Nome Atualizado',
      );
      expect(resultAlterarNome.data).toBe(true);
    });
  });
});
