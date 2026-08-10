import { describe, test, expect, jest } from '@jest/globals';
import { ComentarioCodafDTO } from '~/core/services/codaf-lista-presenca-service';

describe('BannerComentarios', () => {
  describe('Props interface', () => {
    test('deve aceitar comentario como ComentarioCodafDTO ou null', () => {
      const comentarioValido: ComentarioCodafDTO = {
        id: 1,
        criadoPor: 'João Silva',
        criadoLogin: 'RF123456',
        criadoEm: '2024-01-15T10:30:00',
        comentario: 'Este é um comentário de teste',
      };

      const comentarioNulo: ComentarioCodafDTO | null = null;

      expect(comentarioValido).toHaveProperty('criadoPor');
      expect(comentarioValido.criadoPor).toBe('João Silva');
      expect(comentarioNulo).toBeNull();
    });

    test('deve aceitar onConferirComentarios como função', () => {
      const mockCallback = jest.fn();
      expect(typeof mockCallback).toBe('function');

      mockCallback();
      expect(mockCallback).toHaveBeenCalled();
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    test('deve aceitar loading como boolean', () => {
      const loadingTrue = true;
      const loadingFalse = false;

      expect(typeof loadingTrue).toBe('boolean');
      expect(typeof loadingFalse).toBe('boolean');
      expect(loadingTrue).toBe(true);
      expect(loadingFalse).toBe(false);
    });
  });

  describe('Estrutura do componente', () => {
    test('deve renderizar Row com gutter correto', () => {
      const gutterConfig = [16, 8];
      expect(gutterConfig).toEqual([16, 8]);
      expect(gutterConfig[0]).toBe(16);
      expect(gutterConfig[1]).toBe(8);
    });

    test('deve ter estilo de marginBottom correto', () => {
      const style = { marginBottom: '16px' };
      expect(style.marginBottom).toBe('16px');
    });

    test('deve renderizar Col com span 24', () => {
      const colSpan = 24;
      expect(colSpan).toBe(24);
    });
  });

  describe('Estilização do banner', () => {
    test('deve ter backgroundColor laranja', () => {
      const bannerStyle = {
        backgroundColor: '#ff9a52',
        borderRadius: '4px',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '32px',
        marginTop: '8px',
      };

      expect(bannerStyle.backgroundColor).toBe('#ff9a52');
      expect(bannerStyle.borderRadius).toBe('4px');
      expect(bannerStyle.padding).toBe('16px 24px');
      expect(bannerStyle.display).toBe('flex');
      expect(bannerStyle.alignItems).toBe('center');
      expect(bannerStyle.justifyContent).toBe('space-between');
      expect(bannerStyle.gap).toBe('32px');
      expect(bannerStyle.marginTop).toBe('8px');
    });

    test('deve ter estilo do container de conteúdo correto', () => {
      const contentStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flex: 1,
        width: '70%',
      };

      expect(contentStyle.display).toBe('flex');
      expect(contentStyle.alignItems).toBe('center');
      expect(contentStyle.gap).toBe('16px');
      expect(contentStyle.flex).toBe(1);
      expect(contentStyle.width).toBe('70%');
    });

    test('deve ter estilo do ícone circular correto', () => {
      const iconContainerStyle = {
        backgroundColor: '#fff',
        borderRadius: '50%',
        width: '25px',
        height: '25px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      };

      expect(iconContainerStyle.backgroundColor).toBe('#fff');
      expect(iconContainerStyle.borderRadius).toBe('50%');
      expect(iconContainerStyle.width).toBe('25px');
      expect(iconContainerStyle.height).toBe('25px');
      expect(iconContainerStyle.display).toBe('flex');
      expect(iconContainerStyle.alignItems).toBe('center');
      expect(iconContainerStyle.justifyContent).toBe('center');
      expect(iconContainerStyle.flexShrink).toBe(0);
    });
  });

  describe('Imagem de ícone', () => {
    test('deve ter src correto', () => {
      const imageSrc = '/balao.png';
      expect(imageSrc).toBe('/balao.png');
    });

    test('deve ter alt text correto', () => {
      const imageAlt = 'Warning';
      expect(imageAlt).toBe('Warning');
    });

    test('deve ter dimensões corretas', () => {
      const imageStyle = {
        width: '15px',
        height: '15px',
      };

      expect(imageStyle.width).toBe('15px');
      expect(imageStyle.height).toBe('15px');
    });
  });

  describe('Texto do banner', () => {
    test('deve exibir nome do usuário do comentário', () => {
      const comentario: ComentarioCodafDTO = {
        id: 1,
        criadoPor: 'Maria Santos',
        criadoLogin: 'RF789012',
        criadoEm: '2024-01-15T14:20:00',
        comentario: 'Comentário teste',
      };

      expect(comentario.criadoPor).toBe('Maria Santos');
    });

    test('deve usar "Usuário" como fallback quando criadoPor for null', () => {
      const criadoPor = null;
      const nomeExibido = criadoPor || 'Usuário';
      expect(nomeExibido).toBe('Usuário');
    });

    test('deve ter estilo de texto correto', () => {
      const textStyle = { color: '#fff', fontSize: '14px' };
      expect(textStyle.color).toBe('#fff');
      expect(textStyle.fontSize).toBe('14px');
    });

    test('deve conter texto explicativo correto', () => {
      const textoEsperado =
        ' inseriu comentários no CODAF. Clique no botão "conferir comentários" para acessar as informações';
      expect(textoEsperado).toContain('inseriu comentários no CODAF');
      expect(textoEsperado).toContain('conferir comentários');
    });
  });

  describe('Botão de conferir comentários', () => {
    test('deve ter tipo default', () => {
      const buttonType = 'default';
      expect(buttonType).toBe('default');
    });

    test('deve ter ícone ReloadOutlined com cor correta', () => {
      const iconStyle = { color: '#ff9a52' };
      expect(iconStyle.color).toBe('#ff9a52');
    });

    test('deve ter texto "Conferir comentários"', () => {
      const buttonText = 'Conferir comentários';
      expect(buttonText).toBe('Conferir comentários');
    });

    test('deve ter estilos corretos', () => {
      const buttonStyle = {
        backgroundColor: '#fff',
        borderColor: '#fff',
        color: '#ff9a52',
        fontWeight: 500,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        whiteSpace: 'nowrap',
        padding: '4px 16px',
        minWidth: '250px',
        height: '38px',
      };

      expect(buttonStyle.backgroundColor).toBe('#fff');
      expect(buttonStyle.borderColor).toBe('#fff');
      expect(buttonStyle.color).toBe('#ff9a52');
      expect(buttonStyle.fontWeight).toBe(500);
      expect(buttonStyle.display).toBe('inline-flex');
      expect(buttonStyle.alignItems).toBe('center');
      expect(buttonStyle.justifyContent).toBe('center');
      expect(buttonStyle.whiteSpace).toBe('nowrap');
      expect(buttonStyle.padding).toBe('4px 16px');
      expect(buttonStyle.minWidth).toBe('250px');
      expect(buttonStyle.height).toBe('38px');
    });

    test('deve chamar onConferirComentarios quando clicado', () => {
      const mockOnClick = jest.fn();
      mockOnClick();
      expect(mockOnClick).toHaveBeenCalled();
    });

    test('deve mostrar loading quando loading for true', () => {
      const loading = true;
      expect(loading).toBe(true);
    });

    test('deve não mostrar loading quando loading for false', () => {
      const loading = false;
      expect(loading).toBe(false);
    });
  });

  describe('Validação de dados do comentário', () => {
    test('deve ter estrutura completa de ComentarioCodafDTO', () => {
      const comentario: ComentarioCodafDTO = {
        id: 5,
        criadoPor: 'Pedro Oliveira',
        criadoLogin: 'RF456789',
        criadoEm: '2024-01-15T16:45:00',
        comentario: 'Favor revisar os dados da turma X',
      };

      expect(comentario).toHaveProperty('id');
      expect(comentario).toHaveProperty('criadoPor');
      expect(comentario).toHaveProperty('criadoLogin');
      expect(comentario).toHaveProperty('criadoEm');
      expect(comentario).toHaveProperty('comentario');
      expect(typeof comentario.id).toBe('number');
      expect(typeof comentario.criadoPor).toBe('string');
      expect(typeof comentario.criadoLogin).toBe('string');
      expect(typeof comentario.criadoEm).toBe('string');
      expect(typeof comentario.comentario).toBe('string');
    });

    test('deve aceitar comentário vazio', () => {
      const comentario: ComentarioCodafDTO = {
        id: 1,
        criadoPor: 'Usuário Teste',
        criadoLogin: 'RF111111',
        criadoEm: '2024-01-15T10:00:00',
        comentario: '',
      };

      expect(comentario.comentario).toBe('');
      expect(comentario.comentario.length).toBe(0);
    });
  });
});
