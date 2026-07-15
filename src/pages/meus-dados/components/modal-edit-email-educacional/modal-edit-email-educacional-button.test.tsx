/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import ModalEditEmailEducacionalButton from './modal-edit-email-educacional-button';

type ModalEditEmailEducacionalMockProps = {
  updateFields: (values: {
    emailEducacional: string;
  }) => void;
  initialValues: Record<string, unknown>;
  closeModal: () => void;
};

const mockSetFieldValue = jest.fn();
const mockGetFieldsValue = jest.fn();

let capturedModalProps:
  | ModalEditEmailEducacionalMockProps
  | undefined;

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

jest.mock('./modal-edit-email-educacional', () => ({
  __esModule: true,
  default: (
    props: ModalEditEmailEducacionalMockProps,
  ) => {
    capturedModalProps = props;

    return (
      <div data-testid='modal-edit-email-educacional'>
        <span data-testid='initial-values'>
          {JSON.stringify(props.initialValues)}
        </span>

        <button
          type='button'
          onClick={() =>
            props.updateFields({
              emailEducacional:
                'novo.educacional@instituicao.edu.br',
            })
          }
        >
          Atualizar e-mail educacional
        </button>

        <button
          type='button'
          onClick={() =>
            props.updateFields(
              undefined as unknown as {
                emailEducacional: string;
              },
            )
          }
        >
          Atualizar sem valores
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

describe('ModalEditEmailEducacionalButton', () => {
  const formPreview = {
    setFieldValue: mockSetFieldValue,
    getFieldsValue: mockGetFieldsValue,
  } as never;

  beforeEach(() => {
    jest.clearAllMocks();

    capturedModalProps = undefined;

    mockGetFieldsValue.mockReturnValue({
      emailEducacional:
        'atual.educacional@instituicao.edu.br',
      nome: 'Usuário Teste',
    });
  });

  it('renderiza o botão Alterar', () => {
    render(
      <ModalEditEmailEducacionalButton
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
      <ModalEditEmailEducacionalButton
        formPreview={formPreview}
      />,
    );

    expect(
      screen.queryByTestId(
        'modal-edit-email-educacional',
      ),
    ).not.toBeInTheDocument();

    expect(
      mockGetFieldsValue,
    ).not.toHaveBeenCalled();
  });

  it('abre o modal ao clicar em Alterar', () => {
    render(
      <ModalEditEmailEducacionalButton
        formPreview={formPreview}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Alterar',
      }),
    );

    expect(
      screen.getByTestId(
        'modal-edit-email-educacional',
      ),
    ).toBeInTheDocument();

    expect(
      mockGetFieldsValue,
    ).toHaveBeenCalledTimes(1);

    expect(
      mockGetFieldsValue,
    ).toHaveBeenCalledWith();
  });

  it('envia os valores atuais do formulário como initialValues', () => {
    const valoresAtuais = {
      emailEducacional:
        'atual.educacional@instituicao.edu.br',
      nome: 'Usuário Teste',
    };

    mockGetFieldsValue.mockReturnValue(valoresAtuais);

    render(
      <ModalEditEmailEducacionalButton
        formPreview={formPreview}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Alterar',
      }),
    );

    expect(
      capturedModalProps?.initialValues,
    ).toBe(valoresAtuais);

    expect(
      screen.getByTestId('initial-values'),
    ).toHaveTextContent(
      JSON.stringify(valoresAtuais),
    );
  });

  it('atualiza o campo emailEducacional do formulário', () => {
    render(
      <ModalEditEmailEducacionalButton
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
        name: 'Atualizar e-mail educacional',
      }),
    );

    expect(
      mockSetFieldValue,
    ).toHaveBeenCalledTimes(1);

    expect(
      mockSetFieldValue,
    ).toHaveBeenCalledWith(
      'emailEducacional',
      'novo.educacional@instituicao.edu.br',
    );
  });

  it('define undefined quando updateFields recebe valores ausentes', () => {
    render(
      <ModalEditEmailEducacionalButton
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
        name: 'Atualizar sem valores',
      }),
    );

    expect(
      mockSetFieldValue,
    ).toHaveBeenCalledWith(
      'emailEducacional',
      undefined,
    );
  });

  it('fecha o modal ao executar closeModal', () => {
    render(
      <ModalEditEmailEducacionalButton
        formPreview={formPreview}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Alterar',
      }),
    );

    expect(
      screen.getByTestId(
        'modal-edit-email-educacional',
      ),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Fechar modal',
      }),
    );

    expect(
      screen.queryByTestId(
        'modal-edit-email-educacional',
      ),
    ).not.toBeInTheDocument();
  });

  it('permite reabrir o modal depois de fechá-lo', () => {
    render(
      <ModalEditEmailEducacionalButton
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

    fireEvent.click(botaoAlterar);

    expect(
      screen.getByTestId(
        'modal-edit-email-educacional',
      ),
    ).toBeInTheDocument();

    expect(
      mockGetFieldsValue,
    ).toHaveBeenCalledTimes(2);
  });

  it('obtém os valores mais recentes do formulário a cada abertura', () => {
    mockGetFieldsValue
      .mockReturnValueOnce({
        emailEducacional:
          'primeiro@instituicao.edu.br',
      })
      .mockReturnValueOnce({
        emailEducacional:
          'segundo@instituicao.edu.br',
      });

    render(
      <ModalEditEmailEducacionalButton
        formPreview={formPreview}
      />,
    );

    const botaoAlterar = screen.getByRole('button', {
      name: 'Alterar',
    });

    fireEvent.click(botaoAlterar);

    expect(
      capturedModalProps?.initialValues,
    ).toEqual({
      emailEducacional:
        'primeiro@instituicao.edu.br',
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Fechar modal',
      }),
    );

    fireEvent.click(botaoAlterar);

    expect(
      capturedModalProps?.initialValues,
    ).toEqual({
      emailEducacional:
        'segundo@instituicao.edu.br',
    });

    expect(
      mockGetFieldsValue,
    ).toHaveBeenCalledTimes(2);
  });

  it('mantém as funções esperadas nas propriedades do modal', () => {
    render(
      <ModalEditEmailEducacionalButton
        formPreview={formPreview}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Alterar',
      }),
    );

    expect(
      capturedModalProps?.updateFields,
    ).toEqual(expect.any(Function));

    expect(
      capturedModalProps?.closeModal,
    ).toEqual(expect.any(Function));
  });
});
