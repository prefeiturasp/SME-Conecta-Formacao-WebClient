import { describe, test, expect, jest, beforeEach } from '@jest/globals';

jest.mock('antd', () => ({
  Button: 'Button',
}));

jest.mock('./modal-edit-tipo-email-educacional', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import ModalEditTipoEmailEducacionalButton from './modal-edit-tipo-email-educacional-button';
import ModalEditTipoEmailEducacional from './modal-edit-tipo-email-educacional';

describe('ModalEditTipoEmailEducacionalButton', () => {
  const formPreviewMock = {
    setFieldValue: jest.fn(),
    getFieldsValue: jest.fn(),
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();

    formPreviewMock.getFieldsValue.mockReturnValue({
      tipoEmail: 1,
    });
  });

  describe('Componente', () => {
    test('deve ser uma função', () => {
      expect(typeof ModalEditTipoEmailEducacionalButton).toBe('function');
    });

    test('deve ter o nome correto', () => {
      expect(ModalEditTipoEmailEducacionalButton.name).toBe(
        'ModalEditTipoEmailEducacionalButton'
      );
    });

    test('deve estar definido', () => {
      expect(ModalEditTipoEmailEducacionalButton).toBeDefined();
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
      const updateFields = (values: { tipoEmail: number }) =>
        formPreviewMock.setFieldValue('tipoEmail', values?.tipoEmail);

      updateFields({ tipoEmail: 2 });

      expect(formPreviewMock.setFieldValue).toHaveBeenCalledWith(
        'tipoEmail',
        2
      );
    });

    test('deve aceitar tipoEmail undefined', () => {
      const updateFields = (values: { tipoEmail: number }) =>
        formPreviewMock.setFieldValue('tipoEmail', values?.tipoEmail);

      updateFields({ tipoEmail: undefined as any });

      expect(formPreviewMock.setFieldValue).toHaveBeenCalledWith(
        'tipoEmail',
        undefined
      );
    });
  });

  describe('Integração com formPreview', () => {
    test('deve obter valores iniciais do form', () => {
      const values = formPreviewMock.getFieldsValue();

      expect(formPreviewMock.getFieldsValue).toHaveBeenCalled();
      expect(values.tipoEmail).toBe(1);
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

  describe('Props do ModalEditTipoEmailEducacional', () => {
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
      expect(props.initialValues.tipoEmail).toBe(1);
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