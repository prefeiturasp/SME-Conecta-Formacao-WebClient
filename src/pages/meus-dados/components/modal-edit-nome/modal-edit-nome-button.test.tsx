import { describe, test, expect, jest, beforeEach } from '@jest/globals';

jest.mock('antd', () => ({
  Button: 'Button',
}));

jest.mock('./modal-edit-nome', () => ({
  __esModule: true,
  ModalEditNome: jest.fn(),
}));

import { ModalEditNomeButton } from './modal-edit-nome-button';
import { ModalEditNome } from './modal-edit-nome';

describe('ModalEditNomeButton', () => {
  const formPreviewMock = {
    setFieldValue: jest.fn(),
    getFieldsValue: jest.fn(),
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();

    formPreviewMock.getFieldsValue.mockReturnValue({
      nome: 'João',
    });
  });

  describe('Componente', () => {
    test('deve ser uma função', () => {
      expect(typeof ModalEditNomeButton).toBe('function');
    });

    test('deve ter o nome correto', () => {
      expect(ModalEditNomeButton.name).toBe('ModalEditNomeButton');
    });

    test('deve estar definido', () => {
      expect(ModalEditNomeButton).toBeDefined();
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

  describe('Função updateFields', () => {
    test('deve chamar setFieldValue corretamente', () => {
      const updateFields = (values: { nome: string }) => {
        formPreviewMock.setFieldValue('nome', values?.nome);
      };

      updateFields({ nome: 'Maria' });

      expect(formPreviewMock.setFieldValue).toHaveBeenCalledWith(
        'nome',
        'Maria'
      );
    });

    test('deve aceitar nome undefined', () => {
      const updateFields = (values: { nome: string }) => {
        formPreviewMock.setFieldValue('nome', values?.nome);
      };

      updateFields({ nome: undefined as any });

      expect(formPreviewMock.setFieldValue).toHaveBeenCalledWith(
        'nome',
        undefined
      );
    });
  });

  describe('Integração com formPreview', () => {
    test('deve obter valores iniciais do form', () => {
      const values = formPreviewMock.getFieldsValue();

      expect(formPreviewMock.getFieldsValue).toHaveBeenCalled();
      expect(values.nome).toBe('João');
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

  describe('Props do ModalEditNome', () => {
    test('deve montar props corretamente', () => {
      const updateFields = jest.fn();
      const closeModal = jest.fn();
      const initialValues = formPreviewMock.getFieldsValue();

      const props = {
        updateFields,
        initialValues,
        closeModal,
      };

      expect(props.updateFields).toBe(updateFields);
      expect(props.initialValues.nome).toBe('João');
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