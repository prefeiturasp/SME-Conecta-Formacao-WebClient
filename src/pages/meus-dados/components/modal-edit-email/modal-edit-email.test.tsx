/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import ModalEditEmail from './modal-edit-email';
import usuarioService from '../../../../core/services/usuario-service';
import { CF_INPUT_EMAIL } from '../../../../core/constants/ids/input';

type ModalEditDefaultMockProps = {
  form: unknown;
  title: string;
  service: (values: { email: string }) => unknown;
  updateFields: (values: { email: string }) => void;
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
    email: string;
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

let capturedModalProps: ModalEditDefaultMockProps | undefined;
let capturedInputEmailProps: InputEmailMockProps | undefined;
let capturedFormProps: FormMockProps | undefined;

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
    alterarEmail: jest.fn(),
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
        data-testid='email-form'
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

    return <input data-testid='input-email' />;
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
              email: 'novo@email.com',
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
                email: string;
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
              email: 'email-atualizado@email.com',
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

const mockAlterarEmail =
  usuarioService.alterarEmail as jest.MockedFunction<
    typeof usuarioService.alterarEmail
  >;

describe('ModalEditEmail', () => {
  const initialValues = {
    email: 'email.atual@email.com',
  };

  const mockUpdateFields = jest.fn();
  const mockCloseModal = jest.fn();

  const renderizar = () =>
    render(
      <ModalEditEmail
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

    mockAlterarEmail.mockResolvedValue({
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
        name: 'Alterar e-mail',
      }),
    ).toBeInTheDocument();
  });

  it('envia a instância do formulário ao modal', () => {
    renderizar();

    expect(capturedModalProps?.form).toBe(
      mockFormInstance,
    );
  });

  it('envia a função updateFields ao modal', () => {
    renderizar();

    expect(capturedModalProps?.updateFields).toBe(
      mockUpdateFields,
    );
  });

  it('envia a função closeModal ao modal', () => {
    renderizar();

    expect(capturedModalProps?.closeModal).toBe(
      mockCloseModal,
    );
  });

  it('configura a mensagem de confirmação de cancelamento', () => {
    renderizar();

    const mensagemEsperada =
      'Você não salvou o novo e-mail, confirma que deseja descartar a alteração?';

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
      screen.getByTestId('email-form'),
    ).toHaveAttribute('data-layout', 'vertical');

    expect(
      screen.getByTestId('email-form'),
    ).toHaveAttribute(
      'data-auto-complete',
      'off',
    );
  });

  it('repassa initialValues ao formulário pela mesma referência', () => {
    renderizar();

    expect(capturedFormProps?.initialValues).toBe(
      initialValues,
    );
  });

  it('configura o InputEmail corretamente', () => {
    renderizar();

    expect(capturedInputEmailProps).toEqual({
      inputProps: {
        id: CF_INPUT_EMAIL,
      },
      formItemProps: {
        name: 'email',
        label: 'E-mail',
        style: {
          width: '100%',
          marginRight: '8px',
        },
        required: true,
      },
    });

    expect(
      screen.getByTestId('input-email'),
    ).toBeInTheDocument();
  });

  it('chama o serviço com o login e o novo e-mail', () => {
    renderizar();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Executar serviço',
      }),
    );

    expect(mockAlterarEmail).toHaveBeenCalledTimes(1);

    expect(mockAlterarEmail).toHaveBeenCalledWith(
      'usuario.login',
      'novo@email.com',
    );
  });

  it('retorna exatamente o resultado do serviço', async () => {
    const resposta = {
      sucesso: true,
      dados: {
        email: 'novo@email.com',
      },
    };

    mockAlterarEmail.mockResolvedValue(
      resposta as never,
    );

    renderizar();

    const resultado = capturedModalProps?.service({
      email: 'novo@email.com',
    });

    await expect(resultado).resolves.toBe(resposta);
  });

  it('chama o serviço com login undefined quando não existe usuário autenticado', () => {
    mockAuthState = {
      usuarioLogin: undefined,
    };

    renderizar();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Executar serviço',
      }),
    );

    expect(mockAlterarEmail).toHaveBeenCalledWith(
      undefined,
      'novo@email.com',
    );
  });

  it('chama o serviço com e-mail undefined quando os valores estão ausentes', () => {
    renderizar();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Executar serviço sem valores',
      }),
    );

    expect(mockAlterarEmail).toHaveBeenCalledWith(
      'usuario.login',
      undefined,
    );
  });

  it('permite que o modal atualize os campos do componente pai', () => {
    renderizar();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Atualizar campos',
      }),
    );

    expect(mockUpdateFields).toHaveBeenCalledTimes(1);

    expect(mockUpdateFields).toHaveBeenCalledWith({
      email: 'email-atualizado@email.com',
    });
  });

  it('permite que o modal execute o fechamento', () => {
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
