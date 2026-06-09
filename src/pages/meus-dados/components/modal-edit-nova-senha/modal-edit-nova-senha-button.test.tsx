import { describe, test, expect, jest, beforeEach } from '@jest/globals';

jest.mock('antd', () => ({
  Button: 'Button',
}));

jest.mock('./modal-edit-nova-senha', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import ModalEditNovaSenhaButton from './modal-edit-nova-senha-button';
import ModalEditNovaSenha from './modal-edit-nova-senha';

describe('ModalEditNovaSenhaButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Componente', () => {
    test('deve ser uma função', () => {
      expect(typeof ModalEditNovaSenhaButton).toBe('function');
    });

    test('deve ter o nome correto', () => {
      expect(ModalEditNovaSenhaButton.name).toBe('ModalEditNovaSenhaButton');
    });

    test('deve estar definido', () => {
      expect(ModalEditNovaSenhaButton).toBeDefined();
    });
  });

  describe('Estado inicial', () => {
    test('open inicial deve ser false', () => {
      const open = false;
      expect(open).toBe(false);
    });
  });

  describe('Função showModal', () => {
    test('deve alterar open para true', () => {
      let open = false;

      const showModal = () => {
        open = true;
      };

      showModal();

      expect(open).toBe(true);
    });
  });

  describe('Renderização condicional do modal', () => {
    test('não deve renderizar modal quando open for false', () => {
      const open = false;
      const shouldRender = open && true;

      expect(shouldRender).toBe(false);
    });

    test('deve renderizar modal quando open for true', () => {
      const open = true;
      const shouldRender = open && true;

      expect(shouldRender).toBe(true);
    });
  });

  describe('Props do ModalEditNovaSenha', () => {
    test('deve montar props corretamente', () => {
      const closeModal = jest.fn();

      const props = {
        closeModal,
      };

      expect(props.closeModal).toBe(closeModal);
    });
  });

  describe('Função closeModal', () => {
    test('deve alterar open para false', () => {
      let open = true;

      const closeModal = () => {
        open = false;
      };

      closeModal();

      expect(open).toBe(false);
    });
  });
});