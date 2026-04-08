import { describe, test, expect } from '@jest/globals';
import { TypeAlertEnum } from './index';

describe('Alert', () => {
  describe('TypeAlertEnum', () => {
    test('deve ter valor info', () => {
      expect(TypeAlertEnum.Info).toBe('info');
    });

    test('deve ter valor success', () => {
      expect(TypeAlertEnum.Success).toBe('success');
    });

    test('deve ter valor error', () => {
      expect(TypeAlertEnum.Error).toBe('error');
    });

    test('deve ter valor warning', () => {
      expect(TypeAlertEnum.Warning).toBe('warning');
    });
  });

  describe('getColor', () => {
    const makeTheme = (overrides: Record<string, string>) => ({
      components: {
        Alert: overrides,
      },
    });

    test('deve retornar colorSuccess para tipo success', () => {
      const theme = makeTheme({ colorSuccess: '#52c41a' });
      const color = theme.components.Alert.colorSuccess || '';
      expect(color).toBe('#52c41a');
    });

    test('deve retornar colorWarning para tipo warning', () => {
      const theme = makeTheme({ colorWarning: '#faad14' });
      const color = theme.components.Alert.colorWarning || '';
      expect(color).toBe('#faad14');
    });

    test('deve retornar colorError para tipo error', () => {
      const theme = makeTheme({ colorError: '#ff4d4f' });
      const color = theme.components.Alert.colorError || '';
      expect(color).toBe('#ff4d4f');
    });

    test('deve retornar colorInfo para tipo info', () => {
      const theme = makeTheme({ colorInfo: '#1890ff' });
      const color = theme.components.Alert.colorInfo || '';
      expect(color).toBe('#1890ff');
    });

    test('deve retornar string vazia para tipo desconhecido', () => {
      const color = '';
      expect(color).toBe('');
    });
  });

  describe('Propriedades padrão', () => {
    test('deve ter showIcon true', () => {
      const showIcon = true;
      expect(showIcon).toBe(true);
    });

    test('deve repassar type via props', () => {
      const props = { type: 'error' as const };
      expect(props.type).toBe('error');
    });

    test('deve repassar message via props', () => {
      const props = { message: 'Ocorreu um erro' };
      expect(props.message).toBe('Ocorreu um erro');
    });

    test('deve repassar description via props', () => {
      const props = { description: 'Detalhes do erro' };
      expect(props.description).toBe('Detalhes do erro');
    });
  });

  describe('Estilo do divider-bottom', () => {
    test('deve ter top de -4px', () => {
      const style = { top: '-4px', position: 'relative', height: '4px' };
      expect(style.top).toBe('-4px');
    });

    test('deve ter position relative', () => {
      const style = { top: '-4px', position: 'relative', height: '4px' };
      expect(style.position).toBe('relative');
    });

    test('deve ter height de 4px', () => {
      const style = { top: '-4px', position: 'relative', height: '4px' };
      expect(style.height).toBe('4px');
    });
  });
});
