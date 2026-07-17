/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { act, render } from '@testing-library/react';
import type { FormItemProps, InputProps } from 'antd';

import InputEmailInscricao from './index';

type InputEmailMockProps = {
  inputProps?: InputProps;
  formItemProps?: FormItemProps;
};

let capturedInputEmailProps: InputEmailMockProps;

jest.mock('~/components/main/input/email', () => ({
  __esModule: true,
  default: (props: InputEmailMockProps) => {
    capturedInputEmailProps = props;

    return <div data-testid='input-email' />;
  },
}));

describe('InputEmailInscricao', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    capturedInputEmailProps = {};
  });

  const getRequiredRule = () => {
    const rules = capturedInputEmailProps.formItemProps?.rules;

    if (!Array.isArray(rules)) {
      throw new Error('As regras do Form.Item não foram definidas.');
    }

    return rules[0];
  };

  const getValidatorFactory = () => {
    const rules = capturedInputEmailProps.formItemProps?.rules;

    if (!Array.isArray(rules)) {
      throw new Error('As regras do Form.Item não foram definidas.');
    }

    const validatorFactory = rules[1];

    if (typeof validatorFactory !== 'function') {
      throw new Error('A factory do validator não foi definida.');
    }

    return validatorFactory;
  };

  const executeValidator = async (
    getFieldValue: jest.Mock,
  ): Promise<void> => {
    const validatorFactory = getValidatorFactory();

    const rule = validatorFactory({
      getFieldValue,
    } as never);

    if (
      typeof rule !== 'object' ||
      rule === null ||
      typeof rule.validator !== 'function'
    ) {
      throw new Error('O validator não foi definido corretamente.');
    }

    await act(async () => {
      await rule.validator?.({} as never, undefined, () => {});
    });
  };

  it('renderiza o InputEmail com required inicialmente falso', () => {
    render(<InputEmailInscricao />);

    expect(getRequiredRule()).toEqual({
      required: false,
    });
  });

  it('repassa inputProps para o componente InputEmail', () => {
    const onChange = jest.fn();

    const inputProps: InputProps = {
      disabled: true,
      placeholder: 'Digite seu e-mail',
      maxLength: 150,
      onChange,
    };

    render(<InputEmailInscricao inputProps={inputProps} />);

    expect(capturedInputEmailProps.inputProps).toBe(inputProps);
    expect(capturedInputEmailProps.inputProps).toEqual({
      disabled: true,
      placeholder: 'Digite seu e-mail',
      maxLength: 150,
      onChange,
    });
  });

  it('repassa formItemProps para o componente InputEmail', () => {
    const normalize = jest.fn();

    const formItemProps: FormItemProps = {
      label: 'E-mail',
      name: 'usuarioEmail',
      normalize,
      validateTrigger: 'onBlur',
    };

    render(
      <InputEmailInscricao
        formItemProps={formItemProps}
      />,
    );

    expect(capturedInputEmailProps.formItemProps).toEqual(
      expect.objectContaining({
        label: 'E-mail',
        name: 'usuarioEmail',
        normalize,
        validateTrigger: 'onBlur',
      }),
    );
  });

  it('consulta o campo usuarioEmail durante a validação', async () => {
    const getFieldValue = jest.fn().mockReturnValue(
      'usuario@empresa.com',
    );

    render(<InputEmailInscricao />);

    await executeValidator(getFieldValue);

    expect(getFieldValue).toHaveBeenCalledTimes(1);
    expect(getFieldValue).toHaveBeenCalledWith(
      'usuarioEmail',
    );
  });

  it('altera required para verdadeiro quando o e-mail está vazio', async () => {
    const getFieldValue = jest.fn().mockReturnValue('');

    render(<InputEmailInscricao />);

    expect(getRequiredRule()).toEqual({
      required: false,
    });

    await executeValidator(getFieldValue);

    expect(getRequiredRule()).toEqual({
      required: true,
    });
  });

  it('altera required para verdadeiro quando o e-mail é undefined', async () => {
    const getFieldValue = jest.fn().mockReturnValue(
      undefined,
    );

    render(<InputEmailInscricao />);

    await executeValidator(getFieldValue);

    expect(getRequiredRule()).toEqual({
      required: true,
    });
  });

  it('altera required para verdadeiro quando o e-mail é null', async () => {
    const getFieldValue = jest.fn().mockReturnValue(null);

    render(<InputEmailInscricao />);

    await executeValidator(getFieldValue);

    expect(getRequiredRule()).toEqual({
      required: true,
    });
  });

  it('mantém required falso quando existe um e-mail', async () => {
    const getFieldValue = jest.fn().mockReturnValue(
      'usuario@empresa.com',
    );

    render(<InputEmailInscricao />);

    await executeValidator(getFieldValue);

    expect(getRequiredRule()).toEqual({
      required: false,
    });
  });

  it('altera required de verdadeiro para falso quando o e-mail passa a existir', async () => {
    const getFieldValue = jest
      .fn()
      .mockReturnValueOnce('')
      .mockReturnValueOnce('usuario@empresa.com');

    render(<InputEmailInscricao />);

    await executeValidator(getFieldValue);

    expect(getRequiredRule()).toEqual({
      required: true,
    });

    await executeValidator(getFieldValue);

    expect(getRequiredRule()).toEqual({
      required: false,
    });

    expect(getFieldValue).toHaveBeenCalledTimes(2);
  });

  it('sempre resolve a validação com sucesso quando o e-mail está vazio', async () => {
    const getFieldValue = jest.fn().mockReturnValue('');

    render(<InputEmailInscricao />);

    const validatorFactory = getValidatorFactory();

    const rule = validatorFactory({
      getFieldValue,
    } as never);

    if (
      typeof rule !== 'object' ||
      rule === null ||
      typeof rule.validator !== 'function'
    ) {
      throw new Error('O validator não foi definido.');
    }

    let validatorResult:
      | void
      | Promise<void>
      | undefined;

    await act(async () => {
      validatorResult = rule.validator?.(
        {} as never,
        undefined,
        {} as never,
      );

      await expect(validatorResult).resolves.toBeUndefined();
    });
  });

  it('sempre resolve a validação com sucesso quando o e-mail está preenchido', async () => {
    const getFieldValue = jest.fn().mockReturnValue(
      'usuario@empresa.com',
    );

    render(<InputEmailInscricao />);

    const validatorFactory = getValidatorFactory();

    const rule = validatorFactory({
      getFieldValue,
    } as never);

    if (
      typeof rule !== 'object' ||
      rule === null ||
      typeof rule.validator !== 'function'
    ) {
      throw new Error('O validator não foi definido.');
    }

    let validatorResult:
      | void
      | Promise<void>
      | undefined;

    await act(async () => {
      validatorResult = rule.validator?.(
        {} as never,
        undefined,
        {} as never,
      );

      await expect(validatorResult).resolves.toBeUndefined();
    });
  });

  it('permite que formItemProps sobrescreva as regras internas', () => {
    const customRules: FormItemProps['rules'] = [
      {
        required: true,
        message: 'Campo obrigatório',
      },
    ];

    render(
      <InputEmailInscricao
        formItemProps={{
          rules: customRules,
        }}
      />,
    );

    expect(
      capturedInputEmailProps.formItemProps?.rules,
    ).toBe(customRules);

    expect(
      capturedInputEmailProps.formItemProps?.rules,
    ).toEqual([
      {
        required: true,
        message: 'Campo obrigatório',
      },
    ]);
  });

  it('aceita validacaoEmail sem alterar as propriedades enviadas ao InputEmail', () => {
    render(
      <InputEmailInscricao validacaoEmail />,
    );

    expect(capturedInputEmailProps).toEqual({
      inputProps: undefined,
      formItemProps: {
        rules: [
          {
            required: false,
          },
          expect.any(Function),
        ],
      },
    });
  });
});