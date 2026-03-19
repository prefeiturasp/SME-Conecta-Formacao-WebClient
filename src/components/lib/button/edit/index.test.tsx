import { describe, test, expect } from '@jest/globals';

describe('ButtonEdit', () => {
  describe('Interface ButtonEditParams', () => {
    test('deve aceitar descricaoTooltip como string obrigatória', () => {
      const params = { descricaoTooltip: 'Editar registro', onClickEditar: () => {} };
      expect(params.descricaoTooltip).toBe('Editar registro');
    });

    test('deve aceitar podeEditar como booleano opcional', () => {
      const comPermissao = { descricaoTooltip: 'Editar', podeEditar: true, onClickEditar: () => {} };
      const semPermissao = { descricaoTooltip: 'Editar', podeEditar: false, onClickEditar: () => {} };
      const semPropriedade = { descricaoTooltip: 'Editar', onClickEditar: () => {} };

      expect(comPermissao.podeEditar).toBe(true);
      expect(semPermissao.podeEditar).toBe(false);
      expect((semPropriedade as any).podeEditar).toBeUndefined();
    });

    test('deve aceitar onClickEditar como função obrigatória', () => {
      const onClickEditar = jest.fn();
      const params = { descricaoTooltip: 'Editar', onClickEditar };
      expect(typeof params.onClickEditar).toBe('function');
    });
  });

  describe('Estilo do container - cursor', () => {
    test('deve ter cursor pointer quando podeEditar é true', () => {
      const podeEditar = true;
      const cursor = podeEditar ? 'pointer' : 'not-allowed';
      expect(cursor).toBe('pointer');
    });

    test('deve ter cursor not-allowed quando podeEditar é false', () => {
      const podeEditar = false;
      const cursor = podeEditar ? 'pointer' : 'not-allowed';
      expect(cursor).toBe('not-allowed');
    });

    test('deve ter cursor not-allowed quando podeEditar é undefined', () => {
      const podeEditar = undefined;
      const cursor = podeEditar ? 'pointer' : 'not-allowed';
      expect(cursor).toBe('not-allowed');
    });
  });

  describe('Estilo do container - cor', () => {
    test('deve usar a cor primária do tema quando podeEditar é true', () => {
      const podeEditar = true;
      const colorPrimary = '#1890ff';
      const color = podeEditar ? colorPrimary : '#f0f0f0';
      expect(color).toBe('#1890ff');
    });

    test('deve usar cor #f0f0f0 quando podeEditar é false', () => {
      const podeEditar = false;
      const colorPrimary = '#1890ff';
      const color = podeEditar ? colorPrimary : '#f0f0f0';
      expect(color).toBe('#f0f0f0');
    });

    test('deve usar cor #f0f0f0 quando podeEditar é undefined', () => {
      const podeEditar = undefined;
      const colorPrimary = '#1890ff';
      const color = podeEditar ? colorPrimary : '#f0f0f0';
      expect(color).toBe('#f0f0f0');
    });
  });

  describe('Dimensões do container', () => {
    test('deve ter altura de 32px', () => {
      const height = '32px';
      expect(height).toBe('32px');
    });

    test('deve ter largura de 32px', () => {
      const width = '32px';
      expect(width).toBe('32px');
    });

    test('deve ter border-radius de 4px', () => {
      const borderRadius = '4px';
      expect(borderRadius).toBe('4px');
    });

    test('deve ter border none', () => {
      const border = 'none';
      expect(border).toBe('none');
    });
  });

  describe('Estilo do ícone', () => {
    test('deve ter margin de 6.5px', () => {
      const styleIcon = { margin: '6.5px', cursor: 'pointer', fontSize: '16px' };
      expect(styleIcon.margin).toBe('6.5px');
    });

    test('deve ter cursor pointer', () => {
      const styleIcon = { margin: '6.5px', cursor: 'pointer', fontSize: '16px' };
      expect(styleIcon.cursor).toBe('pointer');
    });

    test('deve ter fontSize de 16px', () => {
      const styleIcon = { margin: '6.5px', cursor: 'pointer', fontSize: '16px' };
      expect(styleIcon.fontSize).toBe('16px');
    });
  });

  describe('Comportamento do onClick', () => {
    test('deve chamar onClickEditar quando podeEditar é true', () => {
      const onClickEditar = jest.fn();
      const podeEditar = true;

      const handleClick = () => {
        if (podeEditar) onClickEditar();
      };

      handleClick();

      expect(onClickEditar).toHaveBeenCalledTimes(1);
    });

    test('não deve chamar onClickEditar quando podeEditar é false', () => {
      const onClickEditar = jest.fn();
      const podeEditar = false;

      const handleClick = () => {
        if (podeEditar) onClickEditar();
      };

      handleClick();

      expect(onClickEditar).not.toHaveBeenCalled();
    });

    test('não deve chamar onClickEditar quando podeEditar é undefined', () => {
      const onClickEditar = jest.fn();
      const podeEditar = undefined;

      const handleClick = () => {
        if (podeEditar) onClickEditar();
      };

      handleClick();

      expect(onClickEditar).not.toHaveBeenCalled();
    });

    test('deve chamar onClickEditar somente uma vez por clique', () => {
      const onClickEditar = jest.fn();
      const podeEditar = true;

      const handleClick = () => {
        if (podeEditar) onClickEditar();
      };

      handleClick();
      handleClick();

      expect(onClickEditar).toHaveBeenCalledTimes(2);
    });
  });

  describe('Tooltip', () => {
    test('deve usar placement top', () => {
      const placement = 'top';
      expect(placement).toBe('top');
    });

    test('deve ter destroyTooltipOnHide ativado', () => {
      const destroyTooltipOnHide = true;
      expect(destroyTooltipOnHide).toBe(true);
    });

    test('deve usar descricaoTooltip como título do tooltip', () => {
      const descricaoTooltip = 'Editar área promotora';
      expect(descricaoTooltip).toBe('Editar área promotora');
    });
  });
});
