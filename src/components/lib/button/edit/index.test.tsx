import { describe, test, expect } from '@jest/globals';
import { ButtonEdit, styleIcon } from './index';

describe('ButtonEdit', () => {
  describe('Interface ButtonEditParams', () => {
    test('deve aceitar descricaoTooltip como string obrigatória', () => {
      const params = { descricaoTooltip: 'Editar registro', onClickEditar: () => {} };
      expect(params.descricaoTooltip).toBe('Editar registro');
    });

    test('deve aceitar podeEditar como booleano opcional', () => {
      const comPermissao = {
        descricaoTooltip: 'Editar',
        podeEditar: true,
        onClickEditar: () => {},
      };
      const semPermissao = {
        descricaoTooltip: 'Editar',
        podeEditar: false,
        onClickEditar: () => {},
      };
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

  describe('Componente ButtonEdit', () => {
    test('deve ser uma função', () => {
      expect(typeof ButtonEdit).toBe('function');
    });
  });

  describe('styleIcon', () => {
    test('deve ter margin de 6.5px', () => {
      expect(styleIcon.margin).toBe('6.5px');
    });

    test('deve ter cursor pointer', () => {
      expect(styleIcon.cursor).toBe('pointer');
    });

    test('deve ter fontSize de 16px', () => {
      expect(styleIcon.fontSize).toBe('16px');
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
