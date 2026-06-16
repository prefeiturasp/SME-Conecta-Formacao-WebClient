import {
  setDeslogar,
  setDadosLogin,
  typeSetDeslogar,
  typeSetDadosLogin,
} from './actions';
import { RetornoPerfilUsuarioDTO } from '../../../../core/dto/retorno-perfil-usuario-dto';

describe('Auth Actions', () => {
  describe('setDeslogar', () => {
    it('deve criar a action de deslogar corretamente', () => {
      const result = setDeslogar();

      expect(result).toEqual({
        type: typeSetDeslogar,
      });
    });

    it('deve retornar o type correto', () => {
      expect(setDeslogar().type).toBe(typeSetDeslogar);
    });
  });

  describe('setDadosLogin', () => {
    const payload: RetornoPerfilUsuarioDTO = {
  usuarioNome: 'Usuário Teste',
  usuarioLogin: 'usuario.teste',
  token: 'token-123',
  email: 'usuario@teste.com',
  dataHoraExpiracao: new Date().toISOString(),
  perfilUsuario: [],
  autenticado: true,
};

    it('deve criar a action de dados de login corretamente', () => {
      const result = setDadosLogin(payload);

      expect(result).toEqual({
        type: typeSetDadosLogin,
        payload,
      });
    });

    it('deve manter a referência do payload', () => {
      const result = setDadosLogin(payload);

      expect(result.payload).toBe(payload);
    });

    it('deve retornar o type correto', () => {
      expect(setDadosLogin(payload).type).toBe(typeSetDadosLogin);
    });
  });
});