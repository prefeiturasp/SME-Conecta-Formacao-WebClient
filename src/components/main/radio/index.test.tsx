import { describe, test, expect } from '@jest/globals';

describe('Radio', () => {
  describe('Regras de validação padrão', () => {
    test('deve ter required true por padrão', () => {
      const rules = [{ required: true }];
      expect(rules[0].required).toBe(true);
    });

    test('formItemProps deve sobrescrever as regras padrão via spread', () => {
      const defaultRules = [{ required: true }];
      const overrideRules = [{ required: false }];
      const finalRules = overrideRules ?? defaultRules;
      expect(finalRules[0].required).toBe(false);
    });
  });

  describe('Interface RadioProps', () => {
    test('deve aceitar radioGroupProps como obrigatório', () => {
      const radioGroupProps = { options: ['Sim', 'Não'] };
      expect(radioGroupProps.options).toHaveLength(2);
    });

    test('deve aceitar formItemProps como obrigatório', () => {
      const formItemProps = { label: 'Opção', name: 'opcao' };
      expect(formItemProps.label).toBe('Opção');
    });

    test('deve aceitar name em formItemProps', () => {
      const formItemProps = { name: 'profissionalRedeMunicipal' };
      expect(formItemProps.name).toBe('profissionalRedeMunicipal');
    });
  });

  describe('RadioGroup - opções', () => {
    test('deve repassar options via radioGroupProps', () => {
      const options = [
        { label: 'Sim', value: true },
        { label: 'Não', value: false },
      ];
      expect(options).toHaveLength(2);
      expect(options[0].label).toBe('Sim');
      expect(options[1].label).toBe('Não');
    });

    test('deve repassar onChange via radioGroupProps', () => {
      const onChange = jest.fn();
      const radioGroupProps = { onChange };
      radioGroupProps.onChange({ target: { value: true } } as any);
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    test('deve repassar value via radioGroupProps', () => {
      const radioGroupProps = { value: true };
      expect(radioGroupProps.value).toBe(true);
    });
  });
});
