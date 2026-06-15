/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import InputEmail from './index';

const formItemMock = jest.fn();

const formMock = {
  getFieldValue: jest.fn(),
  setFieldValue: jest.fn(),
  setFields: jest.fn(),
};

jest.mock('antd', () => {
  const Input = (props: any) => (
    <input
      data-testid="input-email"
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

describe('InputEmail', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    formMock.getFieldValue.mockReturnValue(undefined);
  });

  it('deve renderizar o input', () => {
    render(<InputEmail />);

    expect(screen.getByTestId('input-email')).toBeInTheDocument();
  });

  it('deve possuir placeholder', () => {
    render(<InputEmail />);

    expect(screen.getByPlaceholderText('Informe o e-mail')).toBeInTheDocument();
  });

  it('deve configurar autocomplete', () => {
    render(<InputEmail />);

    expect(screen.getByTestId('input-email')).toHaveAttribute(
      'autocomplete',
      'off'
    );
  });

  it('deve configurar maxlength', () => {
    render(<InputEmail />);

    expect(screen.getByTestId('input-email')).toHaveAttribute(
      'maxlength',
      '100'
    );
  });

  it('deve configurar o id', () => {
    render(<InputEmail />);

    expect(screen.getByTestId('input-email')).toHaveAttribute(
      'id',
      'INPUT_EMAIL'
    );
  });

  it('deve configurar required=true', () => {
    render(
      <InputEmail
        formItemProps={{
          required: true,
        }}
      />
    );

    const props = formItemMock.mock.calls[0][0];

    expect(props.rules[0].required).toBe(true);
  });

  it('deve configurar required=false', () => {
    render(<InputEmail />);

    const props = formItemMock.mock.calls[0][0];

    expect(props.rules[0].required).toBe(false);
  });

  it('deve remover espaços do email único', () => {
    formMock.getFieldValue.mockImplementation((campo: string) => {
      if (campo === 'email') {
        return ' teste@email.com ';
      }

      if (campo === 'emails') {
        return undefined;
      }
    });

    render(<InputEmail />);

fireEvent.change(screen.getByTestId('input-email'), {
  target: {
    value: 'teste',
  },
});

    expect(formMock.setFieldValue).toHaveBeenCalledWith(
      'email',
      'teste@email.com'
    );
  });

  it('deve remover espaços da lista de emails', () => {
    formMock.getFieldValue.mockImplementation((campo: string) => {
      if (campo === 'email') {
        return undefined;
      }

      if (campo === 'emails') {
        return [
          { email: ' a@a.com ' },
          { email: ' b@b.com ' },
        ];
      }
    });

    render(<InputEmail />);

fireEvent.change(screen.getByTestId('input-email'), {
  target: {
    value: 'teste',
  },
});

    expect(formMock.setFieldValue).toHaveBeenCalledWith(
      'emails',
      [
        { email: 'a@a.com' },
        { email: 'b@b.com' },
      ]
    );
  });

  it('não deve atualizar email quando estiver vazio', () => {
    formMock.getFieldValue.mockImplementation(() => undefined);

    render(<InputEmail />);

    fireEvent.change(screen.getByTestId('input-email'));

    expect(formMock.setFieldValue).not.toHaveBeenCalledWith(
      'email',
      expect.anything()
    );
  });

  it('deve limpar os erros ao alterar o valor', () => {
    render(<InputEmail />);

    fireEvent.change(screen.getByTestId('input-email'), {
      target: {
        value: 'teste',
      },
    });

    expect(formMock.setFields).toHaveBeenCalledWith([
      {
        name: 'email',
        errors: [],
      },
      {
        name: 'emails',
        errors: [],
      },
    ]);
  });

  it('deve repassar inputProps', () => {
    render(
      <InputEmail
        inputProps={{
          disabled: true,
        }}
      />
    );

    expect(screen.getByTestId('input-email')).toBeDisabled();
  });
});