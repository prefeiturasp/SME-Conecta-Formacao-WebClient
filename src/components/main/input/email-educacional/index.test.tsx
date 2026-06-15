/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { CF_INPUT_EMAIL_EDUCACIONAL } from '../../../../core/constants/ids/input';
import InputEmailEducacional from './index';

const formItemMock = jest.fn();

const formMock = {
  getFieldValue: jest.fn(),
  setFieldValue: jest.fn(),
  setFields: jest.fn(),
};

jest.mock('antd', () => {
  const Input = ({ onChange, ...props }: any) => (
    <input
      data-testid="input-email-edu"
      onChange={onChange}
      {...props}
    />
  );

  return {
    Form: {
      useFormInstance: () => formMock,

      Item: ({ children, ...props }: any) => {
        formItemMock(props);
        return <div>{children}</div>;
      },
    },

    Input,
  };
});

describe('InputEmailEducacional', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    formMock.getFieldValue.mockReturnValue(undefined);
  });

  it('deve renderizar o input', () => {
    render(<InputEmailEducacional />);

    expect(screen.getByTestId('input-email-edu')).toBeInTheDocument();
  });

it('deve possuir o id correto', () => {
  render(<InputEmailEducacional />);

  expect(screen.getByTestId('input-email-edu')).toHaveAttribute(
    'id',
    CF_INPUT_EMAIL_EDUCACIONAL
  );
});

  it('deve estar desabilitado', () => {
    render(<InputEmailEducacional />);

    expect(screen.getByTestId('input-email-edu')).toBeDisabled();
  });

  it('deve configurar autocomplete', () => {
    render(<InputEmailEducacional />);

    expect(screen.getByTestId('input-email-edu')).toHaveAttribute(
      'autocomplete',
      'off'
    );
  });

  it('deve configurar maxlength', () => {
    render(<InputEmailEducacional />);

    expect(screen.getByTestId('input-email-edu')).toHaveAttribute(
      'maxlength',
      '100'
    );
  });

  it('deve configurar o suffix', () => {
    render(<InputEmailEducacional />);

    const props = screen.getByTestId('input-email-edu');

    expect(props).toHaveAttribute(
      'suffix',
      '@edu.sme.prefeitura.sp.gov.br'
    );
  });

  it('deve configurar o campo como obrigatório', () => {
    render(<InputEmailEducacional />);

    const props = formItemMock.mock.calls[0][0];

    expect(props.rules[0].required).toBe(true);
  });

  it('deve remover espaços e domínio do email', () => {
    formMock.getFieldValue.mockReturnValue(
      ' usuario@edu.sme.prefeitura.sp.gov.br '
    );

    render(<InputEmailEducacional />);

    fireEvent.change(screen.getByTestId('input-email-edu'), {
      target: {
        value: 'teste',
      },
    });

    expect(formMock.setFieldValue).toHaveBeenCalledWith(
      'emailEducacional',
      'usuario'
    );
  });

  it('deve limpar os erros', () => {
    formMock.getFieldValue.mockReturnValue('usuario@edu');

    render(<InputEmailEducacional />);

    fireEvent.change(screen.getByTestId('input-email-edu'), {
      target: {
        value: 'teste',
      },
    });

    expect(formMock.setFields).toHaveBeenCalledWith([
      {
        name: 'emailEducacional',
        errors: [],
      },
    ]);
  });
});