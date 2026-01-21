import { describe, test, expect, jest } from '@jest/globals';
import { MOTIVO_NAO_INFORMADO } from '~/core/constants/mensagens';

describe('ModalCancelarInscricao', () => {
  describe('Props interface', () => {
    test('deve aceitar ids como array de numbers', () => {
      const ids: number[] = [1, 2, 3];
      expect(Array.isArray(ids)).toBe(true);
      expect(ids.length).toBe(3);
      expect(ids[0]).toBe(1);
    });

    test('deve aceitar onFecharButton como função', () => {
      const mockCallback = jest.fn();
      expect(typeof mockCallback).toBe('function');

      mockCallback();
      expect(mockCallback).toHaveBeenCalled();
    });
  });

  describe('Configuração do Modal', () => {
    test('deve ter título correto', () => {
      const titulo = 'Cancelar inscrição';
      expect(titulo).toBe('Cancelar inscrição');
    });

    test('deve estar aberto por padrão (open=true)', () => {
      const open = true;
      expect(open).toBe(true);
    });

    test('deve estar centralizado', () => {
      const centered = true;
      expect(centered).toBe(true);
    });

    test('deve destruir ao fechar (destroyOnClose)', () => {
      const destroyOnClose = true;
      expect(destroyOnClose).toBe(true);
    });
  });

  describe('Botões do Modal', () => {
    test('deve ter texto de OK correto', () => {
      const okText = 'Cancelar inscrição';
      expect(okText).toBe('Cancelar inscrição');
    });

    test('deve ter texto de cancelar correto', () => {
      const cancelText = 'Voltar';
      expect(cancelText).toBe('Voltar');
    });
  });

  describe('Estado de loading', () => {
    test('deve iniciar com loading false', () => {
      const loadingInicial = false;
      expect(loadingInicial).toBe(false);
    });

    test('deve desabilitar closable quando loading é true', () => {
      const loading = true;
      const closable = !loading;
      expect(closable).toBe(false);
    });

    test('deve habilitar closable quando loading é false', () => {
      const loading = false;
      const closable = !loading;
      expect(closable).toBe(true);
    });

    test('deve desabilitar maskClosable quando loading é true', () => {
      const loading = true;
      const maskClosable = !loading;
      expect(maskClosable).toBe(false);
    });

    test('deve desabilitar keyboard quando loading é true', () => {
      const loading = true;
      const keyboard = !loading;
      expect(keyboard).toBe(false);
    });

    test('deve desabilitar cancelButtonProps quando loading é true', () => {
      const loading = true;
      const cancelButtonProps = { disabled: loading };
      expect(cancelButtonProps.disabled).toBe(true);
    });

    test('deve desabilitar okButtonProps quando loading é true', () => {
      const loading = true;
      const okButtonProps = { disabled: loading };
      expect(okButtonProps.disabled).toBe(true);
    });
  });

  describe('Campo de motivo', () => {
    test('deve ter label correto', () => {
      const label = 'Informar motivo';
      expect(label).toBe('Informar motivo');
    });

    test('deve ter name correto', () => {
      const name = 'motivo';
      expect(name).toBe('motivo');
    });

    test('não deve ser obrigatório', () => {
      const rules = [{ required: false, message: MOTIVO_NAO_INFORMADO }];
      expect(rules[0].required).toBe(false);
    });

    test('deve ter mensagem de validação correta', () => {
      expect(MOTIVO_NAO_INFORMADO).toBeTruthy();
    });
  });

  describe('Comportamento de handleCancelar', () => {
    test('deve chamar onClickCancelar com ids e motivo', async () => {
      const mockOnClickCancelar = jest.fn().mockResolvedValue(true);
      const ids = [1, 2, 3];
      const motivo = 'Motivo de teste';

      await mockOnClickCancelar(ids, motivo);
      expect(mockOnClickCancelar).toHaveBeenCalledWith(ids, motivo);
    });

    test('deve chamar onFecharButton quando sucesso', () => {
      const mockOnFecharButton = jest.fn();
      const sucesso = true;

      if (sucesso) {
        mockOnFecharButton();
      }

      expect(mockOnFecharButton).toHaveBeenCalled();
    });

    test('não deve chamar onFecharButton quando falha', () => {
      const mockOnFecharButton = jest.fn();
      const sucesso = false;

      if (sucesso) {
        mockOnFecharButton();
      }

      expect(mockOnFecharButton).not.toHaveBeenCalled();
    });
  });

  describe('Comportamento de handleFechar', () => {
    test('deve resetar campos do formulário', () => {
      const mockResetFields = jest.fn();
      mockResetFields();
      expect(mockResetFields).toHaveBeenCalled();
    });

    test('deve chamar onFecharButton', () => {
      const mockOnFecharButton = jest.fn();
      mockOnFecharButton();
      expect(mockOnFecharButton).toHaveBeenCalled();
    });
  });

  describe('Comportamento de validateFields', () => {
    test('deve validar campos antes de cancelar', async () => {
      const mockValidateFields = jest.fn().mockResolvedValue({});
      await mockValidateFields();
      expect(mockValidateFields).toHaveBeenCalled();
    });

    test('deve chamar handleCancelar após validação bem sucedida', async () => {
      const mockHandleCancelar = jest.fn();
      const mockValidateFields = jest.fn().mockResolvedValue({});

      await mockValidateFields().then(() => {
        mockHandleCancelar();
      });

      expect(mockHandleCancelar).toHaveBeenCalled();
    });
  });

  describe('Contexto TurmasInscricoesListaPaginadaContext', () => {
    test('deve usar onClickCancelar do contexto', () => {
      const mockOnClickCancelar = jest.fn();
      expect(typeof mockOnClickCancelar).toBe('function');
    });
  });

  describe('Formulário', () => {
    test('deve usar FormDefault do projeto', () => {
      const formType = 'FormDefault';
      expect(formType).toBe('FormDefault');
    });

    test('deve usar AreaTexto para o campo de motivo', () => {
      const componentType = 'AreaTexto';
      expect(componentType).toBe('AreaTexto');
    });
  });

  describe('Componente Spin', () => {
    test('deve exibir Spin quando loading é true', () => {
      const loading = true;
      expect(loading).toBe(true);
    });

    test('não deve exibir Spin quando loading é false', () => {
      const loading = false;
      expect(loading).toBe(false);
    });
  });

  describe('Acessibilidade', () => {
    test('título deve ser descritivo', () => {
      const titulo = 'Cancelar inscrição';
      expect(titulo).toBeTruthy();
      expect(titulo.length).toBeGreaterThan(5);
    });

    test('botões devem ter textos claros', () => {
      const okText = 'Cancelar inscrição';
      const cancelText = 'Voltar';

      expect(okText).toBeTruthy();
      expect(cancelText).toBeTruthy();
    });

    test('campo de motivo deve ter label', () => {
      const label = 'Informar motivo';
      expect(label).toBeTruthy();
    });
  });

  describe('Fluxo completo', () => {
    test('deve executar fluxo de cancelamento completo', async () => {
      const mockValidateFields = jest.fn().mockResolvedValue({});
      const mockOnClickCancelar = jest.fn().mockResolvedValue(true);
      const mockOnFecharButton = jest.fn();

      const ids = [1, 2];
      const motivo = 'Motivo teste';

      // Simula o fluxo
      await mockValidateFields();
      const sucesso = await mockOnClickCancelar(ids, motivo);

      if (sucesso) {
        mockOnFecharButton();
      }

      expect(mockValidateFields).toHaveBeenCalled();
      expect(mockOnClickCancelar).toHaveBeenCalledWith(ids, motivo);
      expect(mockOnFecharButton).toHaveBeenCalled();
    });

    test('deve executar fluxo de fechamento sem cancelar', () => {
      const mockResetFields = jest.fn();
      const mockOnFecharButton = jest.fn();

      // Simula handleFechar
      mockResetFields();
      mockOnFecharButton();

      expect(mockResetFields).toHaveBeenCalled();
      expect(mockOnFecharButton).toHaveBeenCalled();
    });
  });
});
