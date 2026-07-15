/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import React from 'react';

import DrawerTutor from './index';
import { PermissaoContext } from '../../../../../../../../../routes/config/guard/permissao/provider';
import {
  excluirTutor,
  obterPropostaTutorPorId,
  salvarPropostaProfissionalTutor,
} from '../../../../../../../../../core/services/proposta-service';
import { notification } from '../../../../../../../../../components/lib/notification';
import { confirmacao } from '../../../../../../../../../core/services/alerta-service';
import { onClickCancelar } from '../../../../../../../../../core/utils/form';
import { formatterCPFMask } from '../../../../../../../../../core/utils/functions';
import { DESEJA_CANCELAR_ALTERACOES } from '../../../../../../../../../core/constants/mensagens';
import {
  CF_BUTTON_EXCLUIR,
  CF_BUTTON_MODAL_CANCELAR,
} from '../../../../../../../../../core/constants/ids/button/intex';

type FormValues = {
  profissionalRedeMunicipal?: boolean;
  registroFuncional?: string;
  nomeTutor?: string;
  cpf?: string;
  turmas?: number[];
};

type InputRegistroFuncionalNomeMockProps = {
  exibirCpf?: boolean;
  formItemPropsRF?: {
    rules?: Array<{ required?: boolean }>;
  };
  formItemPropsNome?: {
    rules?: Array<{ required?: boolean }>;
    name?: string;
  };
  inputPropsRF?: {
    disabled?: boolean;
    onChange?: (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => void;
  };
  inputPropsNome?: {
    disabled?: boolean;
  };
};

type RadioSimNaoMockProps = {
  formItemProps?: {
    name?: string;
    label?: React.ReactNode;
  };
  radioGroupProps?: {
    onChange?: () => void;
  };
};

type SelectTodasTurmasMockProps = {
  idProposta?: number;
  exibirTooltip?: boolean;
  onChange?: () => void;
};

type FormMockProps = {
  form?: unknown;
  layout?: string;
  autoComplete?: string;
  initialValues?: unknown;
  validateMessages?: unknown;
  disabled?: boolean;
  children?: React.ReactNode;
};

const mockResetFields = jest.fn();
const mockSetFieldValue = jest.fn();
const mockGetFieldValue = jest.fn();
const mockIsFieldsTouched = jest.fn();
const mockValidateFields = jest.fn();

const mockFormInstance = {
  resetFields: mockResetFields,
  setFieldValue: mockSetFieldValue,
  getFieldValue: mockGetFieldValue,
  isFieldsTouched: mockIsFieldsTouched,
  validateFields: mockValidateFields,
};

let mockRouteParams: { id?: string } = {
  id: '100',
};

let capturedFormProps: FormMockProps | undefined;
let capturedInputRFNomeProps:
  | InputRegistroFuncionalNomeMockProps
  | undefined;
let capturedRadioProps: RadioSimNaoMockProps | undefined;
let capturedTurmasProps:
  | SelectTodasTurmasMockProps
  | undefined;

jest.mock('react-router-dom', () => ({
  useParams: () => mockRouteParams,
}));

jest.mock('antd/es/form/Form', () => ({
  useForm: () => [mockFormInstance],
}));

jest.mock(
  '~/routes/config/guard/permissao/provider',
  () => {
    const ReactModule =
      jest.requireActual<typeof import('react')>('react');

    return {
      PermissaoContext: ReactModule.createContext({
        desabilitarCampos: false,
      }),
    };
  },
);

jest.mock('~/core/services/proposta-service', () => ({
  excluirTutor: jest.fn(),
  obterPropostaTutorPorId: jest.fn(),
  salvarPropostaProfissionalTutor: jest.fn(),
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

jest.mock('~/core/utils/form', () => ({
  onClickCancelar: jest.fn(),
}));

jest.mock('~/core/utils/functions', () => ({
  formatterCPFMask: jest.fn(
    (cpf: string) => `cpf-formatado-${cpf}`,
  ),
}));

jest.mock('antd', () => {
  const Button = ({
    children,
    onClick,
    disabled,
    id,
    type,
  }: {
    children?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    id?: string;
    type?: string;
  }) => (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      id={id}
      data-button-type={type}
    >
      {children}
    </button>
  );

  const Form = ({
    form,
    layout,
    autoComplete,
    initialValues,
    validateMessages,
    disabled,
    children,
  }: FormMockProps) => {
    capturedFormProps = {
      form,
      layout,
      autoComplete,
      initialValues,
      validateMessages,
      disabled,
      children,
    };

    return (
      <form
        data-testid='form-tutor'
        data-layout={layout}
        data-auto-complete={autoComplete}
        data-disabled={String(Boolean(disabled))}
        data-initial-values={JSON.stringify(
          initialValues,
        )}
      >
        {children}
      </form>
    );
  };

  Form.Item = ({
    children,
    style,
  }: {
    children?:
      | React.ReactNode
      | ((form: typeof mockFormInstance) => React.ReactNode);
    style?: React.CSSProperties;
  }) => (
    <div
      data-testid='form-item'
      data-style={JSON.stringify(style)}
    >
      {typeof children === 'function'
        ? children(mockFormInstance)
        : children}
    </div>
  );

  const Drawer = ({
    title,
    onClose,
    extra,
    children,
  }: {
    title?: React.ReactNode;
    onClose?: () => void;
    extra?: React.ReactNode;
    children?: React.ReactNode;
  }) => (
    <section data-testid='drawer-tutor'>
      <h1>{title}</h1>

      <button
        type='button'
        onClick={onClose}
      >
        Fechar drawer
      </button>

      <div data-testid='drawer-extra'>{extra}</div>

      {children}
    </section>
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

jest.mock(
  '~/components/main/input/profissional-rede-municipal',
  () => ({
    __esModule: true,
    default: (props: RadioSimNaoMockProps) => {
      capturedRadioProps = props;

      return (
        <button
          type='button'
          onClick={props.radioGroupProps?.onChange}
        >
          Alterar profissional da rede
        </button>
      );
    },
  }),
);

jest.mock(
  '~/components/main/input/input-registro-funcional-nome',
  () => ({
    __esModule: true,
    default: (
      props: InputRegistroFuncionalNomeMockProps,
    ) => {
      capturedInputRFNomeProps = props;

      return (
        <div data-testid='input-rf-nome'>
          <input
            aria-label='registro-funcional'
            disabled={props.inputPropsRF?.disabled}
            onChange={props.inputPropsRF?.onChange}
          />

          <input
            aria-label='nome-tutor'
            disabled={props.inputPropsNome?.disabled}
          />

          {props.exibirCpf && (
            <input aria-label='cpf-tutor' />
          )}
        </div>
      );
    },
  }),
);

jest.mock(
  '~/components/main/input/selecionar-todas-turmas',
  () => ({
    __esModule: true,
    default: (props: SelectTodasTurmasMockProps) => {
      capturedTurmasProps = props;

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

const mockSalvarTutor =
  salvarPropostaProfissionalTutor as jest.MockedFunction<
    typeof salvarPropostaProfissionalTutor
  >;

const mockExcluirTutor =
  excluirTutor as jest.MockedFunction<
    typeof excluirTutor
  >;

const mockObterTutor =
  obterPropostaTutorPorId as jest.MockedFunction<
    typeof obterPropostaTutorPorId
  >;

const mockNotificationSuccess =
  notification.success as jest.MockedFunction<
    typeof notification.success
  >;

const mockConfirmacao =
  confirmacao as jest.MockedFunction<
    typeof confirmacao
  >;

const mockOnClickCancelar =
  onClickCancelar as jest.MockedFunction<
    typeof onClickCancelar
  >;

const mockFormatterCPF =
  formatterCPFMask as jest.MockedFunction<
    typeof formatterCPFMask
  >;

describe('DrawerTutor', () => {
  const onCloseModal = jest.fn();

  const valoresFormulario: FormValues = {
    profissionalRedeMunicipal: true,
    registroFuncional: '1234567',
    nomeTutor: 'Tutor Teste',
    cpf: '12345678900',
    turmas: [10, 20],
  };

  const criarProps = (
    overrides: Partial<
      React.ComponentProps<typeof DrawerTutor>
    > = {},
  ): React.ComponentProps<typeof DrawerTutor> => ({
    openModal: true,
    onCloseModal,
    id: 0,
    ...overrides,
  });

  const renderizar = (
    props: Partial<
      React.ComponentProps<typeof DrawerTutor>
    > = {},
    desabilitarCampos = false,
  ) =>
    render(
      <PermissaoContext.Provider
        value={{ desabilitarCampos } as never}
      >
        <DrawerTutor {...criarProps(props)} />
      </PermissaoContext.Provider>,
    );

  beforeEach(() => {
    jest.clearAllMocks();

    capturedFormProps = undefined;
    capturedInputRFNomeProps = undefined;
    capturedRadioProps = undefined;
    capturedTurmasProps = undefined;

    mockRouteParams = {
      id: '100',
    };

    mockIsFieldsTouched.mockReturnValue(false);
    mockGetFieldValue.mockReturnValue(true);
    mockValidateFields.mockResolvedValue(
      valoresFormulario,
    );

    mockSalvarTutor.mockResolvedValue({
      sucesso: true,
    } as never);

    mockExcluirTutor.mockResolvedValue({
      sucesso: true,
    } as never);

    mockObterTutor.mockResolvedValue({
      sucesso: true,
      dados: {
        id: 50,
        profissionalRedeMunicipal: true,
        registroFuncional: '1234567',
        nomeTutor: 'Tutor Teste',
        cpf: '12345678900',
        turmas: [
          { turmaId: 10 },
          { turmaId: 20 },
        ],
      },
    } as never);
  });

  it('não renderiza o formulário quando o modal está fechado', () => {
    renderizar({
      openModal: false,
    });

    expect(
      screen.queryByTestId('drawer-tutor'),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByTestId('form-tutor'),
    ).not.toBeInTheDocument();
  });

  it('renderiza o drawer quando o modal está aberto', () => {
    renderizar();

    expect(
      screen.getByTestId('drawer-tutor'),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: 'Mediador',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: 'Salvar',
      }),
    ).toBeInTheDocument();
  });

  it('configura o formulário para um novo tutor', () => {
    renderizar();

    expect(capturedFormProps).toEqual(
      expect.objectContaining({
        form: mockFormInstance,
        layout: 'vertical',
        autoComplete: 'off',
        disabled: false,
        initialValues: {
          profissionalRedeMunicipal: true,
        },
      }),
    );
  });

  it('desabilita o formulário conforme a permissão', () => {
    renderizar({}, true);

    expect(capturedFormProps?.disabled).toBe(true);

    expect(
      screen.getByTestId('form-tutor'),
    ).toHaveAttribute('data-disabled', 'true');
  });

  it('usa o id da proposta obtido pela rota', () => {
    mockRouteParams = {
      id: '321',
    };

    renderizar();

    expect(capturedTurmasProps).toEqual(
      expect.objectContaining({
        idProposta: 321,
        exibirTooltip: false,
      }),
    );
  });

  it('usa propostaId zero quando a rota não possui id', () => {
    mockRouteParams = {};

    renderizar();

    expect(capturedTurmasProps?.idProposta).toBe(0);
  });

  it('não exibe o botão excluir para um novo tutor', () => {
    renderizar({
      id: 0,
    });

    expect(
      screen.queryByRole('button', {
        name: 'Excluir',
      }),
    ).not.toBeInTheDocument();
  });

  it('exibe o botão excluir para um tutor existente', async () => {
    renderizar({
      id: 50,
    });

    expect(
      await screen.findByRole('button', {
        name: 'Excluir',
      }),
    ).toHaveAttribute('id', CF_BUTTON_EXCLUIR);
  });

  it('não consulta dados quando id é zero', () => {
    renderizar({
      id: 0,
    });

    expect(mockObterTutor).not.toHaveBeenCalled();
  });

  it('consulta os dados quando existe id', async () => {
    renderizar({
      id: 50,
    });

    await waitFor(() => {
      expect(mockObterTutor).toHaveBeenCalledWith(50);
    });
  });

  it('transforma as turmas e formata o CPF ao carregar dados', async () => {
    renderizar({
      id: 50,
    });

    await waitFor(() => {
      expect(mockFormatterCPF).toHaveBeenCalledWith(
        '12345678900',
      );
    });

    await waitFor(() => {
      expect(capturedFormProps?.initialValues).toEqual(
        expect.objectContaining({
          id: 50,
          cpf: 'cpf-formatado-12345678900',
          turmas: [10, 20],
        }),
      );
    });
  });

  it('não transforma turmas quando a lista está vazia', async () => {
    mockObterTutor.mockResolvedValue({
      sucesso: true,
      dados: {
        id: 50,
        cpf: '12345678900',
        turmas: [],
      },
    } as never);

    renderizar({
      id: 50,
    });

    await waitFor(() => {
      expect(capturedFormProps?.initialValues).toEqual(
        expect.objectContaining({
          turmas: [],
        }),
      );
    });
  });

  it('não formata o CPF quando ele não está preenchido', async () => {
    mockObterTutor.mockResolvedValue({
      sucesso: true,
      dados: {
        id: 50,
        cpf: '',
        turmas: [],
      },
    } as never);

    renderizar({
      id: 50,
    });

    await waitFor(() => {
      expect(mockObterTutor).toHaveBeenCalled();
    });

    expect(mockFormatterCPF).not.toHaveBeenCalled();
  });

  it('mantém os valores padrão quando a consulta falha', async () => {
    mockObterTutor.mockResolvedValue({
      sucesso: false,
    } as never);

    renderizar({
      id: 50,
    });

    await waitFor(() => {
      expect(mockObterTutor).toHaveBeenCalledWith(50);
    });

    expect(capturedFormProps?.initialValues).toEqual({
      profissionalRedeMunicipal: true,
    });
  });

  it('reinicia os campos ao montar e ao carregar dados', async () => {
    renderizar({
      id: 50,
    });

    await waitFor(() => {
      expect(mockResetFields).toHaveBeenCalled();
    });
  });

  it('fecha diretamente quando não existem campos alterados', () => {
    mockIsFieldsTouched.mockReturnValue(false);

    renderizar();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Fechar drawer',
      }),
    );

    expect(onCloseModal).toHaveBeenCalledWith(false);
    expect(mockResetFields).toHaveBeenCalled();
    expect(mockConfirmacao).not.toHaveBeenCalled();
  });

  it('solicita confirmação ao fechar com campos alterados', () => {
    mockIsFieldsTouched.mockReturnValue(true);

    renderizar();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Fechar drawer',
      }),
    );

    expect(mockConfirmacao).toHaveBeenCalledWith(
      expect.objectContaining({
        content: DESEJA_CANCELAR_ALTERACOES,
        onOk: expect.any(Function),
      }),
    );

    expect(onCloseModal).not.toHaveBeenCalled();
  });

  it('fecha e reinicia o formulário após confirmar o cancelamento', () => {
    mockIsFieldsTouched.mockReturnValue(true);

    renderizar();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Fechar drawer',
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

  it('habilita o botão cancelar quando há campos alterados', () => {
    mockIsFieldsTouched.mockReturnValue(true);

    renderizar();

    expect(
      screen.getByRole('button', {
        name: 'Cancelar',
      }),
    ).toBeEnabled();
  });

  it('desabilita o botão cancelar quando não há alterações', () => {
    mockIsFieldsTouched.mockReturnValue(false);

    renderizar();

    expect(
      screen.getByRole('button', {
        name: 'Cancelar',
      }),
    ).toBeDisabled();
  });

  it('executa onClickCancelar ao clicar no botão cancelar', () => {
    mockIsFieldsTouched.mockReturnValue(true);

    renderizar();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Cancelar',
      }),
    );

    expect(mockOnClickCancelar).toHaveBeenCalledWith({
      form: mockFormInstance,
    });

    expect(
      screen.getByRole('button', {
        name: 'Cancelar',
      }),
    ).toHaveAttribute(
      'id',
      CF_BUTTON_MODAL_CANCELAR,
    );
  });

  it('valida o formulário ao clicar em salvar', () => {
    renderizar();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Salvar',
      }),
    );

    expect(mockValidateFields).toHaveBeenCalledTimes(1);
  });

  it('salva um novo tutor com as turmas transformadas', async () => {
    renderizar({
      id: 0,
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Salvar',
      }),
    );

    await waitFor(() => {
      expect(mockSalvarTutor).toHaveBeenCalledWith(
        {
          ...valoresFormulario,
          turmas: [
            { turmaId: 10 },
            { turmaId: 20 },
          ],
          id: 0,
        },
        100,
      );
    });
  });

  it('salva uma edição mantendo o id do tutor', async () => {
    renderizar({
      id: 50,
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Salvar',
      }),
    );

    await waitFor(() => {
      expect(mockSalvarTutor).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 50,
          turmas: [
            { turmaId: 10 },
            { turmaId: 20 },
          ],
        }),
        100,
      );
    });
  });

  it('notifica sucesso e fecha após salvar', async () => {
    renderizar();

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

    expect(mockConfirmacao).not.toHaveBeenCalled();
  });

  it('não fecha nem notifica quando o salvamento falha', async () => {
    mockSalvarTutor.mockResolvedValue({
      sucesso: false,
    } as never);

    renderizar();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Salvar',
      }),
    );

    await waitFor(() => {
      expect(mockSalvarTutor).toHaveBeenCalled();
    });

    expect(mockNotificationSuccess).not.toHaveBeenCalled();
    expect(onCloseModal).not.toHaveBeenCalled();
  });

  it('exclui o tutor pelo id', async () => {
    renderizar({
      id: 50,
    });

    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Excluir',
      }),
    );

    await waitFor(() => {
      expect(mockExcluirTutor).toHaveBeenCalledWith(50);
    });
  });

  it('notifica sucesso e fecha após excluir', async () => {
    mockIsFieldsTouched.mockReturnValue(false);

    renderizar({
      id: 50,
    });

    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Excluir',
      }),
    );

    await waitFor(() => {
      expect(mockNotificationSuccess).toHaveBeenCalledWith({
        message: 'Sucesso',
        description: 'Registro excluído com Sucesso!',
      });

      expect(onCloseModal).toHaveBeenCalledWith(true);
    });
  });

  it('solicita confirmação após excluir quando o formulário está alterado', async () => {
    mockIsFieldsTouched.mockReturnValue(true);

    renderizar({
      id: 50,
    });

    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Excluir',
      }),
    );

    await waitFor(() => {
      expect(mockExcluirTutor).toHaveBeenCalledWith(50);
    });

    expect(mockConfirmacao).toHaveBeenCalledWith(
      expect.objectContaining({
        content: DESEJA_CANCELAR_ALTERACOES,
      }),
    );
  });

  it('não fecha nem notifica quando a exclusão falha', async () => {
    mockExcluirTutor.mockResolvedValue({
      sucesso: false,
    } as never);

    renderizar({
      id: 50,
    });

    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Excluir',
      }),
    );

    await waitFor(() => {
      expect(mockExcluirTutor).toHaveBeenCalled();
    });

    expect(mockNotificationSuccess).not.toHaveBeenCalled();
    expect(onCloseModal).not.toHaveBeenCalled();
  });

  it('limpa os campos dependentes ao alterar o tipo de profissional', () => {
    renderizar();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Alterar profissional da rede',
      }),
    );

    expect(mockResetFields).toHaveBeenCalledWith([
      'registroFuncional',
      'nomeTutor',
    ]);

    expect(mockSetFieldValue).toHaveBeenCalledWith(
      'registroFuncional',
      '',
    );

    expect(mockSetFieldValue).toHaveBeenCalledWith(
      'nomeTutor',
      '',
    );

    expect(mockSetFieldValue).toHaveBeenCalledWith(
      'cpf',
      '',
    );
  });

  it('configura RF obrigatório para profissional da rede municipal', () => {
    mockGetFieldValue.mockReturnValue(true);

    renderizar();

    expect(capturedInputRFNomeProps).toEqual(
      expect.objectContaining({
        exibirCpf: false,
        formItemPropsRF: {
          rules: [{ required: true }],
        },
        formItemPropsNome: {
          rules: [{ required: false }],
          name: 'nomeTutor',
        },
        inputPropsRF: expect.objectContaining({
          disabled: false,
        }),
        inputPropsNome: {
          disabled: true,
        },
      }),
    );
  });

  it('exibe CPF e exige nome para profissional fora da rede', () => {
    mockGetFieldValue.mockReturnValue(false);

    renderizar();

    expect(capturedInputRFNomeProps).toEqual(
      expect.objectContaining({
        exibirCpf: true,
        formItemPropsRF: {
          rules: [{ required: false }],
        },
        formItemPropsNome: {
          rules: [{ required: true }],
          name: 'nomeTutor',
        },
        inputPropsRF: expect.objectContaining({
          disabled: true,
        }),
        inputPropsNome: {
          disabled: false,
        },
      }),
    );

    expect(
      screen.getByRole('textbox', {
        name: 'cpf-tutor',
      }),
    ).toBeInTheDocument();
  });

  it('mantém nome obrigatório e desabilitado quando não há permissão', () => {
    mockGetFieldValue.mockReturnValue(true);

    renderizar({}, true);

    expect(
      capturedInputRFNomeProps?.formItemPropsNome,
    ).toEqual({
      rules: [{ required: true }],
      name: 'nomeTutor',
    });

    expect(
      capturedInputRFNomeProps?.inputPropsNome,
    ).toEqual({
      disabled: true,
    });
  });

  it('limpa o nome quando o RF está vazio', () => {
    mockGetFieldValue.mockReturnValue(true);

    renderizar();

    mockResetFields.mockClear();

    capturedInputRFNomeProps?.inputPropsRF?.onChange?.({
      target: {
        value: '',
      },
    } as React.ChangeEvent<HTMLInputElement>);

    expect(mockResetFields).toHaveBeenCalledWith([
      'nomeTutor',
    ]);

    expect(mockSetFieldValue).toHaveBeenCalledWith(
      'nomeTutor',
      '',
    );
  });

  it('limpa o nome quando o RF possui menos de sete caracteres', () => {
    mockGetFieldValue.mockReturnValue(true);

    renderizar();

    capturedInputRFNomeProps?.inputPropsRF?.onChange?.({
      target: {
        value: '123456',
      },
    } as React.ChangeEvent<HTMLInputElement>);

    expect(mockResetFields).toHaveBeenCalledWith([
      'nomeTutor',
    ]);

    expect(mockSetFieldValue).toHaveBeenCalledWith(
      'nomeTutor',
      '',
    );
  });

  it('não limpa o nome quando o RF possui sete caracteres', () => {
    mockGetFieldValue.mockReturnValue(true);

    renderizar();

    jest.clearAllMocks();

    fireEvent.change(
      screen.getByRole('textbox', {
        name: 'registro-funcional',
      }),
      {
        target: {
          value: '1234567',
        },
      },
    );

    expect(mockResetFields).not.toHaveBeenCalledWith([
      'nomeTutor',
    ]);

    expect(mockSetFieldValue).not.toHaveBeenCalledWith(
      'nomeTutor',
      '',
    );
  });

  it('executa o onChange de turmas sem efeitos colaterais', () => {
    renderizar();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Alterar turmas',
      }),
    );

    expect(capturedTurmasProps?.onChange).toEqual(
      expect.any(Function),
    );

    expect(mockSetFieldValue).not.toHaveBeenCalled();
  });
});
