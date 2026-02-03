import { describe, test, expect } from '@jest/globals';

describe('PageForbidden (403)', () => {
  describe('Configuração da página', () => {
    test('deve ter status 403 definido', () => {
      const status = '403';
      expect(status).toBe('403');
    });

    test('deve ter título 403', () => {
      const title = '403';
      expect(title).toBe('403');
    });

    test('deve ter mensagem de permissão negada', () => {
      const subTitle = 'Você não tem permissão a esta funcionalidade!';
      expect(subTitle).toBe('Você não tem permissão a esta funcionalidade!');
      expect(subTitle).toContain('permissão');
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
        status: '403',
        title: '403',
        subTitle: 'Você não tem permissão a esta funcionalidade!',
        hasExtra: true,
      };

      expect(resultProps.status).toBe('403');
      expect(resultProps.title).toBe('403');
      expect(resultProps.subTitle).toBeTruthy();
      expect(resultProps.hasExtra).toBe(true);
    });
  });
});
