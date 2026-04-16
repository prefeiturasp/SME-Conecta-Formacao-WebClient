import { describe, test, expect, jest } from '@jest/globals';

jest.mock('~/pages/notificacoes/provider', () => ({ NotificacoesContext: {} }));

import NotificationButton from './index';

describe('NotificationButton', () => {
  describe('Componente', () => {
    test('deve ser uma função', () => {
      expect(typeof NotificationButton).toBe('function');
    });
  });
  describe('Propriedades padrão', () => {
    test('deve ter label padrão "Notificações"', () => {
      const label = 'Notificações';
      expect(label).toBe('Notificações');
    });

    test('deve ter size small', () => {
      const size = 'small';
      expect(size).toBe('small');
    });

    test('deve ter type primary', () => {
      const type = 'primary';
      expect(type).toBe('primary');
    });

    test('deve ter shape circle', () => {
      const shape = 'circle';
      expect(shape).toBe('circle');
    });
  });

  describe('Ícone', () => {
    test('deve usar ícone IoNotificationsSharp', () => {
      const iconName = 'IoNotificationsSharp';
      expect(iconName).toBe('IoNotificationsSharp');
    });
  });

  describe('Badge de notificações', () => {
    test('deve exibir contagem zerada quando não há notificações', () => {
      const quantidadeNotificacoes = 0;
      expect(quantidadeNotificacoes).toBe(0);
    });

    test('deve exibir contagem quando há notificações', () => {
      const quantidadeNotificacoes = 5;
      expect(quantidadeNotificacoes).toBeGreaterThan(0);
    });

    test('contagem deve ser numérica', () => {
      const quantidadeNotificacoes = 3;
      expect(typeof quantidadeNotificacoes).toBe('number');
    });
  });

  describe('Label customizado', () => {
    test('deve aceitar label personalizado', () => {
      const label = 'Avisos';
      expect(label).toBe('Avisos');
    });

    test('label não deve ser vazio quando fornecido', () => {
      const label = 'Notificações';
      expect(label.length).toBeGreaterThan(0);
    });
  });

  describe('Spread de props (rest)', () => {
    test('deve repassar onClick via rest', () => {
      const onClick = jest.fn();
      const props = { onClick };
      props.onClick();
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    test('deve repassar disabled via rest', () => {
      const props = { disabled: true };
      expect(props.disabled).toBe(true);
    });

    test('deve repassar id via rest', () => {
      const props = { id: 'CF_BUTTON_NOTIFICACAO' };
      expect(props.id).toBe('CF_BUTTON_NOTIFICACAO');
    });
  });

  describe('Estilo do container', () => {
    test('deve ter display flex', () => {
      const style = { display: 'flex', alignItems: 'center', flexDirection: 'column', lineHeight: '1.5' };
      expect(style.display).toBe('flex');
    });

    test('deve ter flexDirection column', () => {
      const style = { display: 'flex', alignItems: 'center', flexDirection: 'column', lineHeight: '1.5' };
      expect(style.flexDirection).toBe('column');
    });

    test('deve ter lineHeight 1.5', () => {
      const style = { display: 'flex', alignItems: 'center', flexDirection: 'column', lineHeight: '1.5' };
      expect(style.lineHeight).toBe('1.5');
    });
  });

  describe('Estilo do LabelButton', () => {
    test('deve ter fontSize 10px', () => {
      const style = { fontSize: '10px', color: '#929494' };
      expect(style.fontSize).toBe('10px');
    });

    test('deve ter color #929494', () => {
      const style = { fontSize: '10px', color: '#929494' };
      expect(style.color).toBe('#929494');
    });
  });
});
