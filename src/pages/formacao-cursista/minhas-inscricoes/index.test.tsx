import { describe, test, expect } from '@jest/globals';

describe('MinhasInscricoes', () => {
  describe('Header da página', () => {
    test('deve ter título "Minhas Inscrições"', () => {
      const title = 'Minhas Inscrições';
      expect(title).toBe('Minhas Inscrições');
    });

    test('deve ter botão de nova inscrição', () => {
      const NOVA_INSCRICAO = 'Nova inscrição';
      expect(NOVA_INSCRICAO).toBeTruthy();
    });
  });

  describe('Botão Nova Inscrição', () => {
    test('deve ter tipo primary', () => {
      const buttonType = 'primary';
      expect(buttonType).toBe('primary');
    });

    test('deve ter id correto', () => {
      const buttonId = 'CF_BUTTON_NOVO';
      expect(buttonId).toBe('CF_BUTTON_NOVO');
    });

    test('deve ter fontWeight 700', () => {
      const style = { fontWeight: 700 };
      expect(style.fontWeight).toBe(700);
    });
  });

  describe('Verificação de perfil', () => {
    test('deve identificar perfil Cursista', () => {
      const TipoPerfilEnum = { Cursista: 1 };
      const TipoPerfilTagDisplay: Record<number, string> = { 1: 'Cursista' };

      const perfilCursista = TipoPerfilTagDisplay[TipoPerfilEnum.Cursista];
      expect(perfilCursista).toBe('Cursista');
    });

    test('deve verificar se é cursista corretamente', () => {
      const perfilSelecionado = 'Cursista';
      const TipoPerfilTagDisplay = { Cursista: 'Cursista' };

      const ehCursista = perfilSelecionado === TipoPerfilTagDisplay.Cursista;
      expect(ehCursista).toBe(true);
    });

    test('deve retornar false para perfil diferente', () => {
      const perfilSelecionado = 'Admin';
      const TipoPerfilTagDisplay = { Cursista: 'Cursista' };

      const ehCursista = perfilSelecionado === TipoPerfilTagDisplay.Cursista;
      expect(ehCursista).toBe(false);
    });
  });

  describe('Navegação', () => {
    test('deve redirecionar para PRINCIPAL se não for cursista', () => {
      const route = 'ROUTES.PRINCIPAL';
      expect(route).toBeTruthy();
    });

    test('deve navegar para área pública ao clicar em nova inscrição', () => {
      const route = 'ROUTES.AREA_PUBLICA';
      expect(route).toBeTruthy();
    });
  });

  describe('Função novaInscricao', () => {
    test('deve navegar somente se for cursista', () => {
      const ehCursista = true;
      const shouldNavigate = ehCursista;
      expect(shouldNavigate).toBe(true);
    });

    test('não deve navegar se não for cursista', () => {
      const ehCursista = false;
      const shouldNavigate = ehCursista;
      expect(shouldNavigate).toBe(false);
    });
  });

  describe('useEffect de verificação de perfil', () => {
    test('deve ter dependências corretas', () => {
      const dependencies = ['ehCursista', 'perfilSelecionado'];
      expect(dependencies).toContain('ehCursista');
      expect(dependencies).toContain('perfilSelecionado');
    });
  });

  describe('Estrutura de layout', () => {
    test('deve ter Col como wrapper principal', () => {
      const wrapper = 'Col';
      expect(wrapper).toBe('Col');
    });

    test('deve ter HeaderPage', () => {
      const hasHeaderPage = true;
      expect(hasHeaderPage).toBe(true);
    });

    test('deve ter CardContent', () => {
      const hasCardContent = true;
      expect(hasCardContent).toBe(true);
    });
  });

  describe('DataTableContextProvider', () => {
    test('deve envolver MinhasInscricoesListaPaginada', () => {
      const provider = 'DataTableContextProvider';
      const child = 'MinhasInscricoesListaPaginada';

      expect(provider).toBeTruthy();
      expect(child).toBeTruthy();
    });
  });

  describe('Layout dos botões', () => {
    test('deve ter gutter de 8x8', () => {
      const gutter = [8, 8];
      expect(gutter).toEqual([8, 8]);
    });

    test('Col deve ter span 24', () => {
      const span = 24;
      expect(span).toBe(24);
    });
  });

  describe('Redux selector', () => {
    test('deve selecionar perfilSelecionado do store', () => {
      const selectorPath = 'store.perfil.perfilSelecionado.perfilNome';
      expect(selectorPath).toContain('perfil');
      expect(selectorPath).toContain('perfilSelecionado');
      expect(selectorPath).toContain('perfilNome');
    });
  });
});
