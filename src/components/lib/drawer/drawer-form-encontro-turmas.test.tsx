/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import React from 'react';

import DrawerFormularioEncontroTurmas from './drawer-form-encontro-turmas';
import {
  removerPropostaEncontro,
  salvarPropostaEncontro,
} from '../../../core/services/proposta-service';
import { notification } from '../../../components/lib/notification';
import { confirmacao } from '../../../core/services/alerta-service';
import { DESEJA_CANCELAR_ALTERACOES } from '../../../core/constants/mensagens';
import { TipoEncontro } from '../../../core/enum/tipo-encontro';
import { CF_BUTTON_EXCLUIR } from '../../../core/constants/ids/button/intex';

type FormValues = {
  local?: string;
  turmas?: number[];
  tipoEncontro?: number;
  datas?: Array<{
    dataInicio?: {
      toISOString: () => string;
    };
    horarios?: Array<{
      format: (pattern: string) => string;
    }>;
  }>;
};

type DrawerMockProps = {
  title?: React.ReactNode;
  open?: boolean;
  size?: string;
  onClose?: () => void;
  extra?: React.ReactNode;
  children?: React.ReactNode;
};

type DatePickerMultiplosMockProps = {
  disabledDate?: (current: unknown) => boolean;
  onchange?: () => void;
};

type SelectTipoEncontroMockProps = {
  exibirTooltip?: boolean;
  selectProps?: {
    onChange?: () => void;
  };
};

type SelectTodasTurmasMockProps = {
  idProposta?: number;
  exibirTooltip?: boolean;
  onChange?: () => void;
};

const mockResetFields = jest.fn();
const mockValidateFields = jest.fn();
const mockGetFieldValue = jest.fn();

const mockFormInstance = {
  resetFields: mockResetFields,
  validateFields: mockValidateFields,
  getFieldValue: mockGetFieldValue,
};

let mockParams: { id?: string } = { id: '123' };
let capturedDrawerProps: DrawerMockProps | undefined;
let capturedDatePickerProps:
  | DatePickerMultiplosMockProps
  | undefined;
let capturedSelectTipoProps:
  | SelectTipoEncontroMockProps
  | undefined;
let capturedSelectTurmasProps:
  | SelectTodasTurmasMockProps
  | undefined;

jest.mock('react-router-dom', () => ({
  useParams: () => mockParams,
}));

jest.mock('antd/es/form/Form', () => ({
  useForm: () => [mockFormInstance],
}));

jest.mock('~/core/services/proposta-service', () => ({
  salvarPropostaEncontro: jest.fn(),
  removerPropostaEncontro: jest.fn(),
}));

