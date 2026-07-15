/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import SecaoRetificacoes from './secao-retificacoes';

type RetificacaoOriginal = {
  id: number;
  dataRetificacao: string | null;
  paginaRetificacaoDom: number;
};

type ModalConfirmConfig = {
  title: React.ReactNode;
  content: React.ReactNode;
  okText?: React.ReactNode;
  cancelText?: React.ReactNode;
  okButtonProps?: Record<string, unknown>;
  centered?: boolean;
  onOk?: () => void | Promise<void>;
};

type DatePickerMockProps = {
  disabled?: boolean;
  format?: string;
  placeholder?: string;
  locale?: unknown;
  style?: React.CSSProperties;
  disabledDate?: (current: unknown) => boolean | null | undefined;
};

type InputNumeroMockProps = {
  formItemProps?: {
    label?: React.ReactNode;
    name?: string;
  };
  inputProps?: {
    placeholder?: string;
    maxLength?: number;
    disabled?: boolean;
  };
};

const mockModalConfirm = jest.fn();
const mockNotificationSuccess = jest.fn();
const mockNotificationError = jest.fn();
const mockGetFieldValue = jest.fn();

let mockDatePickerProps: DatePickerMockProps[] = [];
let mockInputNumeroProps: InputNumeroMockProps[] = [];

jest.mock('dayjs', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    endOf: jest.fn(() => 100),
  })),
}));

jest.mock('antd/lib/date-picker/locale/pt_BR', () => ({
  __esModule: true,
  default: {
    locale: 'pt-br',
  },
}));

jest.mock('@ant-design/icons', () => ({
  DeleteOutlined: () => <span data-testid='delete-icon' />,
  PlusOutlined: () => <span data-testid='plus-icon' />,
}));

jest.mock('antd', () => {
  const ReactModule = jest.requireActual<typeof import('react')>('react');

  const Button = ({
    children,
    disabled,
    onClick,
    icon,
    type,
  }: {
    children?: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
    icon?: React.ReactNode;
    type?: string;
  }) => (
    <button
      type='button'
      disabled={disabled}
      onClick={onClick}
      data-button-type={type}
    >
      {icon}
      {children}
    </button>
  );

  const Col = ({
    children,
    xs,
    sm,
    md,
    lg,
    xl,
    span,
  }: {
    children?: React.ReactNode;
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    span?: number;
  }) => (
    <div
      data-testid='antd-col'
      data-xs={xs}
      data-sm={sm}
      data-md={md}
      data-lg={lg}
      data-xl={xl}
      data-span={span}
    >
      {children}
    </div>
  );

  const Row = ({
    children,
    justify,
  }: {
    children?: React.ReactNode;
    justify?: string;
  }) => <div data-justify={justify}>{children}</div>;

  const FormItem = ({
    children,
    label,
    name,
  }: {
    children?:
      | React.ReactNode
      | ((form: { getFieldValue: jest.Mock }) => React.ReactNode);
    label?: React.ReactNode;
    name?: string;
  }) => {
    if (typeof children === 'function') {
      return (
        <>
          {children({
            getFieldValue: mockGetFieldValue,
          })}
        </>
      );
    }

    return (
      <div data-testid='form-item' data-name={name}>
        {label}
        {children}
      </div>
    );
  };

  const DatePicker = (props: DatePickerMockProps) => {
    mockDatePickerProps.push(props);

    return (
      <input
        data-testid='date-picker'
        disabled={props.disabled}
        placeholder={props.placeholder}
      />
    );
  };

  return {
    Button,
    Col,
    Row,
    Form: {
      Item: FormItem,
    },
    DatePicker,
    Modal: {
      confirm: (...args: unknown[]) => mockModalConfirm(...args),
    },
  };
});

jest.mock('~/components/main/numero', () => ({
  __esModule: true,
  default: (props: InputNumeroMockProps) => {
    mockInputNumeroProps.push(props);

    return (
      <input
        data-testid={`input-numero-${props.formItemProps?.name}`}
        disabled={props.inputProps?.disabled}
        placeholder={props.inputProps?.placeholder}
        maxLength={props.inputProps?.maxLength}
      />
    );
  },
}));

jest.mock('~/components/lib/notification', () => ({
  notification: {
    success: (...args: unknown[]) => mockNotificationSuccess(...args),
    error: (...args: unknown[]) => mockNotificationError(...args),
  },
}));

