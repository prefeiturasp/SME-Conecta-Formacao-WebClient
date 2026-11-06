import {
  setPerfilUsuario,
  setPerfilSelecionado,
  setDres,
  typeSetPerfilUsuario,
  typeSetPerfilSelecionado,
  typeSetDres,
} from './actions';
import { PerfilUsuarioDTO } from '../../../../core/dto/perfil-usuario-dto';

describe('Perfil Actions', () => {
  describe('setPerfilUsuario', () => {
    it('deve criar a action corretamente', () => {
      const payload = [
        {
          perfil: '1',
          perfilNome: 'Administrador',
        },
        {
          perfil: '2',
          perfilNome: 'Professor',
        },
      ] as PerfilUsuarioDTO[];

      const result = setPerfilUsuario(payload);

      expect(result).toEqual({
        type: typeSetPerfilUsuario,
        payload,
      });
    });

    it('deve manter a referência do payload', () => {
      const payload = [] as PerfilUsuarioDTO[];

      const result = setPerfilUsuario(payload);

      expect(result.payload).toBe(payload);
    });

    it('deve retornar o type correto', () => {
      expect(setPerfilUsuario([]).type).toBe(typeSetPerfilUsuario);
    });
  });

  describe('setPerfilSelecionado', () => {
    it('deve criar a action corretamente', () => {
      const payload = {
        perfil: '1',
        perfilNome: 'Administrador',
      } as PerfilUsuarioDTO;

      const result = setPerfilSelecionado(payload);

      expect(result).toEqual({
        type: typeSetPerfilSelecionado,
        payload,
      });
    });

    it('deve manter a referência do payload', () => {
      const payload = {} as PerfilUsuarioDTO;

      const result = setPerfilSelecionado(payload);

      expect(result.payload).toBe(payload);
    });

    it('deve retornar o type correto', () => {
      const payload = {} as PerfilUsuarioDTO;

      expect(setPerfilSelecionado(payload).type).toBe(typeSetPerfilSelecionado);
    });
  });

  describe('setDres', () => {
    it('deve criar a action corretamente', () => {
      const payload = ['108900', '108100'];

      const result = setDres(payload);

      expect(result).toEqual({
        type: typeSetDres,
        payload,
      });
    });

    it('deve retornar o type correto', () => {
      expect(setDres([]).type).toBe(typeSetDres);
    });
  });
});
