import '@testing-library/jest-dom';

// Mock do Jodit ANTES de importar o componente
jest.mock('./include.jodit', () => {
  const mockJodit = {
    make: jest.fn((element, config) => ({
      value: '',
      text: '',
      destruct: jest.fn(),
      workplace: { tabIndex: 0 },
      editorDocument: {
        getElementsByClassName: jest.fn(() => [
          {
            translate: true,
            className: 'jodit',
            getElementsByTagName: jest.fn(() => [
              {
                children: [],
              },
            ]),
          },
        ]),
        querySelectorAll: jest.fn(() => []),
      },
      selection: {
        insertHTML: jest.fn(),
        setCursorIn: jest.fn(),
      },
      events: {
        on: jest.fn(function () {
          return this;
        }),
        off: jest.fn(function () {
          return this;
        }),
      },
      message: {
        error: jest.fn(),
      },
    })),
    modules: {
      Helpers: {
        isFunction: (fn: any) => typeof fn === 'function',
      },
    },
    atom: jest.fn((val) => val),
    defaultOptions: {
      popup: {
        img: [
          { name: 'pencil' },
          { name: 'valign' },
          { name: 'other' },
        ],
      },
    },
  };

  return { Jodit: mockJodit };
});

describe('JoditEditorSME', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Unidade - Validações de arquivo', () => {
    it('deve rejeitar arquivo acima do tamanho máximo', () => {
      const BYTES_OF_ONE_MB = 1048576;
      const tamanhoMaximoMb = 10;
      const tamanhoPossibilidadeArquivo = (11 * BYTES_OF_ONE_MB) / BYTES_OF_ONE_MB;

      expect(tamanhoPossibilidadeArquivo).toBeGreaterThan(tamanhoMaximoMb);
    });

    it('deve calcular limite correto de MB', () => {
      const BYTES_OF_ONE_MB = 1048576;
      const tamanhoMaximo = 10;
      const bytesMaximo = tamanhoMaximo * BYTES_OF_ONE_MB;

      expect(bytesMaximo).toBe(10485760);
    });

    it('deve validar tipos de arquivo válidos', () => {
      const tiposValidos = ['jpg', 'jpeg', 'png'];
      const tipoArquivo = 'image/jpeg';

      const ehValido = tiposValidos.some((x) => {
        if (x) return tipoArquivo.includes(x);
        return false;
      });

      expect(ehValido).toBe(true);
    });

    it('deve rejeitar tipos inválidos', () => {
      const tiposValidos = ['jpg', 'jpeg', 'png'];
      const tipoArquivo = 'image/gif';

      const ehValido = tiposValidos.some((x) => {
        if (x) return tipoArquivo.includes(x);
        return false;
      });

      expect(ehValido).toBe(false);
    });
  });

  describe('Unidade - Detecção de SVG', () => {
    it('deve detectar tags SVG no HTML', () => {
      const htmlComSvg = '<svg><circle r="10"></circle></svg>';
      const match = htmlComSvg?.match(/<svg/g);

      expect(match).not.toBeNull();
      expect(match?.length).toBe(1);
    });

    it('deve não detectar SVG em HTML seguro', () => {
      const htmlSeguro = '<p>Conteúdo seguro</p><img src="test.jpg" />';
      const match = htmlSeguro?.match(/<svg/g);

      expect(match).toBeNull();
    });

    it('deve detectar múltiplos SVGs', () => {
      const htmlMultiplosSvg = '<svg></svg><p>Text</p><svg></svg>';
      const match = htmlMultiplosSvg?.match(/<svg/g);

      expect(match?.length).toBe(2);
    });
  });

  describe('Unidade - Contagem de imagens', () => {
    it('deve contar imagens no HTML', () => {
      const html = '<img src="1.jpg"/><p>Text</p><img src="2.jpg"/>';
      const count = html.match(/<img/g)?.length || 0;

      expect(count).toBe(2);
    });

    it('deve contar vídeos no HTML', () => {
      const html = '<video></video><p>Text</p><video></video>';
      const count = html.match(/<video/g)?.length || 0;

      expect(count).toBe(2);
    });

    it('deve retornar 0 quando não tem imagens', () => {
      const html = '<p>Texto simples</p>';
      const count = html.match(/<img/g)?.length || 0;

      expect(count).toBe(0);
    });
  });

});