describe('SecaoRetificacoes', () => {
  const mockSetRetificacoes = jest.fn();
  const mockSetContadorRetificacoes = jest.fn();
  const mockSetRetificacoesOriginais = jest.fn();
  const mockAoDeletarRetificacao = jest.fn();

  const mockForm = {
    setFieldValue: jest.fn(),
  };

  const criarProps = (
    overrides: Partial<React.ComponentProps<typeof SecaoRetificacoes>> = {},
  ): React.ComponentProps<typeof SecaoRetificacoes> => ({
    retificacoes: [1],
    setRetificacoes: mockSetRetificacoes,
    contadorRetificacoes: 1,
    setContadorRetificacoes: mockSetContadorRetificacoes,
    retificacoesOriginais: new Map<number, RetificacaoOriginal>(),
    setRetificacoesOriginais: mockSetRetificacoesOriginais,
    form: mockForm,
    camposBaseadosBloqueados: false,
    aoDeletarRetificacao: mockAoDeletarRetificacao,
    podeAdicionarNovaRetificacao: true,
    ...overrides,
  });

  const obterConfiguracaoConfirmacao = (): ModalConfirmConfig => {
    const config = mockModalConfirm.mock.calls[0]?.[0] as
      | ModalConfirmConfig
      | undefined;

    if (!config) {
      throw new Error('Modal.confirm não foi chamado.');
    }

    return config;
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockDatePickerProps = [];
    mockInputNumeroProps = [];

    mockGetFieldValue.mockReturnValue(undefined);
    mockAoDeletarRetificacao.mockResolvedValue({
      sucesso: true,
    });
  });

  it('renderiza o título, a descrição e uma retificação', () => {
    render(<SecaoRetificacoes {...criarProps()} />);

    expect(
      screen.getByText('Retificações'),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Caso haja retificações realizadas/),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Retificação 01'),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: /Nova retificação/,
      }),
    ).toBeEnabled();
  });

  it('formata números de retificação com dois dígitos', () => {
    render(
      <SecaoRetificacoes
        {...criarProps({
          retificacoes: [1, 12],
        })}
      />,
    );

    expect(
      screen.getByText('Retificação 01'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Retificação 12'),
    ).toBeInTheDocument();
  });

  it('usa largura total quando existe somente uma retificação', () => {
    render(<SecaoRetificacoes {...criarProps()} />);

    const colunaDoCard = screen
      .getByText('Retificação 01')
      .closest('[data-testid="antd-col"]');

    expect(colunaDoCard).toHaveAttribute('data-md', '24');
    expect(colunaDoCard).toHaveAttribute('data-lg', '24');
    expect(colunaDoCard).toHaveAttribute('data-xl', '24');
  });

  it('usa metade da largura quando existe mais de uma retificação', () => {
    render(
      <SecaoRetificacoes
        {...criarProps({
          retificacoes: [1, 2],
        })}
      />,
    );

    const colunaDoCard = screen
      .getByText('Retificação 01')
      .closest('[data-testid="antd-col"]');

    expect(colunaDoCard).toHaveAttribute('data-md', '12');
    expect(colunaDoCard).toHaveAttribute('data-lg', '12');
    expect(colunaDoCard).toHaveAttribute('data-xl', '12');
  });

  it('configura corretamente o campo de data', () => {
    render(<SecaoRetificacoes {...criarProps()} />);

    expect(mockDatePickerProps[0]).toEqual(
      expect.objectContaining({
        disabled: false,
        format: 'DD/MM/YYYY',
        placeholder: 'Selecione a data',
        locale: {
          locale: 'pt-br',
        },
        style: {
          width: '100%',
        },
        disabledDate: expect.any(Function),
      }),
    );
  });

  it('desabilita datas posteriores ao final do dia atual', () => {
    render(<SecaoRetificacoes {...criarProps()} />);

    const disabledDate = mockDatePickerProps[0].disabledDate;

    expect(disabledDate).toBeDefined();
    expect(disabledDate?.(101)).toBe(true);
    expect(disabledDate?.(100)).toBe(false);
    expect(disabledDate?.(99)).toBe(false);
    expect(disabledDate?.(null)).toBeNull();
  });

  it('desabilita o campo de página quando a data não está preenchida', () => {
    mockGetFieldValue.mockReturnValue(undefined);

    render(<SecaoRetificacoes {...criarProps()} />);

    expect(mockGetFieldValue).toHaveBeenCalledWith(
      'dataRetificacao01',
    );

    expect(mockInputNumeroProps[0]).toEqual({
      formItemProps: {
        label: expect.anything(),
        name: 'paginaRetificacao01',
      },
      inputProps: {
        placeholder: 'Número da página',
        maxLength: 10,
        disabled: true,
      },
    });

    expect(
      screen.getByTestId('input-numero-paginaRetificacao01'),
    ).toBeDisabled();
  });

  it('habilita o campo de página quando a data está preenchida', () => {
    mockGetFieldValue.mockReturnValue('13/07/2026');

    render(<SecaoRetificacoes {...criarProps()} />);

    expect(mockInputNumeroProps[0].inputProps?.disabled).toBe(
      false,
    );

    expect(
      screen.getByTestId('input-numero-paginaRetificacao01'),
    ).toBeEnabled();
  });

  it('adiciona uma nova retificação', () => {
    render(
      <SecaoRetificacoes
        {...criarProps({
          retificacoes: [1, 2],
          contadorRetificacoes: 2,
        })}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: /Nova retificação/,
      }),
    );

    expect(mockSetContadorRetificacoes).toHaveBeenCalledTimes(1);
    expect(mockSetContadorRetificacoes).toHaveBeenCalledWith(3);

    expect(mockSetRetificacoes).toHaveBeenCalledTimes(1);
    expect(mockSetRetificacoes).toHaveBeenCalledWith([1, 2, 3]);
  });

  it('não adiciona uma retificação quando a inclusão não é permitida', () => {
    render(
      <SecaoRetificacoes
        {...criarProps({
          podeAdicionarNovaRetificacao: false,
        })}
      />,
    );

    const botaoAdicionar = screen.getByRole('button', {
      name: /Nova retificação/,
    });

    expect(botaoAdicionar).toBeDisabled();

    fireEvent.click(botaoAdicionar);

    expect(
      mockSetContadorRetificacoes,
    ).not.toHaveBeenCalled();

    expect(mockSetRetificacoes).not.toHaveBeenCalled();
  });

  it('não adiciona uma retificação quando a propriedade de permissão não é informada', () => {
    render(
      <SecaoRetificacoes
        {...criarProps({
          podeAdicionarNovaRetificacao: undefined,
        })}
      />,
    );

    expect(
      screen.getByRole('button', {
        name: /Nova retificação/,
      }),
    ).toBeDisabled();

    expect(mockSetRetificacoes).not.toHaveBeenCalled();
  });

  it('bloqueia os campos e botões quando os campos baseados estão bloqueados', () => {
    render(
      <SecaoRetificacoes
        {...criarProps({
          camposBaseadosBloqueados: true,
        })}
      />,
    );

    expect(
      screen.getByRole('button', {
        name: /Excluir/,
      }),
    ).toBeDisabled();

    expect(
      screen.getByRole('button', {
        name: /Nova retificação/,
      }),
    ).toBeDisabled();

    expect(screen.getByTestId('date-picker')).toBeDisabled();
  });

  it('limpa os campos sem abrir confirmação quando existe somente uma retificação', () => {
    render(<SecaoRetificacoes {...criarProps()} />);

    fireEvent.click(
      screen.getByRole('button', {
        name: /Excluir/,
      }),
    );

    expect(mockModalConfirm).not.toHaveBeenCalled();

    expect(mockForm.setFieldValue).toHaveBeenNthCalledWith(
      1,
      'dataRetificacao01',
      undefined,
    );

    expect(mockForm.setFieldValue).toHaveBeenNthCalledWith(
      2,
      'paginaRetificacao01',
      undefined,
    );

    expect(mockSetRetificacoes).not.toHaveBeenCalled();
    expect(mockAoDeletarRetificacao).not.toHaveBeenCalled();
  });

  it('abre modal de confirmação ao excluir quando há mais de uma retificação', () => {
    render(
      <SecaoRetificacoes
        {...criarProps({
          retificacoes: [1, 2],
        })}
      />,
    );

    fireEvent.click(
      screen.getAllByRole('button', {
        name: /Excluir/,
      })[0],
    );

    expect(mockModalConfirm).toHaveBeenCalledTimes(1);

    const config = obterConfiguracaoConfirmacao();

    expect(config).toEqual(
      expect.objectContaining({
        title: 'Excluir retificação',
        okText: 'Excluir',
        cancelText: 'Cancelar',
        centered: true,
        onOk: expect.any(Function),
        okButtonProps: {
          style: {
            backgroundColor: 'rgb(255, 154, 82)',
            borderColor: 'rgb(255, 154, 82)',
          },
        },
      }),
    );

    render(<>{config.content}</>);

    expect(
      screen.getAllByText(/Retificação 01/).length,
    ).toBeGreaterThan(0);

    expect(
      screen.getByText(
        'Esta ação não poderá ser desfeita.',
      ),
    ).toBeInTheDocument();
  });

  it('remove uma retificação nova sem chamar a exclusão remota', async () => {
    const retificacoesOriginais = new Map<
      number,
      RetificacaoOriginal
    >();

    render(
      <SecaoRetificacoes
        {...criarProps({
          retificacoes: [1, 2],
          retificacoesOriginais,
        })}
      />,
    );

    fireEvent.click(
      screen.getAllByRole('button', {
        name: /Excluir/,
      })[0],
    );

    const config = obterConfiguracaoConfirmacao();

    await act(async () => {
      await config.onOk?.();
    });

    expect(mockAoDeletarRetificacao).not.toHaveBeenCalled();

    expect(mockSetRetificacoes).toHaveBeenCalledWith([2]);
    expect(retificacoesOriginais.has(1)).toBe(false);

    expect(
      mockSetRetificacoesOriginais,
    ).toHaveBeenCalledWith(new Map());

    expect(mockForm.setFieldValue).toHaveBeenCalledWith(
      'dataRetificacao01',
      undefined,
    );

    expect(mockForm.setFieldValue).toHaveBeenCalledWith(
      'paginaRetificacao01',
      undefined,
    );
  });

  it('remove localmente uma retificação cujo id original não é positivo', async () => {
    const retificacoesOriginais = new Map<
      number,
      RetificacaoOriginal
    >([
      [
        1,
        {
          id: 0,
          dataRetificacao: null,
          paginaRetificacaoDom: 10,
        },
      ],
    ]);

    render(
      <SecaoRetificacoes
        {...criarProps({
          retificacoes: [1, 2],
          retificacoesOriginais,
        })}
      />,
    );

    fireEvent.click(
      screen.getAllByRole('button', {
        name: /Excluir/,
      })[0],
    );

    await act(async () => {
      await obterConfiguracaoConfirmacao().onOk?.();
    });

    expect(mockAoDeletarRetificacao).not.toHaveBeenCalled();
    expect(mockSetRetificacoes).toHaveBeenCalledWith([2]);
    expect(retificacoesOriginais.has(1)).toBe(false);
  });

  it('exclui uma retificação original e exibe notificação de sucesso', async () => {
    const retificacoesOriginais = new Map<
      number,
      RetificacaoOriginal
    >([
      [
        1,
        {
          id: 50,
          dataRetificacao: '2026-07-13',
          paginaRetificacaoDom: 10,
        },
      ],
    ]);

    mockAoDeletarRetificacao.mockResolvedValue({
      sucesso: true,
    });

    render(
      <SecaoRetificacoes
        {...criarProps({
          retificacoes: [1, 2],
          retificacoesOriginais,
        })}
      />,
    );

    fireEvent.click(
      screen.getAllByRole('button', {
        name: /Excluir/,
      })[0],
    );

    await act(async () => {
      await obterConfiguracaoConfirmacao().onOk?.();
    });

    expect(mockAoDeletarRetificacao).toHaveBeenCalledTimes(1);
    expect(mockAoDeletarRetificacao).toHaveBeenCalledWith(50);

    expect(mockNotificationSuccess).toHaveBeenCalledWith({
      message: 'Sucesso',
      description: 'Retificação excluída com sucesso',
    });

    expect(mockNotificationError).not.toHaveBeenCalled();
    expect(mockSetRetificacoes).toHaveBeenCalledWith([2]);
  });

  it('exibe a mensagem retornada pela API e interrompe a exclusão quando ocorre erro de negócio', async () => {
    const retificacoesOriginais = new Map<
      number,
      RetificacaoOriginal
    >([
      [
        1,
        {
          id: 50,
          dataRetificacao: '2026-07-13',
          paginaRetificacaoDom: 10,
        },
      ],
    ]);

    mockAoDeletarRetificacao.mockResolvedValue({
      sucesso: false,
      mensagens: ['Não foi possível excluir o registro'],
    });

    render(
      <SecaoRetificacoes
        {...criarProps({
          retificacoes: [1, 2],
          retificacoesOriginais,
        })}
      />,
    );

    fireEvent.click(
      screen.getAllByRole('button', {
        name: /Excluir/,
      })[0],
    );

    await act(async () => {
      await obterConfiguracaoConfirmacao().onOk?.();
    });

    expect(mockNotificationError).toHaveBeenCalledWith({
      message: 'Erro',
      description: 'Não foi possível excluir o registro',
    });

    expect(mockSetRetificacoes).not.toHaveBeenCalled();
    expect(
      mockSetRetificacoesOriginais,
    ).not.toHaveBeenCalled();
    expect(mockForm.setFieldValue).not.toHaveBeenCalled();
    expect(retificacoesOriginais.has(1)).toBe(true);
  });

  it('usa mensagem padrão quando a API não retorna mensagens de erro', async () => {
    const retificacoesOriginais = new Map<
      number,
      RetificacaoOriginal
    >([
      [
        1,
        {
          id: 50,
          dataRetificacao: null,
          paginaRetificacaoDom: 10,
        },
      ],
    ]);

    mockAoDeletarRetificacao.mockResolvedValue({
      sucesso: false,
    });

    render(
      <SecaoRetificacoes
        {...criarProps({
          retificacoes: [1, 2],
          retificacoesOriginais,
        })}
      />,
    );

    fireEvent.click(
      screen.getAllByRole('button', {
        name: /Excluir/,
      })[0],
    );

    await act(async () => {
      await obterConfiguracaoConfirmacao().onOk?.();
    });

    expect(mockNotificationError).toHaveBeenCalledWith({
      message: 'Erro',
      description: 'Erro ao excluir retificação',
    });

    expect(mockSetRetificacoes).not.toHaveBeenCalled();
  });

  it('usa mensagem padrão quando o primeiro item de mensagens está vazio', async () => {
    const retificacoesOriginais = new Map<
      number,
      RetificacaoOriginal
    >([
      [
        1,
        {
          id: 50,
          dataRetificacao: null,
          paginaRetificacaoDom: 10,
        },
      ],
    ]);

    mockAoDeletarRetificacao.mockResolvedValue({
      sucesso: false,
      mensagens: [''],
    });

    render(
      <SecaoRetificacoes
        {...criarProps({
          retificacoes: [1, 2],
          retificacoesOriginais,
        })}
      />,
    );

    fireEvent.click(
      screen.getAllByRole('button', {
        name: /Excluir/,
      })[0],
    );

    await act(async () => {
      await obterConfiguracaoConfirmacao().onOk?.();
    });

    expect(mockNotificationError).toHaveBeenCalledWith({
      message: 'Erro',
      description: 'Erro ao excluir retificação',
    });
  });

  it('trata exceções lançadas durante a exclusão', async () => {
    const erro = new Error('Falha inesperada');
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    const retificacoesOriginais = new Map<
      number,
      RetificacaoOriginal
    >([
      [
        1,
        {
          id: 50,
          dataRetificacao: '2026-07-13',
          paginaRetificacaoDom: 10,
        },
      ],
    ]);

    mockAoDeletarRetificacao.mockRejectedValue(erro);

    render(
      <SecaoRetificacoes
        {...criarProps({
          retificacoes: [1, 2],
          retificacoesOriginais,
        })}
      />,
    );

    fireEvent.click(
      screen.getAllByRole('button', {
        name: /Excluir/,
      })[0],
    );

    await act(async () => {
      await obterConfiguracaoConfirmacao().onOk?.();
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Erro ao excluir retificação:',
      erro,
    );

    expect(mockNotificationError).toHaveBeenCalledWith({
      message: 'Erro',
      description: 'Erro ao excluir retificação',
    });

    expect(mockSetRetificacoes).not.toHaveBeenCalled();
    expect(
      mockSetRetificacoesOriginais,
    ).not.toHaveBeenCalled();
    expect(mockForm.setFieldValue).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('renderiza corretamente quando não existem retificações', () => {
    render(
      <SecaoRetificacoes
        {...criarProps({
          retificacoes: [],
          contadorRetificacoes: 0,
        })}
      />,
    );

    expect(
      screen.queryByText(/Retificação \d+/),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole('button', {
        name: /Excluir/,
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: /Nova retificação/,
      }),
    ).toBeEnabled();
  });
});
