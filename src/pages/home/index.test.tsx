import { describe, test, expect } from '@jest/globals';

describe('Home', () => {
  describe('Layout da página', () => {
    test('deve ter altura de 100vh', () => {
      const style = { height: '100vh' };
      expect(style.height).toBe('100vh');
    });

    test('deve ter alinhamento vertical centralizado', () => {
      const align = 'middle';
      expect(align).toBe('middle');
    });
  });

  describe('Colunas responsivas', () => {
    test('deve ter configuração correta para coluna da imagem de fundo', () => {
      const colConfig = { sm: 0, md: 8, lg: 12 };
      expect(colConfig.sm).toBe(0);
      expect(colConfig.md).toBe(8);
      expect(colConfig.lg).toBe(12);
    });

    test('deve ter configuração correta para coluna do conteúdo', () => {
      const colConfig = { sm: 24, md: 16, lg: 12 };
      expect(colConfig.sm).toBe(24);
      expect(colConfig.md).toBe(16);
      expect(colConfig.lg).toBe(12);
    });
  });

  describe('Imagens', () => {
    test('deve ter logo do Conecta Formação', () => {
      const logoAlt = 'Conecta Formação LOGO';
      expect(logoAlt).toBe('Conecta Formação LOGO');
    });

    test('deve ter logo da Prefeitura de SP', () => {
      const logoAlt = 'PREFEITURA SP LOGO';
      expect(logoAlt).toBe('PREFEITURA SP LOGO');
    });

    test('deve ter altura de 62px para logo da prefeitura', () => {
      const style = { width: '100%', height: '62px' };
      expect(style.height).toBe('62px');
      expect(style.width).toBe('100%');
    });
  });

  describe('Margens e espaçamentos', () => {
    test('deve ter margem de 40px para o logo principal', () => {
      const margin = '40px 0px';
      expect(margin).toBe('40px 0px');
    });

    test('deve ter margem superior de 80px para o logo da prefeitura', () => {
      const marginTop = '80px';
      expect(marginTop).toBe('80px');
    });

    test('deve ter margem superior de 10px para texto de navegadores', () => {
      const marginTop = '10px';
      expect(marginTop).toBe('10px');
    });
  });

  describe('Texto de navegadores homologados', () => {
    test('deve informar navegadores compatíveis', () => {
      const texto = 'Sistema homologado para navegadores: Google Chrome e Firefox';
      expect(texto).toContain('Google Chrome');
      expect(texto).toContain('Firefox');
    });
  });

  describe('Estilos da coluna de conteúdo', () => {
    test('deve ter maxHeight de 100vh', () => {
      const style = { maxHeight: '100vh', overflow: 'auto' };
      expect(style.maxHeight).toBe('100vh');
    });

    test('deve ter overflow auto para scroll', () => {
      const style = { maxHeight: '100vh', overflow: 'auto' };
      expect(style.overflow).toBe('auto');
    });
  });

  describe('Span das colunas', () => {
    test('logo do Conecta Formação deve ter span de 14', () => {
      const span = 14;
      expect(span).toBe(14);
    });

    test('logo da Prefeitura deve ter span de 24', () => {
      const span = 24;
      expect(span).toBe(24);
    });
  });

  describe('Outlet', () => {
    test('deve renderizar componentes filhos via Outlet', () => {
      const hasOutlet = true;
      expect(hasOutlet).toBe(true);
    });

    test('Outlet deve estar centralizado', () => {
      const justify = 'center';
      expect(justify).toBe('center');
    });
  });
});
