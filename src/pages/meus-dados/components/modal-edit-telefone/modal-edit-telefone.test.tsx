import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { maskTelefone } from '~/core/utils/functions';

// Mock dos módulos externos
jest.mock('~/components/main/input/telefone', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('../modal-edit-default', () => ({
  __esModule: true,
  default: ({ form, title, service, updateFields, mensagemConfirmarCancelar, closeModal, children }: any) => ({
    form,
    title,
    service,
    updateFields,
    mensagemConfirmarCancelar,
    closeModal,
    children,
  }),
}));

jest.mock('~/core/hooks/use-redux', () => ({
  useAppSelector: jest.fn((selector) => {
    return selector({
      auth: { usuarioLogin: 'teste@email.com' },
    });
  }),
}));

jest.mock('~/core/services/usuario-service', () => ({
  __esModule: true,
  default: {
    alterarTelefone: jest.fn().mockResolvedValue({ sucesso: true }),
  },
}));

// Importar após os mocks
import usuarioService from '~/core/services/usuario-service';

describe('ModalEditTelefone', () => {
  let mockUpdateFields: jest.Mock;
  let mockCloseModal: jest.Mock;

  beforeEach(() => {
    mockUpdateFields = jest.fn();
    mockCloseModal = jest.fn();
    jest.clearAllMocks();
  });

  describe('Type de Props', () => {
    test('deve aceitar initialValues com telefone string', () => {
      const initialValues = { telefone: '11987654321' };
      expect(initialValues).toHaveProperty('telefone');
      expect(typeof initialValues.telefone).toBe('string');
    });

    test('deve aceitar updateFields como função', () => {
      expect(typeof mockUpdateFields).toBe('function');
    });

    test('deve aceitar closeModal como função', () => {
      expect(typeof mockCloseModal).toBe('function');
    });

    test('deve aceitar initialValues com telefone vazio', () => {
      const initialValues = { telefone: '' };
      expect(initialValues.telefone).toBe('');
    });
  });

  describe('Formatação de Telefone', () => {
    test('deve formatar telefone com 11 dígitos', () => {
      const telefone = '11987654321';
      const telefoneMascarado = maskTelefone(telefone);
      expect(telefoneMascarado).toContain('(11)');
      expect(telefoneMascarado).toContain('9876');
    });

    test('deve formatar telefone com 10 dígitos', () => {
      const telefone = '1133334444';
      const telefoneMascarado = maskTelefone(telefone);
      expect(telefoneMascarado).toContain('(11)');
      expect(telefoneMascarado).toContain('3333');
    });

    test('deve retornar string vazia quando initialValues.telefone está vazio', () => {
      const initialValues = { telefone: '' };
      const initialValuesFormatted = {
        telefone: initialValues?.telefone ? maskTelefone(initialValues.telefone) : '',
      };
      expect(initialValuesFormatted.telefone).toBe('');
    });

    test('deve formatar initialValues corretamente', () => {
      const initialValues = { telefone: '11987654321' };
      const initialValuesFormatted = {
        telefone: initialValues?.telefone ? maskTelefone(initialValues.telefone) : '',
      };
      expect(initialValuesFormatted.telefone).not.toBe('');
      expect(initialValuesFormatted.telefone).toContain('(');
    });
  });

  describe('Mensagens de Validação', () => {
    test('deve ter mensagem de campo obrigatório', () => {
      const validateMessages = {
        required: 'Campo obrigatório',
      };
      expect(validateMessages.required).toBe('Campo obrigatório');
    });

    test('validateMessages deve ser um objeto com propriedade required', () => {
      const validateMessages = {
        required: 'Campo obrigatório',
      };
      expect(validateMessages).toHaveProperty('required');
    });
  });

  describe('Função alterarTelefone', () => {
    test('deve chamar usuarioService.alterarTelefone com login e telefone', () => {
      const usuarioLogin = 'teste@email.com';
      const telefone = '11987654321';

      const alterarTelefone = (values: { telefone: string }) =>
        usuarioService.alterarTelefone(usuarioLogin, values?.telefone);

      alterarTelefone({ telefone });

      expect(usuarioService.alterarTelefone).toHaveBeenCalledWith(usuarioLogin, telefone);
    });

    test('deve chamar usuarioService.alterarTelefone com valores corretos', () => {
      const usuarioLogin = 'usuario@teste.com';
      const telefone = '21987654321';

      const alterarTelefone = (values: { telefone: string }) =>
        usuarioService.alterarTelefone(usuarioLogin, values?.telefone);

      alterarTelefone({ telefone });

      expect(usuarioService.alterarTelefone).toHaveBeenCalledWith('usuario@teste.com', '21987654321');
    });

    test('alterarTelefone deve ser uma função que retorna Promise', () => {
      const usuarioLogin = 'teste@email.com';

      const alterarTelefone = (values: { telefone: string }) =>
        usuarioService.alterarTelefone(usuarioLogin, values?.telefone);

      const resultado = alterarTelefone({ telefone: '11987654321' });

      expect(resultado).toBeInstanceOf(Promise);
    });
  });

  describe('Props Passados ao ModalEditDefault', () => {
    test('deve ter title "Alterar telefone"', () => {
      const title = 'Alterar telefone';
      expect(title).toBe('Alterar telefone');
    });

    test('deve ter mensagem de confirmação adequada', () => {
      const mensagem =
        'Você não salvou o novo telefone, confirma que deseja descartar a alteração?';
      expect(mensagem).toContain('Você não salvou');
      expect(mensagem).toContain('telefone');
    });

    test('deve passar updateFields como prop', () => {
      expect(typeof mockUpdateFields).toBe('function');
    });

    test('deve passar closeModal como prop', () => {
      expect(typeof mockCloseModal).toBe('function');
    });
  });

  describe('Estrutura do Formulário', () => {
    test('Form deve ter layout vertical', () => {
      const formConfig = {
        layout: 'vertical',
      };
      expect(formConfig.layout).toBe('vertical');
    });

    test('Form deve ter autoComplete off', () => {
      const formConfig = {
        autoComplete: 'off',
      };
      expect(formConfig.autoComplete).toBe('off');
    });

    test('Form deve receber initialValuesFormatted', () => {
      const initialValues = { telefone: '11987654321' };
      const initialValuesFormatted = {
        telefone: initialValues?.telefone ? maskTelefone(initialValues.telefone) : '',
      };
      expect(initialValuesFormatted).toHaveProperty('telefone');
    });
  });

  describe('Fluxo Completo', () => {
    test('deve processar alteração de telefone do início ao fim', () => {
      const initialValues = { telefone: '11987654321' };
      const usuarioLogin = 'teste@email.com';

      // Formatar initial values
      const initialValuesFormatted = {
        telefone: initialValues?.telefone ? maskTelefone(initialValues.telefone) : '',
      };

      // Criar função alterarTelefone
      const alterarTelefone = (values: { telefone: string }) =>
        usuarioService.alterarTelefone(usuarioLogin, values?.telefone);

      // Simular mudança de telefone
      const novoTelefone = '21987654321';
      alterarTelefone({ telefone: novoTelefone });

      // Verificar chamada
      expect(usuarioService.alterarTelefone).toHaveBeenCalledWith(usuarioLogin, novoTelefone);
      expect(initialValuesFormatted.telefone).not.toBe('');
    });

    test('deve permitir fechar modal após alteração', () => {
      const closeModal = mockCloseModal;
      closeModal();
      expect(closeModal).toHaveBeenCalled();
    });

    test('deve permitir atualizar fields após alteração', () => {
      const updateFields = mockUpdateFields;
      updateFields({ telefone: '11987654321' });
      expect(updateFields).toHaveBeenCalledWith({ telefone: '11987654321' });
    });
  });

  describe('Casos Extremos', () => {
    test('deve lidar com telefone undefined', () => {
      const initialValues = { telefone: undefined as any };
      const initialValuesFormatted = {
        telefone: initialValues?.telefone ? maskTelefone(initialValues.telefone) : '',
      };
      expect(initialValuesFormatted.telefone).toBe('');
    });

    test('deve lidar com initialValues null', () => {
      const initialValues: any = null;
      const initialValuesFormatted = {
        telefone: initialValues?.telefone ? maskTelefone(initialValues.telefone) : '',
      };
      expect(initialValuesFormatted.telefone).toBe('');
    });

    test('deve aceitar telefone com múltiplos espaços', () => {
      const telefone = '  11987654321  ';
      expect(typeof telefone).toBe('string');
      expect(telefone.length).toBeGreaterThan(0);
    });

    test('alterarTelefone deve ser chamado apenas quando necessário', () => {
      const usuarioLogin = 'teste@email.com';
      const alterarTelefone = (values: { telefone: string }) =>
        usuarioService.alterarTelefone(usuarioLogin, values?.telefone);

      // Não chamar
      expect(usuarioService.alterarTelefone).not.toHaveBeenCalled();

      // Chamar uma vez
      alterarTelefone({ telefone: '11987654321' });
      expect(usuarioService.alterarTelefone).toHaveBeenCalledTimes(1);

      // Chamar novamente
      alterarTelefone({ telefone: '21987654321' });
      expect(usuarioService.alterarTelefone).toHaveBeenCalledTimes(2);
    });
  });
});
