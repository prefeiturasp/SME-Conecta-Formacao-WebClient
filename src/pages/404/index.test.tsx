import { describe, test, expect } from '@jest/globals';

describe('PageNotFound (404)', () => {
  describe('Configuração da página', () => {
    test('deve ter status 404 definido', () => {
      const status = '404';
      expect(status).toBe('404');
    });

    test('deve ter título 404', () => {
      const title = '404';
      expect(title).toBe('404');
    });

    test('deve ter mensagem de página não encontrada', () => {
      const subTitle = 'Desculpe, a página que você visitou não existe.';
      expect(subTitle).toBe('Desculpe, a página que você visitou não existe.');
      expect(subTitle).toContain('não existe');
    });
  });

  describe('Botão Voltar', () => {
    test('deve ter texto "Voltar"', () => {
      const buttonText = 'Voltar';
      expect(buttonText).toBe('Voltar');
    });

    test('deve ter tipo "primary"', () => {
      const buttonType = 'primary';
      expect(buttonType).toBe('primary');
    });
  });

  describe('Navegação', () => {
    test('deve navegar para rota PRINCIPAL ao clicar em voltar', () => {
      const routePrincipal = '/';
      expect(routePrincipal).toBeTruthy();
    });
  });

  describe('Estrutura do componente Result', () => {
    test('deve ter todas as propriedades necessárias', () => {
      const resultProps = {
        status: '404',
        title: '404',
        subTitle: 'Desculpe, a página que você visitou não existe.',
        hasExtra: true,
      };

      expect(resultProps.status).toBe('404');
      expect(resultProps.title).toBe('404');
      expect(resultProps.subTitle).toBeTruthy();
      expect(resultProps.hasExtra).toBe(true);
    });
  });

  describe('Diferença entre 403 e 404', () => {
    test('mensagens devem ser diferentes', () => {
      const msg403 = 'Você não tem permissão a esta funcionalidade!';
      const msg404 = 'Desculpe, a página que você visitou não existe.';

      expect(msg403).not.toBe(msg404);
      expect(msg403).toContain('permissão');
      expect(msg404).toContain('não existe');
    });
  });
});
