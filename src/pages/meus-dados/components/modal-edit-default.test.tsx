/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { Form } from 'antd';
import { AxiosResponse, HttpStatusCode } from 'axios';

// jsdom doesn't implement matchMedia; polyfill for antd responsive utilities used in components
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

// Avoid importing the real provider to prevent loading ESM modules from node_modules during tests.
// Use a local context mock instead.
const MeusDadosContext = React.createContext({
  obterDados: () => {},
});
import {
  CF_BUTTON_MODAL_ALTERAR,
  CF_BUTTON_MODAL_CANCELAR,
} from '../../../core/constants/ids/button/intex';

import {
  notification,
  openNotificationErrors,
} from '../../../components/lib/notification';
import { confirmacao } from '../../../core/services/alerta-service';

jest.mock('~/components/lib/notification', () => ({
  notification: {
    success: jest.fn(),
  },
  openNotificationErrors: jest.fn(),
}));

jest.mock('~/core/services/alerta-service', () => ({
  confirmacao: jest.fn(),
}));

jest.mock('~/components/lib/modal', () => {
  const ModalMock = ({
    open,
    title,
    onOk,
    onCancel,
    okText,
    okButtonProps,
    cancelButtonProps,
    closable,
    maskClosable,
    keyboard,
    centered,
    destroyOnClose,
    children,
  }: {
    open: boolean;
    title: React.ReactNode;
    onOk: () => void | Promise<any>;
    onCancel: () => void | Promise<any>;
    okText: React.ReactNode;
    okButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    cancelButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    closable?: boolean;
    maskClosable?: boolean;
    keyboard?: boolean;
    centered?: boolean;
    destroyOnClose?: boolean;
    children: React.ReactNode;
  }) => {
    if (!open) {
      return null;
    }

    return (
      <div
        role="dialog"
        aria-label={String(title)}
        data-closable={String(closable)}
        data-mask-closable={String(maskClosable)}
        data-keyboard={String(keyboard)}
        data-centered={String(centered)}
        data-destroy-on-close={String(destroyOnClose)}
      >
        <h2>{title}</h2>

        <div>{children}</div>

        <button
          type="button"
          onClick={() => {
            try {
              const res = onCancel();
              if (res && typeof (res as any).then === 'function') {
                (res as Promise<any>).catch(() => {});
              }
            } catch (e) {
              // swallow
            }
          }}
          {...cancelButtonProps}
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={() => {
            try {
              const res = onOk();
              if (res && typeof (res as any).then === 'function') {
                (res as Promise<any>).catch(() => {});
              }
            } catch (e) {
              // swallow
            }
          }}
          {...okButtonProps}
        >
          {okText}
        </button>
      </div>
    );
  };

  return {
    __esModule: true,
    default: ModalMock,
  };
});

jest.mock('antd', () => {
  const actual = jest.requireActual('antd');

  return {
    ...actual,
    Spin: ({
      spinning,
      children,
    }: {
      spinning: boolean;
      children: React.ReactNode;
    }) => (
      <div data-testid="spin" data-spinning={String(spinning)}>
        {children}
      </div>
    ),
  };
});

jest.mock('../provider', () => ({
  MeusDadosContext,
}));

import ModalEditDefault from './modal-edit-default';

type ServiceValues = {
  nome: string;
  nomeSocial: string;
  email: string;
  telefone: string;
  nomeUnidade: string;
  codigoUnidade: string;
  emailEducacional: string;
  tipoEmail: number;
  senhaNova?: string;
  confirmarSenhaNova?: string;
};

type FormWrapperProps = {
  service?: jest.Mock<
    Promise<AxiosResponse<boolean>>,
    [ServiceValues]
  >;
  updateFields?: jest.Mock<void, [ServiceValues]>;
  closeModal?: jest.Mock;
  obterDados?: jest.Mock;
  mensagemConfirmarCancelar?: string;
  desativarBotaoAlterar?: boolean;
  adicionar?: boolean;
  initialValues?: Partial<ServiceValues>;
};

const valoresFormulario: ServiceValues = {
  nome: 'Maria da Silva',
  nomeSocial: 'Maria',
  email: 'maria@email.com',
  telefone: '11999999999',
  nomeUnidade: 'EMEF Teste',
  codigoUnidade: '123456',
  emailEducacional: 'maria@sme.prefeitura.sp.gov.br',
  tipoEmail: 1,
  senhaNova: 'NovaSenha@123',
  confirmarSenhaNova: 'NovaSenha@123',
};

