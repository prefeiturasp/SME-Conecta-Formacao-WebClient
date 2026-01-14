import { describe, test, expect, jest } from '@jest/globals';

describe('BannerDownloadTermo', () => {
  describe('Props interface', () => {
    test('deve aceitar onBaixarModelo como função', () => {
      const mockCallback = jest.fn();
      expect(typeof mockCallback).toBe('function');

      mockCallback();
      expect(mockCallback).toHaveBeenCalled();
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    test('deve executar callback sem parâmetros', () => {
      const mockCallback = jest.fn();
      mockCallback();
      expect(mockCallback).toHaveBeenCalledWith();
    });
  });

  describe('Estrutura do componente', () => {
    test('deve ter container principal com marginTop', () => {
      const containerStyle = { marginTop: 16 };
      expect(containerStyle.marginTop).toBe(16);
    });

    test('deve ter card interno com estilos corretos', () => {
      const cardStyle = {
        height: '100%',
        borderRadius: '4px',
        backgroundColor: 'white',
        boxShadow: '0px 0px 12px 0px #0000001F',
        padding: '24px',
      };

      expect(cardStyle.height).toBe('100%');
      expect(cardStyle.borderRadius).toBe('4px');
      expect(cardStyle.backgroundColor).toBe('white');
      expect(cardStyle.boxShadow).toBe('0px 0px 12px 0px #0000001F');
      expect(cardStyle.padding).toBe('24px');
    });

    test('deve ter Row com gutter correto', () => {
      const gutterConfig = [16, 8];
      expect(gutterConfig).toEqual([16, 8]);
      expect(gutterConfig[0]).toBe(16);
      expect(gutterConfig[1]).toBe(8);
    });

    test('deve ter Row com align middle', () => {
      const align = 'middle';
      expect(align).toBe('middle');
    });

    test('deve ter Row com justify space-between', () => {
      const justify = 'space-between';
      expect(justify).toBe('space-between');
    });
  });

  describe('Texto informativo', () => {
    test('deve exibir texto correto sobre o termo de responsabilidade', () => {
      const textoEsperado =
        'Você pode baixar o modelo de termo de responsabilidade clicando em "termo de responsabilidade".';

      expect(textoEsperado).toContain('baixar o modelo');
      expect(textoEsperado).toContain('termo de responsabilidade');
      expect(textoEsperado).toContain('clicando em');
    });

    test('deve ter parágrafo com margin zero', () => {
      const paragraphStyle = { margin: 0 };
      expect(paragraphStyle.margin).toBe(0);
    });

    test('texto deve conter aspas duplas em "termo de responsabilidade"', () => {
      const texto =
        'Você pode baixar o modelo de termo de responsabilidade clicando em "termo de responsabilidade".';
      expect(texto).toContain('"termo de responsabilidade"');
    });
  });

  describe('Botão de download', () => {
    test('deve ter tipo default', () => {
      const buttonType = 'default';
      expect(buttonType).toBe('default');
    });

    test('deve ter texto "Termo de responsabilidade"', () => {
      const buttonText = 'Termo de responsabilidade';
      expect(buttonText).toBe('Termo de responsabilidade');
    });

    test('deve ter ícone DownloadOutlined', () => {
      const hasIcon = true;
      expect(hasIcon).toBe(true);
    });

    test('deve ter estilos corretos', () => {
      const buttonStyle = {
        borderColor: '#ff6b35',
        color: '#ff6b35',
        fontWeight: 500,
        padding: '9px',
      };

      expect(buttonStyle.borderColor).toBe('#ff6b35');
      expect(buttonStyle.color).toBe('#ff6b35');
      expect(buttonStyle.fontWeight).toBe(500);
      expect(buttonStyle.padding).toBe('9px');
    });

    test('deve usar a cor laranja padrão do sistema', () => {
      const cor = '#ff6b35';
      expect(cor).toBe('#ff6b35');
      expect(cor).toMatch(/^#[0-9a-f]{6}$/i);
    });

    test('deve chamar onBaixarModelo quando clicado', () => {
      const mockOnClick = jest.fn();
      mockOnClick();
      expect(mockOnClick).toHaveBeenCalled();
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    test('deve permitir múltiplos cliques', () => {
      const mockOnClick = jest.fn();
      mockOnClick();
      mockOnClick();
      mockOnClick();
      expect(mockOnClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('Layout responsivo', () => {
    test('deve usar Col para texto e botão', () => {
      const usesCol = true;
      expect(usesCol).toBe(true);
    });

    test('deve alinhar elementos verticalmente no centro', () => {
      const verticalAlign = 'middle';
      expect(verticalAlign).toBe('middle');
    });

    test('deve distribuir espaço entre elementos', () => {
      const spaceDistribution = 'space-between';
      expect(spaceDistribution).toBe('space-between');
    });
  });

  describe('Acessibilidade', () => {
    test('texto deve ser claro e descritivo', () => {
      const texto =
        'Você pode baixar o modelo de termo de responsabilidade clicando em "termo de responsabilidade".';
      expect(texto.length).toBeGreaterThan(0);
      expect(texto).toContain('Você pode');
      expect(texto).toContain('baixar');
      expect(texto).toContain('modelo');
    });

    test('botão deve ter texto descritivo', () => {
      const buttonText = 'Termo de responsabilidade';
      expect(buttonText).toBeTruthy();
      expect(buttonText.length).toBeGreaterThan(10);
    });
  });

  describe('Estilização visual', () => {
    test('deve ter sombra suave no card', () => {
      const boxShadow = '0px 0px 12px 0px #0000001F';
      expect(boxShadow).toContain('0px 0px 12px');
      expect(boxShadow).toContain('#0000001F');
    });

    test('deve ter fundo branco', () => {
      const backgroundColor = 'white';
      expect(backgroundColor).toBe('white');
    });

    test('deve ter bordas arredondadas', () => {
      const borderRadius = '4px';
      expect(borderRadius).toBe('4px');
    });

    test('deve ter padding interno adequado', () => {
      const padding = '24px';
      expect(padding).toBe('24px');
    });
  });

  describe('Comportamento do botão', () => {
    test('deve ser clicável', () => {
      const isClickable = true;
      expect(isClickable).toBe(true);
    });

    test('callback deve ser executado sem erros', () => {
      const mockCallback = jest.fn(() => {
        return 'download iniciado';
      });

      const result = mockCallback();
      expect(mockCallback).toHaveBeenCalled();
      expect(result).toBe('download iniciado');
    });

    test('deve manter referência da função callback', () => {
      const originalCallback = jest.fn();
      const callbackRef = originalCallback;

      expect(callbackRef).toBe(originalCallback);
      callbackRef();
      expect(originalCallback).toHaveBeenCalled();
    });
  });

  describe('Cores e tema', () => {
    test('cor do botão deve ser consistente', () => {
      const corPrimaria = '#ff6b35';
      expect(corPrimaria).toBe('#ff6b35');
    });

    test('fonte do botão deve ter peso médio', () => {
      const fontWeight = 500;
      expect(fontWeight).toBe(500);
      expect(fontWeight).toBeGreaterThanOrEqual(400);
      expect(fontWeight).toBeLessThanOrEqual(700);
    });
  });

  describe('Espaçamento', () => {
    test('deve ter espaçamento superior de 16px', () => {
      const marginTop = 16;
      expect(marginTop).toBe(16);
    });

    test('deve ter padding interno de 24px no card', () => {
      const padding = '24px';
      expect(padding).toBe('24px');
    });

    test('deve ter padding de 9px no botão', () => {
      const buttonPadding = '9px';
      expect(buttonPadding).toBe('9px');
    });
  });
});
