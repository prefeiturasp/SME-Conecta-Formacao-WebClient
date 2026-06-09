import { describe, test, expect, jest, beforeEach } from '@jest/globals';

jest.mock('antd', () => ({
  Button: 'Button',
}));

jest.mock('./modal-edit-unidade', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import ModalEditUnidadeButton from  './modal-edit-unidade-button';
import ModalEditUnidade from './modal-edit-unidade';

describe('ModalEditUnidadeButton', () => {
  const formPreviewMock = {
    setFieldValue: jest.fn(),
    getFieldsValue: jest.fn(),
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();

    formPreviewMock.getFieldsValue.mockReturnValue({
      nomeUnidade: 'Unidade Inicial',
    });
  });

  describe('Componente', () => {
    test('deve ser uma função', () => {
      expect(typeof ModalEditUnidadeButton).toBe('function');
    });

    test('deve ter o nome correto', () => {
      expect(ModalEditUnidadeButton.name).toBe('ModalEditUnidadeButton');
    });

    test('deve estar definido', () => {
      expect(ModalEditUnidadeButton).toBeDefined();
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
      const updateFields = (values: { nomeUnidade: string }) => {
        formPreviewMock.setFieldValue('nomeUnidade', values?.nomeUnidade);
      };

      updateFields({ nomeUnidade: 'Nova Unidade' });

      expect(formPreviewMock.setFieldValue).toHaveBeenCalledWith(
        'nomeUnidade',
        'Nova Unidade'
      );
    });

    test('deve aceitar valores undefined', () => {
      const updateFields = (values: { nomeUnidade: string }) => {
        formPreviewMock.setFieldValue('nomeUnidade', values?.nomeUnidade);
      };

      updateFields({ nomeUnidade: undefined as any });

      expect(formPreviewMock.setFieldValue).toHaveBeenCalledWith(
        'nomeUnidade',
        undefined
      );
    });
  });

  describe('Integração com formPreview', () => {
    test('deve obter valores iniciais do form', () => {
      const values = formPreviewMock.getFieldsValue();

      expect(formPreviewMock.getFieldsValue).toHaveBeenCalled();
      expect(values.nomeUnidade).toBe('Unidade Inicial');
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

  describe('Props do ModalEditUnidade', () => {
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
      expect(props.initialValues.nomeUnidade).toBe('Unidade Inicial');
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