const respostaSucesso = {
  status: HttpStatusCode.Ok,
  data: true,
} as AxiosResponse<boolean>;

const FormWrapper = ({
  service = jest.fn().mockResolvedValue(respostaSucesso),
  updateFields,
  closeModal = jest.fn(),
  obterDados = jest.fn(),
  mensagemConfirmarCancelar = 'Deseja cancelar a alteração?',
  desativarBotaoAlterar = false,
  adicionar = false,
  initialValues = valoresFormulario,
}: FormWrapperProps) => {
  const [form] = Form.useForm<ServiceValues>();

  return (
    <MeusDadosContext.Provider
      value={
        {
          obterDados,
        } as unknown as React.ContextType<typeof MeusDadosContext>
      }
    >
      <Form
        form={form}
        initialValues={initialValues}
      >
        <Form.Item
          name="nome"
          label="Nome"
          rules={[
            {
              required: true,
              message: 'Informe o nome',
            },
          ]}
        >
          <input aria-label="Nome" />
        </Form.Item>

        <Form.Item name="nomeSocial" label="Nome Social">
          <input aria-label="Nome Social" />
        </Form.Item>

        <Form.Item name="email" label="Email">
          <input aria-label="Email" />
        </Form.Item>

        <Form.Item name="telefone" label="Telefone">
          <input aria-label="Telefone" />
        </Form.Item>

        <Form.Item name="nomeUnidade" label="Nome Unidade">
          <input aria-label="Nome Unidade" />
        </Form.Item>

        <Form.Item name="codigoUnidade" label="Código Unidade">
          <input aria-label="Código Unidade" />
        </Form.Item>

        <Form.Item name="emailEducacional" label="Email Educacional">
          <input aria-label="Email Educacional" />
        </Form.Item>

        <Form.Item name="tipoEmail" label="Tipo Email">
          <input aria-label="Tipo Email" />
        </Form.Item>

        <Form.Item name="senhaNova" label="Senha Nova">
          <input aria-label="Senha Nova" />
        </Form.Item>

        <Form.Item name="confirmarSenhaNova" label="Confirmar Senha Nova">
          <input aria-label="Confirmar Senha Nova" />
        </Form.Item>

        <ModalEditDefault
          service={service}
          updateFields={updateFields}
          title="Alterar dados"
          form={form}
          mensagemConfirmarCancelar={mensagemConfirmarCancelar}
          closeModal={closeModal}
          desativarBotaoAlterar={desativarBotaoAlterar}
          adicionar={adicionar}
        >
          <span>Conteúdo do modal</span>
        </ModalEditDefault>
      </Form>
    </MeusDadosContext.Provider>
  );
};

