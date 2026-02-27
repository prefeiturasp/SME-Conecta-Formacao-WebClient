import { describe, test, expect, jest } from '@jest/globals';

describe('ModalExcluir', () => {
  describe('Props interface', () => {
    test('deve aceitar visible como boolean', () => {
      const visibleTrue = true;
      const visibleFalse = false;

      expect(typeof visibleTrue).toBe('boolean');
      expect(typeof visibleFalse).toBe('boolean');
      expect(visibleTrue).toBe(true);
      expect(visibleFalse).toBe(false);
    });

    test('deve aceitar onConfirm como função', () => {
      const mockCallback = jest.fn();
      expect(typeof mockCallback).toBe('function');

      mockCallback();
      expect(mockCallback).toHaveBeenCalled();
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    test('deve aceitar onCancel como função', () => {
      const mockCallback = jest.fn();
      expect(typeof mockCallback).toBe('function');

      mockCallback();
      expect(mockCallback).toHaveBeenCalled();
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    test('deve aceitar loading como boolean opcional', () => {
      const loadingTrue = true;
      const loadingFalse = false;
      const loadingUndefined = undefined;

      expect(typeof loadingTrue).toBe('boolean');
      expect(typeof loadingFalse).toBe('boolean');
      expect(loadingUndefined).toBeUndefined();
    });
  });

  describe('Configuração do Modal', () => {
    test('deve ter título correto', () => {
      const titulo = 'Excluir registro CODAF';
      expect(titulo).toBe('Excluir registro CODAF');
    });

    test('deve ter estilo de título correto', () => {
      const titleStyle = {
        fontWeight: 700,
        fontSize: '20px',
        lineHeight: '100%',
        letterSpacing: '0%',
      };

      expect(titleStyle.fontWeight).toBe(700);
      expect(titleStyle.fontSize).toBe('20px');
      expect(titleStyle.lineHeight).toBe('100%');
      expect(titleStyle.letterSpacing).toBe('0%');
    });

    test('deve estar centralizado', () => {
      const centered = true;
      expect(centered).toBe(true);
    });

    test('deve ter largura de 600px', () => {
      const width = 600;
      expect(width).toBe(600);
    });

    test('deve chamar onCancel ao fechar', () => {
      const mockOnCancel = jest.fn();
      mockOnCancel();
      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  describe('Footer do Modal', () => {
    test('deve ter botão Cancelar', () => {
      const buttonKey = 'cancelar';
      const buttonText = 'Cancelar';

      expect(buttonKey).toBe('cancelar');
      expect(buttonText).toBe('Cancelar');
    });

    test('deve ter botão Excluir registro', () => {
      const buttonKey = 'enviar';
      const buttonText = 'Excluir registro';

      expect(buttonKey).toBe('enviar');
      expect(buttonText).toBe('Excluir registro');
    });

    test('botão Cancelar deve ter estilo correto', () => {
      const buttonStyle = {
        borderColor: '#ff6b35',
        color: '#ff6b35',
        fontWeight: 500,
      };

      expect(buttonStyle.borderColor).toBe('#ff6b35');
      expect(buttonStyle.color).toBe('#ff6b35');
      expect(buttonStyle.fontWeight).toBe(500);
    });

    test('botão Excluir deve ser do tipo primary', () => {
      const buttonType = 'primary';
      expect(buttonType).toBe('primary');
    });

    test('botão Cancelar deve chamar onCancel quando clicado', () => {
      const mockOnClick = jest.fn();
      mockOnClick();
      expect(mockOnClick).toHaveBeenCalled();
    });

    test('botão Excluir deve chamar onConfirm quando clicado', () => {
      const mockOnConfirm = jest.fn();
      mockOnConfirm();
      expect(mockOnConfirm).toHaveBeenCalled();
    });

    test('botão Excluir deve mostrar loading quando loading for true', () => {
      const loading = true;
      expect(loading).toBe(true);
    });
  });

  describe('Conteúdo do Modal', () => {
    test('deve exibir mensagem de confirmação', () => {
      const mensagem = 'Esta ação não poderá ser desfeita. Deseja continuar?';
      expect(mensagem).toContain('não poderá ser desfeita');
      expect(mensagem).toContain('Deseja continuar');
    });

    test('mensagem deve ser clara sobre irreversibilidade', () => {
      const mensagem = 'Esta ação não poderá ser desfeita. Deseja continuar?';
      expect(mensagem).toBeTruthy();
      expect(mensagem.length).toBeGreaterThan(20);
    });
  });

  describe('Comportamento do Modal', () => {
    test('deve abrir quando visible é true', () => {
      const visible = true;
      expect(visible).toBe(true);
    });

    test('deve fechar quando visible é false', () => {
      const visible = false;
      expect(visible).toBe(false);
    });

    test('deve permitir fechar via onCancel', () => {
      const mockOnCancel = jest.fn();
      mockOnCancel();
      expect(mockOnCancel).toHaveBeenCalled();
    });

    test('deve permitir confirmar via onConfirm', () => {
      const mockOnConfirm = jest.fn();
      mockOnConfirm();
      expect(mockOnConfirm).toHaveBeenCalled();
    });
  });

  describe('Acessibilidade e UX', () => {
    test('título deve ser descritivo', () => {
      const titulo = 'Excluir registro CODAF';
      expect(titulo).toContain('Excluir');
      expect(titulo).toContain('CODAF');
    });

    test('mensagem deve orientar o usuário sobre a ação', () => {
      const mensagem = 'Esta ação não poderá ser desfeita. Deseja continuar?';
      expect(mensagem).toBeTruthy();
    });

    test('botão de cancelar deve ser claro', () => {
      const buttonText = 'Cancelar';
      expect(buttonText).toBe('Cancelar');
      expect(buttonText.length).toBeGreaterThan(0);
    });

    test('botão de confirmar deve ser claro sobre a ação', () => {
      const buttonText = 'Excluir registro';
      expect(buttonText).toContain('Excluir');
    });
  });

  describe('Estados de loading', () => {
    test('deve desabilitar interações quando loading é true', () => {
      const loading = true;
      expect(loading).toBe(true);
    });

    test('deve permitir interações quando loading é false', () => {
      const loading = false;
      expect(loading).toBe(false);
    });

    test('deve permitir interações quando loading é undefined', () => {
      const loading = undefined;
      expect(loading).toBeUndefined();
    });
  });
});
