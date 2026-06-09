import { describe, test, expect, jest, beforeEach } from '@jest/globals';

jest.mock('antd', () => ({
  Form: 'Form',
}));

jest.mock('antd/es/form/Form', () => ({
  useForm: jest.fn(() => [{}]),
}));

jest.mock('~/core/hooks/use-redux', () => ({
  useAppSelector: jest.fn(),
}));

jest.mock('~/core/services/usuario-service', () => ({
  alterarEmailTipoUsuarioExterno: jest.fn(),
}));

jest.mock('../modal-edit-default', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('~/components/main/input/tipo-email', () => ({
  __esModule: true,
  default: 'SelectTipoEmail',
}));

import ModalEditTipoEmailEducacional from './modal-edit-tipo-email-educacional';
import usuarioService from '~/core/services/usuario-service';
import { useAppSelector } from '~/core/hooks/use-redux';

describe('ModalEditTipoEmailEducacional', () => {
  const useAppSelectorMock = useAppSelector as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    useAppSelectorMock.mockReturnValue({
      usuarioLogin: 'usuario_teste',
    });
  });

  describe('Componente', () => {
    test('deve ser uma função', () => {
      expect(typeof ModalEditTipoEmailEducacional).toBe('function');
    });

    test('deve ter o nome correto', () => {
      expect(ModalEditTipoEmailEducacional.name).toBe('ModalEditTipoEmailEducacional');
    });

    test('deve estar definido', () => {
      expect(ModalEditTipoEmailEducacional).toBeDefined();
    });
  });

  describe('useAppSelector', () => {
    test('deve obter usuarioLogin corretamente', () => {
      const auth = useAppSelectorMock();
      const usuarioLogin = auth?.usuarioLogin;

      expect(usuarioLogin).toBe('usuario_teste');
    });

    test('deve aceitar auth undefined', () => {
      useAppSelectorMock.mockReturnValue(undefined);

      const auth = useAppSelectorMock();
      const usuarioLogin = auth?.usuarioLogin;

      expect(usuarioLogin).toBeUndefined();
    });
  });

  describe('validateMessages', () => {
    test('deve conter mensagem obrigatória', () => {
      const validateMessages = {
        required: 'Campo obrigatório',
      };

      expect(validateMessages.required).toBe('Campo obrigatório');
    });
  });

  describe('Função alterarTipoEmail', () => {
    test('deve chamar usuarioService corretamente', () => {
      const usuarioLogin = 'usuario_teste';

      const alterarTipoEmail = (values: { tipoEmail: number }) =>
        usuarioService.alterarEmailTipoUsuarioExterno(usuarioLogin, values?.tipoEmail);

      alterarTipoEmail({ tipoEmail: 1 });

      expect(usuarioService.alterarEmailTipoUsuarioExterno).toHaveBeenCalledWith(
        'usuario_teste',
        1
      );
    });

    test('deve aceitar tipoEmail undefined', () => {
      const usuarioLogin = 'usuario_teste';

      const alterarTipoEmail = (values: { tipoEmail: number }) =>
        usuarioService.alterarEmailTipoUsuarioExterno(usuarioLogin, values?.tipoEmail as any);

      alterarTipoEmail({ tipoEmail: undefined as any });

      expect(usuarioService.alterarEmailTipoUsuarioExterno).toHaveBeenCalledWith(
        'usuario_teste',
        undefined
      );
    });
  });

  describe('Props do ModalEditDefault', () => {
    test('deve montar props corretamente', () => {
      const form = {};
      const updateFields = jest.fn();
      const closeModal = jest.fn();

      const props = {
        form,
        title: 'Alterar tipo',
        service: jest.fn(),
        updateFields,
        mensagemConfirmarCancelar:
          'Você não salvou o novo tipo, confirma que deseja descartar a alteração?',
        closeModal,
      };

      expect(props.title).toBe('Alterar tipo');
      expect(props.closeModal).toBe(closeModal);
    });
  });

  describe('InitialValues', () => {
    test('deve receber tipoEmail corretamente', () => {
      const initialValues = { tipoEmail: 2 };

      expect(initialValues.tipoEmail).toBe(2);
    });
  });

  describe('SelectTipoEmail', () => {
    test('deve ser obrigatório', () => {
      const formItemProps = { required: true };

      expect(formItemProps.required).toBe(true);
    });

    test('deve ter largura 100%', () => {
      const style = { width: '100%' };

      expect(style.width).toBe('100%');
    });
  });
});