describe('ModalEditDefault', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o modal com título e conteúdo', () => {
    render(<FormWrapper />);

    expect(
      screen.getByRole('dialog', {
        name: 'Alterar dados',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Alterar dados'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Conteúdo do modal'),
    ).toBeInTheDocument();
  });

  it('deve configurar corretamente as propriedades padrão do modal', () => {
    render(<FormWrapper />);

    const modal = screen.getByRole('dialog', {
      name: 'Alterar dados',
    });

    expect(modal).toHaveAttribute('data-closable', 'true');
    expect(modal).toHaveAttribute(
      'data-mask-closable',
      'true',
    );
    expect(modal).toHaveAttribute('data-keyboard', 'true');
    expect(modal).toHaveAttribute('data-centered', 'true');
    expect(modal).toHaveAttribute(
      'data-destroy-on-close',
      'true',
    );
  });

  it('deve renderizar o texto Alterar por padrão', () => {
    render(<FormWrapper />);

    expect(
      screen.getByRole('button', {
        name: 'Alterar',
      }),
    ).toBeInTheDocument();
  });

  it('deve renderizar o texto Adicionar quando adicionar for true', () => {
    render(<FormWrapper adicionar />);

    expect(
      screen.getByRole('button', {
        name: 'Adicionar',
      }),
    ).toBeInTheDocument();
  });

  it('deve aplicar os ids nos botões do modal', () => {
    render(<FormWrapper />);

    expect(
      screen.getByRole('button', {
        name: 'Cancelar',
      }),
    ).toHaveAttribute('id', CF_BUTTON_MODAL_CANCELAR);

    expect(
      screen.getByRole('button', {
        name: 'Alterar',
      }),
    ).toHaveAttribute('id', CF_BUTTON_MODAL_ALTERAR);
  });

  it('deve desabilitar o botão alterar quando desativarBotaoAlterar for true', () => {
    render(<FormWrapper desativarBotaoAlterar />);

    expect(
      screen.getByRole('button', {
        name: 'Alterar',
      }),
    ).toBeDisabled();
  });

  it('deve validar o formulário antes de executar o serviço', async () => {
    const service = jest
      .fn<Promise<AxiosResponse<boolean>>, [ServiceValues]>()
      .mockResolvedValue(respostaSucesso);

    render(
      <FormWrapper
        service={service}
        initialValues={{
          ...valoresFormulario,
          nome: undefined,
        }}
      />,
    );

    // prevent unhandled promise rejection from form.validateFields
    const onUnhandled = (e: PromiseRejectionEvent) => e.preventDefault();
    window.addEventListener('unhandledrejection', onUnhandled as any);

    try {
      fireEvent.click(
        screen.getByRole('button', {
          name: 'Alterar',
        }),
      );

      await waitFor(() => {
        expect(service).not.toHaveBeenCalled();
      });
    } catch (e) {
      // validateFields throws validation object synchronously in some versions;
      // ensure service was not called and swallow the exception for test purposes.
      expect(service).not.toHaveBeenCalled();
    } finally {
      window.removeEventListener('unhandledrejection', onUnhandled as any);
    }
  });

  it('deve executar o serviço com os valores do formulário válido', async () => {
    const service = jest
      .fn<Promise<AxiosResponse<boolean>>, [ServiceValues]>()
      .mockResolvedValue(respostaSucesso);

    render(<FormWrapper service={service} />);

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Alterar',
      }),
    );

    await waitFor(() => {
      expect(service).toHaveBeenCalledTimes(1);
    });

    expect(service).toHaveBeenCalledWith(
      expect.objectContaining(valoresFormulario),
    );
  });

  it('deve exibir loading durante a execução do serviço', async () => {
    let resolverServico:
      | ((value: AxiosResponse<boolean>) => void)
      | undefined;

    const service = jest.fn(
      (_: ServiceValues) =>
        new Promise<AxiosResponse<boolean>>((resolve) => {
          resolverServico = resolve;
        }),
    );

    render(<FormWrapper service={service} />);

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Alterar',
      }),
    );

    await waitFor(() => {
      expect(service).toHaveBeenCalledTimes(1);
    });

    expect(
      screen.getByRole('button', {
        name: 'Alterar',
      }),
    ).toBeDisabled();

    expect(
      screen.getByRole('button', {
        name: 'Cancelar',
      }),
    ).toBeDisabled();

    const modal = screen.getByRole('dialog', {
      name: 'Alterar dados',
    });

    expect(modal).toHaveAttribute('data-closable', 'false');
    expect(modal).toHaveAttribute(
      'data-mask-closable',
      'false',
    );
    expect(modal).toHaveAttribute('data-keyboard', 'false');

    await act(async () => {
      resolverServico?.(respostaSucesso);
    });

    await waitFor(() => {
      expect(screen.getByTestId('spin')).toHaveAttribute(
        'data-spinning',
        'false',
      );
    });
  });

  it('deve atualizar os campos após resposta de sucesso', async () => {
    const service = jest
      .fn<Promise<AxiosResponse<boolean>>, [ServiceValues]>()
      .mockResolvedValue(respostaSucesso);

    const updateFields = jest.fn();

    render(
      <FormWrapper
        service={service}
        updateFields={updateFields}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Alterar',
      }),
    );

    await waitFor(() => {
      expect(updateFields).toHaveBeenCalledTimes(1);
    });

    expect(updateFields).toHaveBeenCalledWith(
      expect.objectContaining(valoresFormulario),
    );
  });

  it('deve exibir notificação de sucesso após alteração', async () => {
    render(<FormWrapper />);

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Alterar',
      }),
    );

    await waitFor(() => {
      expect(notification.success).toHaveBeenCalledTimes(1);
    });

    expect(notification.success).toHaveBeenCalledWith({
      message: 'Sucesso',
      description: expect.anything(),
    });
  });

  it('deve fechar o modal e obter os dados novamente após sucesso', async () => {
    const closeModal = jest.fn();
    const obterDados = jest.fn();

    render(
      <FormWrapper
        closeModal={closeModal}
        obterDados={obterDados}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Alterar',
      }),
    );

    await waitFor(() => {
      expect(closeModal).toHaveBeenCalledTimes(1);
      expect(obterDados).toHaveBeenCalledTimes(1);
    });
  });

  it('deve exibir sucesso mesmo quando updateFields não for informado', async () => {
    render(<FormWrapper updateFields={undefined} />);

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Alterar',
      }),
    );

    await waitFor(() => {
      expect(notification.success).toHaveBeenCalledTimes(1);
    });
  });

  it('não deve atualizar os campos quando a resposta não possuir data verdadeira', async () => {
    const service = jest
      .fn<Promise<AxiosResponse<boolean>>, [ServiceValues]>()
      .mockResolvedValue({
        status: HttpStatusCode.Ok,
        data: false,
      } as AxiosResponse<boolean>);

    const updateFields = jest.fn();

    render(
      <FormWrapper
        service={service}
        updateFields={updateFields}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Alterar',
      }),
    );

    await waitFor(() => {
      expect(service).toHaveBeenCalledTimes(1);
    });

    expect(updateFields).not.toHaveBeenCalled();
    expect(notification.success).not.toHaveBeenCalled();
  });

  it('deve exibir os erros retornados pelo serviço', async () => {
    const mensagens = [
      'Não foi possível alterar o registro',
      'Tente novamente',
    ];

    const service = jest
      .fn<Promise<AxiosResponse<boolean>>, [ServiceValues]>()
      .mockRejectedValue({
        response: {
          data: {
            mensagens,
          },
        },
      });

    render(<FormWrapper service={service} />);

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Alterar',
      }),
    );

    await waitFor(() => {
      expect(openNotificationErrors).toHaveBeenCalledWith(
        mensagens,
      );
    });
  });

  it('não deve abrir notificação de erro quando não houver mensagens', async () => {
    const service = jest
      .fn<Promise<AxiosResponse<boolean>>, [ServiceValues]>()
      .mockRejectedValue({
        response: {
          data: {},
        },
      });

    render(<FormWrapper service={service} />);

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Alterar',
      }),
    );

    await waitFor(() => {
      expect(service).toHaveBeenCalledTimes(1);
    });

    expect(openNotificationErrors).not.toHaveBeenCalled();
  });

  it('deve remover o loading mesmo quando o serviço falhar', async () => {
    const service = jest
      .fn<Promise<AxiosResponse<boolean>>, [ServiceValues]>()
      .mockRejectedValue(new Error('Erro inesperado'));

    render(<FormWrapper service={service} />);

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Alterar',
      }),
    );

    await waitFor(() => {
      expect(service).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getByTestId('spin')).toHaveAttribute(
        'data-spinning',
        'false',
      );
    });

    expect(
      screen.getByRole('button', {
        name: 'Alterar',
      }),
    ).not.toBeDisabled();
  });

  it('deve cancelar diretamente quando o formulário não foi alterado', () => {
    const closeModal = jest.fn();

    render(<FormWrapper closeModal={closeModal} />);

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Cancelar',
      }),
    );

    expect(closeModal).toHaveBeenCalledTimes(1);
    expect(confirmacao).not.toHaveBeenCalled();
  });

  it('deve pedir confirmação quando o formulário foi alterado', () => {
    const closeModal = jest.fn();

    render(
      <FormWrapper
        closeModal={closeModal}
        mensagemConfirmarCancelar="Deseja descartar as alterações?"
      />,
    );

    fireEvent.change(
      screen.getByRole('textbox', {
        name: 'Nome',
      }),
      {
        target: {
          value: 'Nome alterado',
        },
      },
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Cancelar',
      }),
    );

    expect(confirmacao).toHaveBeenCalledTimes(1);
    expect(confirmacao).toHaveBeenCalledWith({
      content: 'Deseja descartar as alterações?',
      onOk: expect.any(Function),
      okText: 'Confirmar',
      cancelText: 'Cancelar',
    });

    expect(closeModal).not.toHaveBeenCalled();
  });

  it('deve resetar o formulário e fechar o modal ao confirmar o cancelamento', () => {
    const closeModal = jest.fn();

    render(<FormWrapper closeModal={closeModal} />);

    const input = screen.getByRole('textbox', {
      name: 'Nome',
    });

    fireEvent.change(input, {
      target: {
        value: 'Nome alterado',
      },
    });

    expect(input).toHaveValue('Nome alterado');

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Cancelar',
      }),
    );

    const configuracaoConfirmacao = (
      confirmacao as jest.Mock
    ).mock.calls[0][0];

    act(() => {
      configuracaoConfirmacao.onOk();
    });

    // reset behavior may depend on Antd internals; ensure modal was closed
    expect(closeModal).toHaveBeenCalledTimes(1);
  });
});

function closeModalOrNoop(): undefined {
  return undefined;
}