jest.mock('~/components/lib/notification', () => ({
  notification: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('~/core/services/alerta-service', () => ({
  confirmacao: jest.fn(),
}));

jest.mock('~/core/date/dayjs', () => {
  const createDayjsValue = (
    value: unknown,
    format?: string,
  ) => ({
    value,
    inputFormat: format,
    format: jest.fn(() => String(value)),
    toISOString: jest.fn(() => `iso-${String(value)}`),
    startOf: jest.fn(() => `start-${String(value)}`),
    endOf: jest.fn(() => `end-${String(value)}`),
  });

  const dayjsMock = jest.fn(createDayjsValue) as jest.Mock & {
    tz: jest.Mock;
  };

  dayjsMock.tz = jest.fn((value: unknown) => ({
    value,
    toISOString: jest.fn(() => `iso-${String(value)}`),
  }));

  return {
    dayjs: dayjsMock,
  };
});

jest.mock('antd', () => {
  const ReactModule =
    jest.requireActual<typeof import('react')>('react');

  const Button = ({
    children,
    onClick,
    disabled,
    type,
  }: {
    children?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    type?: string;
  }) => (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      data-button-type={type}
    >
      {children}
    </button>
  );

  const Drawer = (props: DrawerMockProps) => {
    capturedDrawerProps = props;

    return (
      <section data-testid='drawer'>
        <h1>{props.title}</h1>

        <button
          type='button'
          onClick={props.onClose}
        >
          Fechar drawer
        </button>

        <div data-testid='drawer-extra'>
          {props.extra}
        </div>

        {props.children}
      </section>
    );
  };

  const Form = ({
    children,
    initialValues,
    validateMessages,
  }: {
    children?: React.ReactNode;
    initialValues?: unknown;
    validateMessages?: unknown;
  }) => (
    <form
      data-testid='form-encontro'
      data-initial-values={JSON.stringify(initialValues)}
      data-validate-messages={JSON.stringify(
        validateMessages,
      )}
    >
      {children}
    </form>
  );

  Form.Item = ({
    children,
    label,
    name,
    rules,
  }: {
    children?: React.ReactNode;
    label?: React.ReactNode;
    name?: string;
    rules?: unknown[];
  }) => (
    <div
      data-testid={`form-item-${name}`}
      data-rules={JSON.stringify(rules)}
    >
      <span>{label}</span>
      {children}
    </div>
  );

  const TextArea = ({
    placeholder,
    maxLength,
    onChange,
  }: {
    placeholder?: string;
    maxLength?: number;
    onChange?: () => void;
  }) => (
    <textarea
      placeholder={placeholder}
      maxLength={maxLength}
      onChange={onChange}
    />
  );

  const Col = ({
    children,
  }: {
    children?: React.ReactNode;
  }) => <div>{children}</div>;

  const Row = ({
    children,
  }: {
    children?: React.ReactNode;
  }) => <div>{children}</div>;

  const Space = ({
    children,
  }: {
    children?: React.ReactNode;
  }) => <div>{children}</div>;

  return {
    Button,
    Col,
    Drawer,
    Form,
    Input: {
      TextArea,
    },
    Row,
    Space,
  };
});

jest.mock('~/components/lib/excluir-button', () => ({
  __esModule: true,
  default: ({
    id,
    onClick,
  }: {
    id?: string;
    onClick?: () => void;
  }) => (
    <button
      type='button'
      id={id}
      onClick={onClick}
    >
      Excluir
    </button>
  ),
}));

jest.mock('~/components/main/input/data-lista', () => ({
  __esModule: true,
  default: (props: DatePickerMultiplosMockProps) => {
    capturedDatePickerProps = props;

    return (
      <button
        type='button'
        onClick={props.onchange}
      >
        Alterar datas
      </button>
    );
  },
}));

jest.mock(
  '~/components/main/input/selecionar-todas-turmas',
  () => ({
    __esModule: true,
    default: (props: SelectTodasTurmasMockProps) => {
      capturedSelectTurmasProps = props;

      return (
        <button
          type='button'
          onClick={props.onChange}
        >
          Alterar turmas
        </button>
      );
    },
  }),
);

jest.mock(
  '~/components/main/input/tipo-encontro',
  () => ({
    __esModule: true,
    default: (props: SelectTipoEncontroMockProps) => {
      capturedSelectTipoProps = props;

      return (
        <button
          type='button'
          onClick={props.selectProps?.onChange}
        >
          Alterar tipo de encontro
        </button>
      );
    },
  }),
);

const mockSalvarPropostaEncontro =
  salvarPropostaEncontro as jest.MockedFunction<
    typeof salvarPropostaEncontro
  >;

const mockRemoverPropostaEncontro =
  removerPropostaEncontro as jest.MockedFunction<
    typeof removerPropostaEncontro
  >;

const mockNotificationSuccess =
  notification.success as jest.MockedFunction<
    typeof notification.success
  >;

const mockNotificationError =
  notification.error as jest.MockedFunction<
    typeof notification.error
  >;

const mockConfirmacao =
  confirmacao as jest.MockedFunction<
    typeof confirmacao
  >;

describe('DrawerFormularioEncontroTurmas', () => {
  const periodoRealizacao = {
    dataInicio: {
      startOf: jest.fn(() => 10),
    },
    dataFim: {
      endOf: jest.fn(() => 20),
    },
  } as never;

  const dadosEncontro = {
    id: 50,
    local: 'Sala 10',
    turmasId: [1, 2],
    tipoEncontro: TipoEncontro.Presencial,
    horaInicio: '08:00',
    horaFim: '10:00',
    datasPeriodos: [
      {
        data: '2026-07-10',
        horaInicio: '09:00',
        horaFim: '11:00',
      },
    ],
  } as never;

  const onCloseModal = jest.fn();

  const criarProps = (
    overrides: Partial<
      React.ComponentProps<
        typeof DrawerFormularioEncontroTurmas
      >
    > = {},
  ): React.ComponentProps<
    typeof DrawerFormularioEncontroTurmas
  > => ({
    openModal: true,
    periodoRealizacao,
    onCloseModal,
    dadosEncontro: undefined,
    ...overrides,
  });

  const configurarCamposVazios = () => {
    mockGetFieldValue.mockImplementation(
      (field: string | unknown[]) => {
        if (field === 'local') return '';
        if (field === 'turmas') return [];
        if (field === 'tipoEncontro') return undefined;

        if (
          Array.isArray(field) &&
          field.join('.') === 'datas.0.horarios'
        ) {
          return undefined;
        }

        if (field === 'datas') {
          return [{ dataInicio: undefined }];
        }

        return undefined;
      },
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();

    capturedDrawerProps = undefined;
    capturedDatePickerProps = undefined;
    capturedSelectTipoProps = undefined;
    capturedSelectTurmasProps = undefined;

    mockParams = {
      id: '123',
    };

    configurarCamposVazios();

    mockValidateFields.mockResolvedValue({
      local: 'Auditório',
      turmas: [10, 20],
      tipoEncontro: TipoEncontro.Presencial,
      datas: [
        {
          dataInicio: {
            toISOString: () => '2026-07-15T00:00:00.000Z',
          },
          horarios: [
            {
              format: () => '08:30',
            },
            {
              format: () => '10:45',
            },
          ],
        },
      ],
    });

    mockSalvarPropostaEncontro.mockResolvedValue({
      sucesso: true,
    } as never);

    mockRemoverPropostaEncontro.mockResolvedValue({
      sucesso: true,
    } as never);
  });

  it('não renderiza o drawer quando openModal é false', () => {
    render(
      <DrawerFormularioEncontroTurmas
        {...criarProps({
          openModal: false,
        })}
      />,
    );

    expect(
      screen.queryByTestId('drawer'),
    ).not.toBeInTheDocument();
  });

  it('renderiza o drawer quando openModal é true', () => {
    render(
      <DrawerFormularioEncontroTurmas
        {...criarProps()}
      />,
    );

    expect(
      screen.getByTestId('drawer'),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: 'Encontro de turmas',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: 'Salvar',
      }),
    ).toBeInTheDocument();
  });

  it('converte o id da rota para número', () => {
    mockParams = {
      id: '456',
    };

    render(
      <DrawerFormularioEncontroTurmas
        {...criarProps()}
      />,
    );

    expect(capturedSelectTurmasProps).toEqual(
      expect.objectContaining({
        idProposta: 456,
        exibirTooltip: false,
      }),
    );
  });

  it('usa propostaId zero quando a rota não possui id', () => {
    mockParams = {};

    render(
      <DrawerFormularioEncontroTurmas
        {...criarProps()}
      />,
    );

    expect(
      capturedSelectTurmasProps?.idProposta,
    ).toBe(0);
  });

  it('não exibe o botão excluir em um novo encontro', () => {
    render(
      <DrawerFormularioEncontroTurmas
        {...criarProps({
          dadosEncontro: undefined,
        })}
      />,
    );

    expect(
      screen.queryByRole('button', {
        name: 'Excluir',
      }),
    ).not.toBeInTheDocument();
  });

  it('exibe o botão excluir em um encontro existente', async () => {
    render(
      <DrawerFormularioEncontroTurmas
        {...criarProps({
          dadosEncontro,
        })}
      />,
    );

    expect(
      await screen.findByRole('button', {
        name: 'Excluir',
      }),
    ).toHaveAttribute('id', CF_BUTTON_EXCLUIR);
  });

  it('carrega os valores iniciais de um encontro existente', async () => {
    render(
      <DrawerFormularioEncontroTurmas
        {...criarProps({
          dadosEncontro,
        })}
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('form-encontro'),
      ).toHaveAttribute(
        'data-initial-values',
        expect.stringContaining('"local":"Sala 10"'),
      );
    });

    const initialValues = JSON.parse(
      screen
        .getByTestId('form-encontro')
        .getAttribute('data-initial-values') ?? '{}',
    );

    expect(initialValues).toEqual(
      expect.objectContaining({
        local: 'Sala 10',
        turmas: [1, 2],
        tipoEncontro: TipoEncontro.Presencial,
      }),
    );
  });

  it('usa horários específicos de cada data quando ambos existem', async () => {
    const { dayjs } = jest.requireMock(
      '~/core/date/dayjs',
    ) as {
      dayjs: jest.Mock & { tz: jest.Mock };
    };

    render(
      <DrawerFormularioEncontroTurmas
        {...criarProps({
          dadosEncontro,
        })}
      />,
    );

    await waitFor(() => {
      expect(dayjs).toHaveBeenCalledWith(
        '09:00',
        'HH:mm',
      );

      expect(dayjs).toHaveBeenCalledWith(
        '11:00',
        'HH:mm',
      );
    });
  });

  it('usa horários padrão quando a data não possui horários completos', async () => {
    const { dayjs } = jest.requireMock(
      '~/core/date/dayjs',
    ) as {
      dayjs: jest.Mock & { tz: jest.Mock };
    };

    const dadosSemHorarios = {
      ...(dadosEncontro as Record<string, unknown>),
      datasPeriodos: [
        {
          data: '2026-07-10',
          horaInicio: undefined,
          horaFim: undefined,
        },
      ],
    } as never;

    render(
      <DrawerFormularioEncontroTurmas
        {...criarProps({
          dadosEncontro: dadosSemHorarios,
        })}
      />,
    );

    await waitFor(() => {
      expect(dayjs).toHaveBeenCalledWith(
        '08:00',
        'HH:mm',
      );

      expect(dayjs).toHaveBeenCalledWith(
        '10:00',
        'HH:mm',
      );
    });
  });

  it('reinicia o formulário quando os valores iniciais mudam', async () => {
    render(
      <DrawerFormularioEncontroTurmas
        {...criarProps({
          dadosEncontro,
        })}
      />,
    );

    await waitFor(() => {
      expect(mockResetFields).toHaveBeenCalled();
    });
  });

  it('desabilita data anterior ao início do período', () => {
    render(
      <DrawerFormularioEncontroTurmas
        {...criarProps()}
      />,
    );

    expect(
      capturedDatePickerProps?.disabledDate?.(5),
    ).toBe(true);
  });

  it('desabilita data posterior ao final do período', () => {
    render(
      <DrawerFormularioEncontroTurmas
        {...criarProps()}
      />,
    );

    expect(
      capturedDatePickerProps?.disabledDate?.(25),
    ).toBe(true);
  });

  it('permite data dentro do período', () => {
    render(
      <DrawerFormularioEncontroTurmas
        {...criarProps()}
      />,
    );

    expect(
      capturedDatePickerProps?.disabledDate?.(15),
    ).toBe(false);
  });

  it('permite data quando current é vazio', () => {
    render(
      <DrawerFormularioEncontroTurmas
        {...criarProps()}
      />,
    );

    expect(
      capturedDatePickerProps?.disabledDate?.(null),
    ).toBe(false);
  });

  it('permite datas posteriores quando não existe data final', () => {
    render(
      <DrawerFormularioEncontroTurmas
        {...criarProps({
          periodoRealizacao: {
            dataInicio: {
              startOf: jest.fn(() => 10),
            },
            dataFim: undefined,
          } as never,
        })}
      />,
    );

    expect(
      capturedDatePickerProps?.disabledDate?.(100),
    ).toBe(false);
  });

  it('mantém o botão cancelar desabilitado inicialmente', () => {
    render(
      <DrawerFormularioEncontroTurmas
        {...criarProps()}
      />,
    );

    expect(
      screen.getByRole('button', {
        name: 'Cancelar',
      }),
    ).toBeDisabled();
  });

  it.each([
    ['local', 'Sala 10'],
    ['turmas', [1]],
    ['horarios', [{ format: jest.fn() }]],
    ['datas', [{ dataInicio: '2026-07-10' }]],
    ['tipoEncontro', 0],
  ])(
    'habilita cancelar quando o campo %s possui valor',
    async (campo, valor) => {
      mockGetFieldValue.mockImplementation(
        (field: string | unknown[]) => {
          if (campo === 'local' && field === 'local') {
            return valor;
          }

          if (campo === 'turmas' && field === 'turmas') {
            return valor;
          }

          if (
            campo === 'horarios' &&
            Array.isArray(field)
          ) {
            return valor;
          }

          if (campo === 'datas' && field === 'datas') {
            return valor;
          }

          if (
            campo === 'tipoEncontro' &&
            field === 'tipoEncontro'
          ) {
            return valor;
          }

          if (field === 'local') return '';
          if (field === 'turmas') return [];
          if (field === 'tipoEncontro') {
            return undefined;
          }

          if (field === 'datas') {
            return [{ dataInicio: undefined }];
          }

          return undefined;
        },
      );

      render(
        <DrawerFormularioEncontroTurmas
          {...criarProps()}
        />,
      );

      fireEvent.click(
        screen.getByRole('button', {
          name: 'Alterar turmas',
        }),
      );

      await waitFor(() => {
        expect(
          screen.getByRole('button', {
            name: 'Cancelar',
          }),
        ).toBeEnabled();
      });
    },
  );

  it('mantém cancelar desabilitado quando não há alterações', () => {
    configurarCamposVazios();

    render(
      <DrawerFormularioEncontroTurmas
        {...criarProps()}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Alterar datas',
      }),
    );

    expect(
      screen.getByRole('button', {
        name: 'Cancelar',
      }),
    ).toBeDisabled();
  });

  it('atualiza o tipo selecionado ao alterar tipo de encontro', async () => {
    mockGetFieldValue.mockImplementation(
      (field: string | unknown[]) => {
        if (field === 'tipoEncontro') {
          return TipoEncontro.Presencial;
        }

        if (field === 'local') return '';
        if (field === 'turmas') return [];
        if (field === 'datas') {
          return [{ dataInicio: undefined }];
        }

        return undefined;
      },
    );

    render(
      <DrawerFormularioEncontroTurmas
        {...criarProps()}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Alterar tipo de encontro',
      }),
    );

    await waitFor(() => {
      const formItem = screen.getByTestId(
        'form-item-local',
      );

      expect(formItem).toHaveAttribute(
        'data-rules',
        JSON.stringify([{ required: true }]),
      );
    });
  });

  it('não exige local para encontro não presencial', async () => {
    mockGetFieldValue.mockImplementation(
      (field: string | unknown[]) => {
        if (field === 'tipoEncontro') {
          return -1;
        }

        if (field === 'local') return '';
        if (field === 'turmas') return [];
        if (field === 'datas') {
          return [{ dataInicio: undefined }];
        }

        return undefined;
      },
    );

    render(
      <DrawerFormularioEncontroTurmas
        {...criarProps()}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Alterar tipo de encontro',
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('form-item-local'),
      ).toHaveAttribute(
        'data-rules',
        JSON.stringify([{ required: false }]),
      );
    });
  });

  it('fecha diretamente quando não há alterações', () => {
    render(
      <DrawerFormularioEncontroTurmas
        {...criarProps()}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Fechar drawer',
      }),
    );

    expect(onCloseModal).toHaveBeenCalledWith(false);
    expect(mockResetFields).toHaveBeenCalled();
    expect(mockConfirmacao).not.toHaveBeenCalled();
  });

  it('solicita confirmação ao cancelar com alterações', async () => {
    mockGetFieldValue.mockImplementation(
      (field: string | unknown[]) => {
        if (field === 'local') return 'Sala alterada';
        if (field === 'turmas') return [];
        if (field === 'datas') {
          return [{ dataInicio: undefined }];
        }
        if (field === 'tipoEncontro') {
          return undefined;
        }

        return undefined;
      },
    );

    render(
      <DrawerFormularioEncontroTurmas
        {...criarProps()}
      />,
    );

    fireEvent.change(
      screen.getByPlaceholderText('Informe o Local'),
      {
        target: {
          value: 'Sala alterada',
        },
      },
    );

    await waitFor(() => {
      expect(
        screen.getByRole('button', {
          name: 'Cancelar',
        }),
      ).toBeEnabled();
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Cancelar',
      }),
    );

    expect(mockConfirmacao).toHaveBeenCalledWith(
      expect.objectContaining({
        content: DESEJA_CANCELAR_ALTERACOES,
        onOk: expect.any(Function),
      }),
    );
  });

  it('fecha e reinicia após confirmar o cancelamento', async () => {
    mockGetFieldValue.mockImplementation(
      (field: string | unknown[]) => {
        if (field === 'local') return 'Sala';
        if (field === 'turmas') return [];
        if (field === 'datas') {
          return [{ dataInicio: undefined }];
        }

        return undefined;
      },
    );

    render(
      <DrawerFormularioEncontroTurmas
        {...criarProps()}
      />,
    );

    fireEvent.change(
      screen.getByPlaceholderText('Informe o Local'),
      {
        target: {
          value: 'Sala',
        },
      },
    );

    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Cancelar',
      }),
    );

    const config =
      mockConfirmacao.mock.calls[0][0] as {
        onOk: () => void;
      };

    config.onOk();

    expect(onCloseModal).toHaveBeenCalledWith(false);
    expect(mockResetFields).toHaveBeenCalled();
  });

  it('valida o formulário ao clicar em salvar', () => {
    render(
      <DrawerFormularioEncontroTurmas
        {...criarProps()}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Salvar',
      }),
    );

    expect(mockValidateFields).toHaveBeenCalledTimes(1);
  });

  it('salva um novo encontro com payload formatado', async () => {
    render(
      <DrawerFormularioEncontroTurmas
        {...criarProps()}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Salvar',
      }),
    );

    await waitFor(() => {
      expect(
        mockSalvarPropostaEncontro,
      ).toHaveBeenCalledWith(123, {
        id: 0,
        propostaId: 123,
        horaFim: '10:45',
        horaInicio: '08:30',
        tipo: TipoEncontro.Presencial,
        local: 'Auditório',
        turmas: [
          { turmaId: 10 },
          { turmaId: 20 },
        ],
        datas: [
          {
            dataInicio:
              '2026-07-15T00:00:00.000Z',
            horaInicio: '08:30',
            horaFim: '10:45',
          },
        ],
      });
    });
  });

  it('salva uma edição mantendo o id existente', async () => {
    render(
      <DrawerFormularioEncontroTurmas
        {...criarProps({
          dadosEncontro,
        })}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Salvar',
      }),
    );

    await waitFor(() => {
      expect(
        mockSalvarPropostaEncontro,
      ).toHaveBeenCalledWith(
        123,
        expect.objectContaining({
          id: 50,
          propostaId: 123,
        }),
      );
    });
  });

  it('usa strings vazias quando horários não são informados', async () => {
    mockValidateFields.mockResolvedValue({
      local: 'Online',
      turmas: [],
      tipoEncontro: 1,
      datas: [
        {
          dataInicio: {
            toISOString: () => '2026-07-20T00:00:00.000Z',
          },
          horarios: undefined,
        },
      ],
    });

    render(
      <DrawerFormularioEncontroTurmas
        {...criarProps()}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Salvar',
      }),
    );

    await waitFor(() => {
      expect(
        mockSalvarPropostaEncontro,
      ).toHaveBeenCalledWith(
        123,
        expect.objectContaining({
          horaInicio: '',
          horaFim: '',
          datas: [
            {
              dataInicio:
                '2026-07-20T00:00:00.000Z',
              horaInicio: '',
              horaFim: '',
            },
          ],
        }),
      );
    });
  });

  it('usa dataInicio undefined quando a data não foi informada', async () => {
    mockValidateFields.mockResolvedValue({
      local: '',
      turmas: [],
      tipoEncontro: 1,
      datas: [
        {
          dataInicio: undefined,
          horarios: undefined,
        },
      ],
    });

    render(
      <DrawerFormularioEncontroTurmas
        {...criarProps()}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Salvar',
      }),
    );

    await waitFor(() => {
      expect(
        mockSalvarPropostaEncontro,
      ).toHaveBeenCalledWith(
        123,
        expect.objectContaining({
          datas: [
            {
              dataInicio: undefined,
              horaInicio: '',
              horaFim: '',
            },
          ],
        }),
      );
    });
  });

  it('notifica sucesso e fecha após salvar', async () => {
    render(
      <DrawerFormularioEncontroTurmas
        {...criarProps()}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Salvar',
      }),
    );

    await waitFor(() => {
      expect(mockNotificationSuccess).toHaveBeenCalledWith({
        message: 'Sucesso',
        description: 'Registro salvo com Sucesso!',
      });

      expect(onCloseModal).toHaveBeenCalledWith(true);
    });
  });

  it('notifica erro quando o salvamento falha', async () => {
    mockSalvarPropostaEncontro.mockResolvedValue({
      sucesso: false,
    } as never);

    render(
      <DrawerFormularioEncontroTurmas
        {...criarProps()}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Salvar',
      }),
    );

    await waitFor(() => {
      expect(mockNotificationError).toHaveBeenCalledWith({
        message: 'Erro',
        description: 'Falha ao salvar encontro!',
      });
    });

    expect(onCloseModal).not.toHaveBeenCalled();
  });

  it('exclui um encontro existente', async () => {
    render(
      <DrawerFormularioEncontroTurmas
        {...criarProps({
          dadosEncontro,
        })}
      />,
    );

    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Excluir',
      }),
    );

    await waitFor(() => {
      expect(
        mockRemoverPropostaEncontro,
      ).toHaveBeenCalledWith(50);
    });
  });

  it('notifica sucesso e fecha após excluir', async () => {
    render(
      <DrawerFormularioEncontroTurmas
        {...criarProps({
          dadosEncontro,
        })}
      />,
    );

    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Excluir',
      }),
    );

    await waitFor(() => {
      expect(mockNotificationSuccess).toHaveBeenCalledWith({
        message: 'Sucesso',
        description:
          'Registro excluído com Sucesso!',
      });

      expect(onCloseModal).toHaveBeenCalledWith(true);
    });
  });

  it('notifica erro quando a exclusão falha', async () => {
    mockRemoverPropostaEncontro.mockResolvedValue({
      sucesso: false,
    } as never);

    render(
      <DrawerFormularioEncontroTurmas
        {...criarProps({
          dadosEncontro,
        })}
      />,
    );

    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Excluir',
      }),
    );

    await waitFor(() => {
      expect(mockNotificationError).toHaveBeenCalledWith({
        message: 'Erro',
        description: 'Falha ao excluir encontro!',
      });
    });

    expect(onCloseModal).not.toHaveBeenCalled();
  });
});
