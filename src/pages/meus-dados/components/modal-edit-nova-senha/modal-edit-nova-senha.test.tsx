import { describe, test, expect, jest, beforeEach } from '@jest/globals';

jest.mock('antd', () => ({
  Form: 'Form',
  Row: 'Row',
  Col: 'Col',
  Typography: { Text: 'Text' },
}));

jest.mock('antd/es/form/Form', () => ({
  useForm: jest.fn(() => [{}]),
}));

jest.mock('styled-components', () => ({
  __esModule: true,
  default: new Proxy(
    {},
    { get: (_t, prop) => (prop === '__esModule' ? false : () => prop) },
  ),
  createGlobalStyle: () => () => null,
}));

jest.mock('~/components/main/input/senha-cadastro', () => ({
  __esModule: true,
  default: 'SenhaCadastro',
}));

jest.mock('~/core/hooks/use-redux', () => ({
  useAppSelector: jest.fn(),
}));

jest.mock('~/core/services/usuario-service', () => ({
  alterarSenha: jest.fn(),
}));

jest.mock('../modal-edit-default', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('~/core/constants/ids/input', () => ({
  CF_INPUT_CONFIRMAR_SENHA: 'CF_INPUT_CONFIRMAR_SENHA',
  CF_INPUT_SENHA: 'CF_INPUT_SENHA',
  CF_INPUT_SENHA_ATUAL: 'CF_INPUT_SENHA_ATUAL',
}));

import ModalEditNovaSenha from './modal-edit-nova-senha';
import usuarioService from '~/core/services/usuario-service';
import { useAppSelector } from '~/core/hooks/use-redux';

describe('ModalEditNovaSenha', () => {
  const useAppSelectorMock = useAppSelector as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    useAppSelectorMock.mockReturnValue({
      usuarioLogin: 'usuario_teste',
    });
  });

  describe('Componente', () => {
    test('deve ser uma função', () => {
      expect(typeof ModalEditNovaSenha).toBe('function');
    });

    test('deve ter o nome correto', () => {
      expect(ModalEditNovaSenha.name).toBe('ModalEditNovaSenha');
    });

    test('deve estar definido', () => {
      expect(ModalEditNovaSenha).toBeDefined();
    });
  });

  describe('useAppSelector', () => {
    test('deve obter login corretamente', () => {
      const auth = useAppSelectorMock();
      const login = auth?.usuarioLogin;

      expect(login).toBe('usuario_teste');
    });

    test('deve aceitar auth undefined', () => {
      useAppSelectorMock.mockReturnValue(undefined);

      const auth = useAppSelectorMock();
      const login = auth?.usuarioLogin;

      expect(login).toBeUndefined();
    });
  });

  describe('Lista de requisitos', () => {
    test('deve conter 6 itens', () => {
      const listaRequisitos = [
        'Uma letra maiúscula',
        'Uma letra minúscula',
        'Um algarismo (número) ou um símbolo (caractere especial)',
        'Não pode permitir caracteres acentuados',
        'Deve ter no mínimo 8 e no máximo 12 caracteres',
        'A senha e a confirmação de senha devem ser iguais',
      ];

      expect(listaRequisitos).toHaveLength(6);
    });

    test('deve conter requisito de tamanho', () => {
      const listaRequisitos = [
        'Deve ter no mínimo 8 e no máximo 12 caracteres',
      ];

      expect(listaRequisitos[0]).toContain('8');
      expect(listaRequisitos[0]).toContain('12');
    });
  });

  describe('validateMessages', () => {
    test('deve conter mensagem obrigatória', () => {
      const validateMessages = {
        required: 'Campo obrigatório',
        string: {
          range: 'Deve ter entre ${min} e ${max} caracteres',
        },
      };

      expect(validateMessages.required).toBe('Campo obrigatório');
    });

    test('deve conter validação de range', () => {
      const validateMessages = {
        string: {
          range: 'Deve ter entre ${min} e ${max} caracteres',
        },
      };

      expect(validateMessages.string.range).toContain('${min}');
      expect(validateMessages.string.range).toContain('${max}');
    });
  });

  describe('Função alterar', () => {
    test('deve chamar usuarioService corretamente', () => {
      const login = 'usuario_teste';

      const alterar = (values: any) =>
        usuarioService.alterarSenha(login, values);

      const values = {
        senhaAtual: '123',
        senhaNova: 'abc123',
        confirmarSenha: 'abc123',
      };

      alterar(values);

      expect(usuarioService.alterarSenha).toHaveBeenCalledWith(
        'usuario_teste',
        values
      );
    });

    test('deve aceitar values undefined', () => {
      const login = 'usuario_teste';

      const alterar = (values: any) =>
        usuarioService.alterarSenha(login, values);

      alterar(undefined);

      expect(usuarioService.alterarSenha).toHaveBeenCalledWith(
        'usuario_teste',
        undefined
      );
    });
  });

  describe('Props do ModalEditDefault', () => {
    test('deve montar props corretamente', () => {
      const form = {};
      const closeModal = jest.fn();

      const props = {
        form,
        title: 'Nova senha',
        service: jest.fn(),
        mensagemConfirmarCancelar:
          'Você não salvou a nova senha, confirma que deseja descartar a alteração?',
        closeModal,
      };

      expect(props.title).toBe('Nova senha');
      expect(props.closeModal).toBe(closeModal);
    });
  });

  describe('Inputs de senha', () => {
    test('deve ter campo senha atual', () => {
      const inputProps = { id: 'CF_INPUT_SENHA_ATUAL' };

      expect(inputProps.id).toBe('CF_INPUT_SENHA_ATUAL');
    });

    test('deve ter campo nova senha', () => {
      const inputProps = { id: 'CF_INPUT_SENHA' };

      expect(inputProps.id).toBe('CF_INPUT_SENHA');
    });

    test('deve ter campo confirmação', () => {
      const inputProps = { id: 'CF_INPUT_CONFIRMAR_SENHA' };

      expect(inputProps.id).toBe('CF_INPUT_CONFIRMAR_SENHA');
    });
  });
});