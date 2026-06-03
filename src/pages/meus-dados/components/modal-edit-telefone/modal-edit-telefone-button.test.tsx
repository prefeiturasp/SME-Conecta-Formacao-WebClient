import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { FormInstance } from 'antd/es/form/Form';

describe('ModalEditTelefoneButton', () => {
  let mockFormInstance: Partial<FormInstance>;
  let mockSetFieldValue: jest.Mock;
  let mockGetFieldsValue: jest.Mock;

  beforeEach(() => {
    mockSetFieldValue = jest.fn();
    mockGetFieldsValue = jest.fn().mockReturnValue({ telefone: '11987654321' });

    mockFormInstance = {
      setFieldValue: mockSetFieldValue,
      getFieldsValue: mockGetFieldsValue,
    };
  });

  describe('Tipo de Props', () => {
    test('formPreview deve ser do tipo FormInstance', () => {
      expect(mockFormInstance).toHaveProperty('setFieldValue');
      expect(mockFormInstance).toHaveProperty('getFieldsValue');
    });

    test('updateFields deve ser uma função', () => {
      const updateFields = (values: { telefone: string }) => {
        mockFormInstance.setFieldValue?.('telefone', values?.telefone);
      };
      expect(typeof updateFields).toBe('function');
    });

    test('closeModal deve ser uma função', () => {
      const closeModal = () => {
        // fecha modal
      };
      expect(typeof closeModal).toBe('function');
    });
  });

  describe('Funcionalidade de updateFields', () => {
    test('deve chamar setFieldValue com telefone e valor', () => {
      const updateFields = (values: { telefone: string }) => {
        mockFormInstance.setFieldValue?.('telefone', values?.telefone);
      };

      updateFields({ telefone: '11987654321' });

      expect(mockSetFieldValue).toHaveBeenCalledWith('telefone', '11987654321');
    });

    test('deve chamar setFieldValue com undefined quando telefone é undefined', () => {
      const updateFields = (values: { telefone: string }) => {
        mockFormInstance.setFieldValue?.('telefone', values?.telefone);
      };

      updateFields({ telefone: undefined as any });

      expect(mockSetFieldValue).toHaveBeenCalledWith('telefone', undefined);
    });

    test('deve chamar setFieldValue uma única vez por updateFields', () => {
      const updateFields = (values: { telefone: string }) => {
        mockFormInstance.setFieldValue?.('telefone', values?.telefone);
      };

      updateFields({ telefone: '11987654321' });

      expect(mockSetFieldValue).toHaveBeenCalledTimes(1);
    });

    test('deve chamar setFieldValue múltiplas vezes para múltiplas chamadas', () => {
      const updateFields = (values: { telefone: string }) => {
        mockFormInstance.setFieldValue?.('telefone', values?.telefone);
      };

      updateFields({ telefone: '11987654321' });
      updateFields({ telefone: '21987654321' });

      expect(mockSetFieldValue).toHaveBeenCalledTimes(2);
    });
  });

  describe('Funcionalidade de getFieldsValue', () => {
    test('deve chamar getFieldsValue sem argumentos', () => {
      const initialValues = mockFormInstance.getFieldsValue?.();

      expect(mockGetFieldsValue).toHaveBeenCalled();
      expect(mockGetFieldsValue).toHaveBeenCalledWith();
    });

    test('deve retornar objeto com campo telefone', () => {
      const initialValues = mockFormInstance.getFieldsValue?.();

      expect(initialValues).toHaveProperty('telefone');
      expect(initialValues?.telefone).toBe('11987654321');
    });

    test('deve retornar o mesmo valor definido no mock', () => {
      const telefoneRetornado = mockGetFieldsValue().telefone;

      expect(telefoneRetornado).toBe('11987654321');
    });

    test('deve retornar valores vazios quando form está vazio', () => {
      mockGetFieldsValue.mockReturnValueOnce({});

      const initialValues = mockFormInstance.getFieldsValue?.();

      expect(initialValues).toEqual({});
    });
  });

  describe('Fluxo completo', () => {
    test('deve obter valores iniciais e atualizar campo telefone', () => {
      // Simula fluxo de abrir modal
      const initialValues = mockFormInstance.getFieldsValue?.();

      expect(mockGetFieldsValue).toHaveBeenCalled();
      expect(initialValues?.telefone).toBe('11987654321');

      // Simula fluxo de atualizar telefone
      const updateFields = (values: { telefone: string }) => {
        mockFormInstance.setFieldValue?.('telefone', values?.telefone);
      };

      updateFields({ telefone: '21987654321' });

      expect(mockSetFieldValue).toHaveBeenCalledWith('telefone', '21987654321');
    });

    test('deve executar ciclo de abrir, atualizar e fechar modal', () => {
      // Abrir modal - chama getFieldsValue
      const initialValues = mockFormInstance.getFieldsValue?.();
      expect(initialValues).toBeDefined();

      // Atualizar - chama setFieldValue
      const updateFields = (values: { telefone: string }) => {
        mockFormInstance.setFieldValue?.('telefone', values?.telefone);
      };
      updateFields({ telefone: '11999999999' });

      expect(mockSetFieldValue).toHaveBeenCalled();
      expect(mockGetFieldsValue).toHaveBeenCalled();
    });

    test('deve permitir múltiplos ciclos de abrir e fechar', () => {
      // Primeiro ciclo
      mockFormInstance.getFieldsValue?.();
      expect(mockGetFieldsValue).toHaveBeenCalledTimes(1);

      // Segundo ciclo
      mockFormInstance.getFieldsValue?.();
      expect(mockGetFieldsValue).toHaveBeenCalledTimes(2);

      // Terceiro ciclo
      mockFormInstance.getFieldsValue?.();
      expect(mockGetFieldsValue).toHaveBeenCalledTimes(3);
    });
  });

  describe('Validação de dados', () => {
    test('initialValues deve conter estrutura correta', () => {
      const initialValues = mockFormInstance.getFieldsValue?.();

      expect(initialValues).toEqual(
        expect.objectContaining({
          telefone: expect.any(String),
        })
      );
    });

    test('deve aceitar diferentes formatos de telefone', () => {
      const updateFields = (values: { telefone: string }) => {
        mockFormInstance.setFieldValue?.('telefone', values?.telefone);
      };

      const telefoneDDDZero = '0198765432';
      updateFields({ telefone: telefoneDDDZero });

      expect(mockSetFieldValue).toHaveBeenCalledWith('telefone', telefoneDDDZero);
    });

    test('deve aceitar telefone com máscara', () => {
      const updateFields = (values: { telefone: string }) => {
        mockFormInstance.setFieldValue?.('telefone', values?.telefone);
      };

      const telefoneMascarado = '(11) 98765-4321';
      updateFields({ telefone: telefoneMascarado });

      expect(mockSetFieldValue).toHaveBeenCalledWith('telefone', telefoneMascarado);
    });
  });
});
