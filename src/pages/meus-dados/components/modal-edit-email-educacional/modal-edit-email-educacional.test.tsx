/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import ModalEditEmailEducacional from './modal-edit-email-educacional';
import usuarioService from '../../../../core/services/usuario-service';
import { CF_INPUT_EMAIL_EDUCACIONAL } from '../../../../core/constants/ids/input';

type ModalEditDefaultMockProps = {
  form: unknown;
  title: string;
  service: (values: {
    emailEducacional: string;
  }) => unknown;
  updateFields: (values: {
    emailEducacional: string;
  }) => void;
  mensagemConfirmarCancelar: string;
  closeModal: () => void;
  children?: React.ReactNode;
};

type InputEmailMockProps = {
  inputProps?: {
    id?: string;
  };
  formItemProps?: {
    name?: string;
    label?: React.ReactNode;
    style?: React.CSSProperties;
    required?: boolean;
  };
};

type FormMockProps = {
  form?: unknown;
  layout?: string;
  autoComplete?: string;
  initialValues?: {
    emailEducacional: string;
  };
  validateMessages?: {
    required?: string;
  };
  children?: React.ReactNode;
};

const mockFormInstance = {
  validateFields: jest.fn(),
  resetFields: jest.fn(),
};

let mockAuthState: {
  usuarioLogin?: string;
};

let capturedModalProps:
  | ModalEditDefaultMockProps
  | undefined;

let capturedInputEmailProps:
  | InputEmailMockProps
  | undefined;

let capturedFormProps:
  | FormMockProps
  | undefined;

jest.mock('antd/es/form/Form', () => ({
  useForm: jest.fn(() => [mockFormInstance]),
}));

jest.mock('~/core/hooks/use-redux', () => ({
  useAppSelector: (
    selector: (store: {
      auth: typeof mockAuthState;
    }) => unknown,
  ) =>
    selector({
      auth: mockAuthState,
    }),
}));

jest.mock('~/core/services/usuario-service', () => ({
  __esModule: true,
  default: {
    alterarEmailEducacional: jest.fn(),
  },
}));

jest.mock('antd', () => ({
  Form: ({
    form,
    layout,
    autoComplete,
    initialValues,
    validateMessages,
    children,
  }: FormMockProps) => {
    capturedFormProps = {
      form,
      layout,
      autoComplete,
      initialValues,
      validateMessages,
      children,
    };

    return (
      <form
        data-testid='email-educacional-form'
        data-layout={layout}
        data-auto-complete={autoComplete}
      >
        {children}
      </form>
    );
  },
}));

jest.mock('~/components/main/input/email', () => ({
  __esModule: true,
  default: (props: InputEmailMockProps) => {
    capturedInputEmailProps = props;

    return (
      <input data-testid='input-email-educacional' />
    );
  },
}));

