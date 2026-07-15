/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import ModalEditEmailButton from './modal-edit-email-button';

type ModalEditEmailMockProps = {
  updateFields: (values: { email: string }) => void;
  initialValues: Record<string, unknown>;
  closeModal: () => void;
};

const mockSetFieldValue = jest.fn();
const mockGetFieldsValue = jest.fn();

let capturedModalProps: ModalEditEmailMockProps | undefined;

jest.mock('antd', () => ({
  Button: ({
    children,
    onClick,
  }: {
    children?: React.ReactNode;
    onClick?: () => void;
  }) => (
    <button type='button' onClick={onClick}>
      {children}
    </button>
  ),
}));

jest.mock('./modal-edit-email', () => ({
  __esModule: true,
  default: (props: ModalEditEmailMockProps) => {
    capturedModalProps = props;

    return (
      <div data-testid='modal-edit-email'>
        <span data-testid='initial-values'>
          {JSON.stringify(props.initialValues)}
        </span>

        <button
          type='button'
          onClick={() =>
            props.updateFields({
              email: 'novo@email.com',
            })
          }
        >
          Atualizar e-mail
        </button>

        <button
          type='button'
          onClick={props.closeModal}
        >
          Fechar modal
        </button>
      </div>
    );
  },
}));

describe('ModalEditEmailButton', () => {
  const formPreview = {
    setFieldValue: mockSetFieldValue,
    getFieldsValue: mockGetFieldsValue,
  } as never;

  beforeEach(() => {
    jest.clearAllMocks();
    capturedModalProps = undefined;

    mockGetFieldsValue.mockReturnValue({
      email: 'atual@email.com',
      nome: 'Usuário Teste',
    });
  });

  it('renderiza o botão Alterar', () => {
    render(
      <ModalEditEmailButton
        formPreview={formPreview}
      />,
    );

    expect(
      screen.getByRole('button', {
        name: 'Alterar',
      }),
    ).toBeInTheDocument();
  });

  it('não renderiza o modal inicialmente', () => {
    render(
      <ModalEditEmailButton
        formPreview={formPreview}
      />,
    );

    expect(
      screen.queryByTestId('modal-edit-email'),
    ).not.toBeInTheDocument();

    expect(
      mockGetFieldsValue,
    ).not.toHaveBeenCalled();
  });

  it('abre o modal ao clicar em Alterar', () => {
    render(
      <ModalEditEmailButton
        formPreview={formPreview}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Alterar',
      }),
    );

    expect(
      screen.getByTestId('modal-edit-email'),
    ).toBeInTheDocument();

    expect(mockGetFieldsValue).toHaveBeenCalledTimes(1);
    expect(mockGetFieldsValue).toHaveBeenCalledWith();
  });

  it('envia os valores atuais do formulário como initialValues', () => {
    const valoresAtuais = {
      email: 'atual@email.com',
      nome: 'Usuário Teste',
    };

    mockGetFieldsValue.mockReturnValue(valoresAtuais);

    render(
      <ModalEditEmailButton
        formPreview={formPreview}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Alterar',
      }),
    );

    expect(capturedModalProps?.initialValues).toBe(
      valoresAtuais,
    );

    expect(
      screen.getByTestId('initial-values'),
    ).toHaveTextContent(
      JSON.stringify(valoresAtuais),
    );
  });

  it('atualiza o campo email do formulário', () => {
    render(
      <ModalEditEmailButton
        formPreview={formPreview}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Alterar',
      }),
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Atualizar e-mail',
      }),
    );

    expect(mockSetFieldValue).toHaveBeenCalledTimes(1);

    expect(mockSetFieldValue).toHaveBeenCalledWith(
      'email',
      'novo@email.com',
    );
  });

  it('define undefined quando updateFields recebe email ausente', () => {
    render(
      <ModalEditEmailButton
        formPreview={formPreview}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Alterar',
      }),
    );

    capturedModalProps?.updateFields(
      undefined as unknown as { email: string },
    );

    expect(mockSetFieldValue).toHaveBeenCalledWith(
      'email',
      undefined,
    );
  });

  it('fecha o modal ao executar closeModal', () => {
    render(
      <ModalEditEmailButton
        formPreview={formPreview}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Alterar',
      }),
    );

    expect(
      screen.getByTestId('modal-edit-email'),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Fechar modal',
      }),
    );

    expect(
      screen.queryByTestId('modal-edit-email'),
    ).not.toBeInTheDocument();
  });

  it('permite abrir o modal novamente após fechá-lo', () => {
    render(
      <ModalEditEmailButton
        formPreview={formPreview}
      />,
    );

    const botaoAlterar = screen.getByRole('button', {
      name: 'Alterar',
    });

    fireEvent.click(botaoAlterar);

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Fechar modal',
      }),
    );

    expect(
      screen.queryByTestId('modal-edit-email'),
    ).not.toBeInTheDocument();

    fireEvent.click(botaoAlterar);

    expect(
      screen.getByTestId('modal-edit-email'),
    ).toBeInTheDocument();

    expect(mockGetFieldsValue).toHaveBeenCalledTimes(2);
  });

  it('obtém valores atualizados do formulário a cada abertura', () => {
    mockGetFieldsValue
      .mockReturnValueOnce({
        email: 'primeiro@email.com',
      })
      .mockReturnValueOnce({
        email: 'segundo@email.com',
      });

    render(
      <ModalEditEmailButton
        formPreview={formPreview}
      />,
    );

    const botaoAlterar = screen.getByRole('button', {
      name: 'Alterar',
    });

    fireEvent.click(botaoAlterar);

    expect(capturedModalProps?.initialValues).toEqual({
      email: 'primeiro@email.com',
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Fechar modal',
      }),
    );

    fireEvent.click(botaoAlterar);

    expect(capturedModalProps?.initialValues).toEqual({
      email: 'segundo@email.com',
    });

    expect(mockGetFieldsValue).toHaveBeenCalledTimes(2);
  });
});
