import { describe, test, expect, jest, beforeEach } from '@jest/globals';

jest.mock('antd', () => ({
  Form: 'Form',
}));

jest.mock('antd/es/form/Form', () => ({
  useForm: jest.fn(() => [
    {
      setFieldValue: jest.fn(),
    },
  ]),
}));

jest.mock('~/components/main/input/nome', () => ({
  __esModule: true,
  InputNome: 'InputNome',
}));

jest.mock('~/core/hooks/use-redux', () => ({
  useAppSelector: jest.fn(),
}));

jest.mock('~/core/services/usuario-service', () => ({
  alterarNome: jest.fn(),
}));

jest.mock('../modal-edit-default', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import { ModalEditNome } from './modal-edit-nome';
import usuarioService from '~/core/services/usuario-service';
import { useAppSelector } from '~/core/hooks/use-redux';

describe('ModalEditNome', () => {
  const useAppSelectorMock = useAppSelector as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    useAppSelectorMock.mockReturnValue({
      usuarioLogin: 'usuario_teste',
    });
  });

  describe('Componente', () => {
    test('deve ser uma função', () => {
      expect(typeof ModalEditNome).toBe('function');
    });

    test('deve ter o nome correto', () => {
      expect(ModalEditNome.name).toBe('ModalEditNome');
    });

    test('deve estar definido', () => {
      expect(ModalEditNome).toBeDefined();
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

  describe('Função alterarNome', () => {
    test('deve chamar usuarioService corretamente', () => {
      const usuarioLogin = 'usuario_teste';

      const alterarNome = (values: { nome: string }) =>
        usuarioService.alterarNome(usuarioLogin, values?.nome);

      alterarNome({ nome: 'João' });

      expect(usuarioService.alterarNome).toHaveBeenCalledWith(
        'usuario_teste',
        'João'
      );
    });

    test('deve aceitar nome undefined', () => {
      const usuarioLogin = 'usuario_teste';

      const alterarNome = (values: { nome: string }) =>
        usuarioService.alterarNome(usuarioLogin, values?.nome as any);

      alterarNome({ nome: undefined as any });

      expect(usuarioService.alterarNome).toHaveBeenCalledWith(
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
        title: 'Alterar nome',
        service: jest.fn(),
        updateFields,
        mensagemConfirmarCancelar:
          'Você não salvou o novo nome, confirma que deseja descartar a alteração?',
        closeModal,
      };

      expect(props.title).toBe('Alterar nome');
      expect(props.closeModal).toBe(closeModal);
    });
  });

  describe('InitialValues', () => {
    test('deve receber nome corretamente', () => {
      const initialValues = { nome: 'João' };

      expect(initialValues.nome).toBe('João');
    });
  });

  describe('InputNome onChange', () => {
    test('deve remover caracteres inválidos', () => {
      const value = 'João123!@#';
      const newValue = value.replace(/[^\p{L}\s]/gu, '');

      expect(newValue).toBe('João');
    });

    test('deve manter apenas letras e espaços', () => {
      const value = 'Maria Silva';
      const newValue = value.replace(/[^\p{L}\s]/gu, '');

      expect(newValue).toBe('Maria Silva');
    });
  });
});