jest.mock('../modal-edit-default', () => ({
  __esModule: true,
  default: (props: ModalEditDefaultMockProps) => {
    capturedModalProps = props;

    return (
      <div data-testid='modal-edit-default'>
        <h1>{props.title}</h1>

        <span data-testid='mensagem-cancelamento'>
          {props.mensagemConfirmarCancelar}
        </span>

        {props.children}

        <button
          type='button'
          onClick={() =>
            props.service({
              emailEducacional:
                'novo.educacional@instituicao.edu.br',
            })
          }
        >
          Executar serviço
        </button>

        <button
          type='button'
          onClick={() =>
            props.service(
              undefined as unknown as {
                emailEducacional: string;
              },
            )
          }
        >
          Executar serviço sem valores
        </button>

        <button
          type='button'
          onClick={() =>
            props.updateFields({
              emailEducacional:
                'email.atualizado@instituicao.edu.br',
            })
          }
        >
          Atualizar campos
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

const mockAlterarEmailEducacional =
  usuarioService
    .alterarEmailEducacional as jest.MockedFunction<
    typeof usuarioService.alterarEmailEducacional
  >;

describe('ModalEditEmailEducacional', () => {
  const initialValues = {
    emailEducacional:
      'email.atual@instituicao.edu.br',
  };

  const mockUpdateFields = jest.fn();
  const mockCloseModal = jest.fn();

  const renderizar = () =>
    render(
      <ModalEditEmailEducacional
        initialValues={initialValues}
        updateFields={mockUpdateFields}
        closeModal={mockCloseModal}
      />,
    );

  beforeEach(() => {
    jest.clearAllMocks();

    capturedModalProps = undefined;
    capturedInputEmailProps = undefined;
    capturedFormProps = undefined;

    mockAuthState = {
      usuarioLogin: 'usuario.login',
    };

    mockAlterarEmailEducacional.mockResolvedValue({
      sucesso: true,
    } as never);
  });

  it('renderiza o modal com o título correto', () => {
    renderizar();

    expect(
      screen.getByTestId('modal-edit-default'),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: 'Alterar e-mail educacional',
      }),
    ).toBeInTheDocument();
  });

  it('envia a instância do formulário ao modal', () => {
    renderizar();

    expect(capturedModalProps?.form).toBe(
      mockFormInstance,
    );
  });

  it('envia updateFields ao modal', () => {
    renderizar();

    expect(capturedModalProps?.updateFields).toBe(
      mockUpdateFields,
    );
  });

  it('envia closeModal ao modal', () => {
    renderizar();

    expect(capturedModalProps?.closeModal).toBe(
      mockCloseModal,
    );
  });

  it('configura a mensagem de confirmação de cancelamento', () => {
    renderizar();

    const mensagemEsperada =
      'Você não salvou o novo e-mail educacional, confirma que deseja descartar a alteração?';

    expect(
      capturedModalProps?.mensagemConfirmarCancelar,
    ).toBe(mensagemEsperada);

    expect(
      screen.getByTestId('mensagem-cancelamento'),
    ).toHaveTextContent(mensagemEsperada);
  });

  it('configura o formulário corretamente', () => {
    renderizar();

    expect(capturedFormProps).toEqual(
      expect.objectContaining({
        form: mockFormInstance,
        layout: 'vertical',
        autoComplete: 'off',
        initialValues,
        validateMessages: {
          required: 'Campo obrigatório',
        },
      }),
    );

    expect(
      screen.getByTestId('email-educacional-form'),
    ).toHaveAttribute('data-layout', 'vertical');

    expect(
      screen.getByTestId('email-educacional-form'),
    ).toHaveAttribute(
      'data-auto-complete',
      'off',
    );
  });

  it('mantém a mesma referência de initialValues', () => {
    renderizar();

    expect(capturedFormProps?.initialValues).toBe(
      initialValues,
    );
  });

  it('configura o InputEmail corretamente', () => {
    renderizar();

    expect(capturedInputEmailProps).toEqual({
      inputProps: {
        id: CF_INPUT_EMAIL_EDUCACIONAL,
      },
      formItemProps: {
        name: 'emailEducacional',
        label: 'E-mail Educacional',
        style: {
          width: '100%',
          marginRight: '8px',
        },
        required: true,
      },
    });

    expect(
      screen.getByTestId(
        'input-email-educacional',
      ),
    ).toBeInTheDocument();
  });

  it('chama o serviço com login e e-mail educacional', () => {
    renderizar();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Executar serviço',
      }),
    );

    expect(
      mockAlterarEmailEducacional,
    ).toHaveBeenCalledTimes(1);

    expect(
      mockAlterarEmailEducacional,
    ).toHaveBeenCalledWith(
      'usuario.login',
      'novo.educacional@instituicao.edu.br',
    );
  });

  it('retorna exatamente o resultado do serviço', async () => {
    const resposta = {
      sucesso: true,
      dados: {
        emailEducacional:
          'novo.educacional@instituicao.edu.br',
      },
    };

    mockAlterarEmailEducacional.mockResolvedValue(
      resposta as never,
    );

    renderizar();

    const resultado =
      capturedModalProps?.service({
        emailEducacional:
          'novo.educacional@instituicao.edu.br',
      });

    await expect(resultado).resolves.toBe(resposta);
  });

  it('chama o serviço com login undefined quando não há usuário autenticado', () => {
    mockAuthState = {
      usuarioLogin: undefined,
    };

    renderizar();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Executar serviço',
      }),
    );

    expect(
      mockAlterarEmailEducacional,
    ).toHaveBeenCalledWith(
      undefined,
      'novo.educacional@instituicao.edu.br',
    );
  });

  it('chama o serviço com e-mail undefined quando values está ausente', () => {
    renderizar();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Executar serviço sem valores',
      }),
    );

    expect(
      mockAlterarEmailEducacional,
    ).toHaveBeenCalledWith(
      'usuario.login',
      undefined,
    );
  });

  it('permite que o modal atualize os campos externos', () => {
    renderizar();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Atualizar campos',
      }),
    );

    expect(mockUpdateFields).toHaveBeenCalledTimes(1);

    expect(mockUpdateFields).toHaveBeenCalledWith({
      emailEducacional:
        'email.atualizado@instituicao.edu.br',
    });
  });

  it('permite que o modal seja fechado', () => {
    renderizar();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Fechar modal',
      }),
    );

    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it('mantém as referências das callbacks recebidas', () => {
    renderizar();

    expect(capturedModalProps).toEqual(
      expect.objectContaining({
        updateFields: mockUpdateFields,
        closeModal: mockCloseModal,
      }),
    );
  });
});
