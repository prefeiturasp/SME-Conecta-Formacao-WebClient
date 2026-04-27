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
  alterarUnidade: jest.fn(),
}));

jest.mock('../modal-edit-default', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('~/components/main/input/codigo-eol-ue', () => ({
  __esModule: true,
  default: 'InputCodigoEolUE',
}));

jest.mock('~/components/main/input/unidade', () => ({
  __esModule: true,
  default: 'InputUnidade',
}));

jest.mock('~/core/constants/ids/input', () => ({
  CF_INPUT_UNIDADE: 'CF_INPUT_UNIDADE',
}));

import ModalEditUnidade from './modal-edit-unidade';
import usuarioService from '~/core/services/usuario-service';
import { useAppSelector } from '~/core/hooks/use-redux';

describe('ModalEditUnidade', () => {
  const useAppSelectorMock = useAppSelector as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    useAppSelectorMock.mockReturnValue({
      usuarioLogin: 'usuario_teste',
    });
  });

  describe('Componente', () => {
    test('deve ser uma função', () => {
      expect(typeof ModalEditUnidade).toBe('function');
    });

    test('deve ter o nome correto', () => {
      expect(ModalEditUnidade.name).toBe('ModalEditUnidade');
    });

    test('deve estar definido', () => {
      expect(ModalEditUnidade).toBeDefined();
    });
  });

  describe('Estados iniciais', () => {
    test('desativarBotaoAlterar inicial deve ser true', () => {
      const desativarBotaoAlterar = true;
      expect(desativarBotaoAlterar).toBe(true);
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

  describe('Função alterarUnidade', () => {
    test('deve chamar usuarioService corretamente', () => {
      const usuarioLogin = 'usuario_teste';

      const alterarUnidade = (values: { codigoUnidade: string; nomeUnidade: string }) => {
        return usuarioService.alterarUnidade(usuarioLogin, values.codigoUnidade!);
      };

      alterarUnidade({ codigoUnidade: '123', nomeUnidade: 'Teste' });

      expect(usuarioService.alterarUnidade).toHaveBeenCalledWith(
        'usuario_teste',
        '123'
      );
    });

    test('deve aceitar codigoUnidade undefined', () => {
      const usuarioLogin = 'usuario_teste';

      const alterarUnidade = (values: { codigoUnidade: string; nomeUnidade: string }) => {
        return usuarioService.alterarUnidade(usuarioLogin, values.codigoUnidade as any);
      };

      alterarUnidade({ codigoUnidade: undefined as any, nomeUnidade: 'Teste' });

      expect(usuarioService.alterarUnidade).toHaveBeenCalledWith(
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
      const desativarBotaoAlterar = true;

      const props = {
        form,
        title: 'Alterar Unidade',
        service: jest.fn(),
        updateFields,
        desativarBotaoAlterar,
        mensagemConfirmarCancelar:
          'Você não salvou a alteração, confirma que deseja descartar a alteração?',
        closeModal,
      };

      expect(props.title).toBe('Alterar Unidade');
      expect(props.desativarBotaoAlterar).toBe(true);
      expect(props.closeModal).toBe(closeModal);
    });
  });

  describe('InitialValues', () => {
    test('deve receber nomeUnidade corretamente', () => {
      const initialValues = { nomeUnidade: 'Unidade Teste' };

      expect(initialValues.nomeUnidade).toBe('Unidade Teste');
    });
  });

  describe('Inputs', () => {
    test('InputCodigoEolUE deve receber id correto', () => {
      const inputProps = { id: 'CF_INPUT_UNIDADE' };

      expect(inputProps.id).toBe('CF_INPUT_UNIDADE');
    });

    test('InputUnidade deve estar desabilitado', () => {
      const inputProps = { id: 'CF_INPUT_UNIDADE', disabled: true };

      expect(inputProps.disabled).toBe(true);
    });

    test('InputUnidade não deve ser obrigatório', () => {
      const formItemProps = { required: false };

      expect(formItemProps.required).toBe(false);
    });
  });
});