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

import MeusDados from './meus-dados';
import { MeusDadosContext } from '../../provider';
import usuarioService from '../../../../core/services/usuario-service';
import { notification } from '../../../../components/lib/notification';
import { TipoUsuario } from '../../../../core/enum/tipo-usuario';
import { ROUTES } from '../../../../core/enum/routes-enum';
import { onClickVoltar } from '../../../../core/utils/form';
import { maskTelefone } from '../../../../core/utils/functions';

const mockNavigate = jest.fn();
const mockSetFieldsValue = jest.fn();
const mockSetFieldValue = jest.fn();
const mockGetFieldsValue = jest.fn();

const mockForm = {
  setFieldsValue: mockSetFieldsValue,
  setFieldValue: mockSetFieldValue,
  getFieldsValue: mockGetFieldsValue,
};

let mockAuthState: {
  usuarioNome?: string;
  usuarioLogin?: string;
};

let mockPerfilState: {
  perfilSelecionado?: {
    perfilNome?: string;
  };
};

type SelectMockProps = {
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  options?: Array<{
    label: string;
    value: string;
  }>;
  onChange?: (value?: string) => void;
};

type InputMockProps = {
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
};

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('antd/es/form/Form', () => ({
  useForm: () => [mockForm],
}));

jest.mock('~/core/hooks/use-redux', () => ({
  useAppSelector: (
    selector: (store: {
      auth: typeof mockAuthState;
      perfil: typeof mockPerfilState;
    }) => unknown,
  ) =>
    selector({
      auth: mockAuthState,
      perfil: mockPerfilState,
    }),
}));

jest.mock('~/core/services/usuario-service', () => ({
  __esModule: true,
  default: {
    salvarAcessibilidade: jest.fn(),
  },
}));

jest.mock('~/components/lib/notification', () => ({
  notification: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('~/core/utils/form', () => ({
  onClickVoltar: jest.fn(),
}));

jest.mock('~/core/utils/functions', () => ({
  maskTelefone: jest.fn((value: string) => `mascarado-${value}`),
}));

jest.mock('styled-components', () => {
  const ReactModule =
    jest.requireActual<typeof import('react')>('react');

  return {
    __esModule: true,
    default: {
      div: () =>
        ({ children }: { children?: React.ReactNode }) =>
          ReactModule.createElement(
            'div',
            { 'data-testid': 'dados-perfil' },
            children,
          ),
    },
  };
});

jest.mock('react-icons/fa', () => ({
  FaUserCircle: () => <span data-testid='user-icon' />,
}));

jest.mock('@ant-design/icons', () => ({}));

jest.mock('antd', () => {
  const ReactModule =
    jest.requireActual<typeof import('react')>('react');

  const Button = ({
    children,
    onClick,
    disabled,
    loading,
    id,
  }: {
    children?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
    id?: string;
  }) => (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      id={id}
      data-loading={String(Boolean(loading))}
    >
      {children}
    </button>
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

  const Typography = ({
    children,
  }: {
    children?: React.ReactNode;
  }) => <span>{children}</span>;

  Typography.Text = ({
    children,
  }: {
    children?: React.ReactNode;
  }) => <span>{children}</span>;

  const Form = ({
    children,
  }: {
    children?: React.ReactNode;
  }) => <form>{children}</form>;

  Form.Item = ({
    children,
    name,
    label,
  }: {
    children?: React.ReactNode;
    name?: string;
    label?: React.ReactNode;
  }) => (
    <div data-testid={`form-item-${name ?? 'sem-nome'}`}>
      {label}
      {children}
    </div>
  );

  const Select = ({
    placeholder,
    disabled,
    options,
    onChange,
  }: SelectMockProps) => (
    <select
      aria-label={
        placeholder === 'Selecione'
          ? 'select-acessibilidade'
          : placeholder
      }
      disabled={disabled}
      onChange={(event) =>
        onChange?.(event.target.value || undefined)
      }
    >
      <option value=''>Selecione</option>

      {options?.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );

  const Input = ({
    placeholder,
    disabled,
    maxLength,
  }: InputMockProps) => (
    <input
      placeholder={placeholder}
      disabled={disabled}
      maxLength={maxLength}
    />
  );

  return {
    Button,
    Col,
    Form,
    Input,
    Row,
    Select,
    Space,
    Typography,
  };
});

jest.mock('~/components/lib/header-page', () => ({
  __esModule: true,
  default: ({
    title,
    children,
  }: {
    title: string;
    children?: React.ReactNode;
  }) => (
    <header>
      <h1>{title}</h1>
      {children}
    </header>
  ),
}));

jest.mock('~/components/lib/card-content', () => ({
  __esModule: true,
  default: ({
    children,
  }: {
    children?: React.ReactNode;
  }) => <main>{children}</main>,
}));

jest.mock('~/components/main/button/voltar', () => ({
  __esModule: true,
  default: ({
    onClick,
    id,
  }: {
    onClick?: () => void;
    id?: string;
  }) => (
    <button type='button' onClick={onClick} id={id}>
      Voltar
    </button>
  ),
}));

jest.mock('~/components/main/input/nome', () => ({
  InputNome: () => <div data-testid='input-nome' />,
}));

jest.mock('~/components/main/input/email', () => ({
  __esModule: true,
  default: ({
    formItemProps,
  }: {
    formItemProps?: { name?: string };
  }) => (
    <div
      data-testid={
        formItemProps?.name === 'emailEducacional'
          ? 'input-email-educacional'
          : 'input-email'
      }
    />
  ),
}));

jest.mock('~/components/main/input/telefone', () => ({
  __esModule: true,
  default: () => <div data-testid='input-telefone' />,
}));

jest.mock('~/components/main/input/unidade', () => ({
  __esModule: true,
  default: () => <div data-testid='input-unidade' />,
}));

jest.mock('~/components/main/input/senha-cadastro', () => ({
  __esModule: true,
  default: () => <div data-testid='input-senha' />,
}));

jest.mock('~/components/main/input/tipo-email', () => ({
  __esModule: true,
  default: () => <div data-testid='select-tipo-email' />,
}));

jest.mock(
  '../modal-edit-email/modal-edit-email-button',
  () => ({
    __esModule: true,
    default: () => <button>Editar e-mail</button>,
  }),
);

jest.mock(
  '../modal-edit-nome/modal-edit-nome-button',
  () => ({
    ModalEditNomeButton: () => (
      <button>Editar nome</button>
    ),
  }),
);

jest.mock(
  '../modal-edit-nova-senha/modal-edit-nova-senha-button',
  () => ({
    __esModule: true,
    default: () => <button>Editar senha</button>,
  }),
);

jest.mock(
  '../modal-edit-unidade/modal-edit-unidade-button',
  () => ({
    __esModule: true,
    default: () => <button>Editar unidade</button>,
  }),
);

jest.mock(
  '../modal-edit-tipo-email-educacional/modal-edit-tipo-email-educacional-button',
  () => ({
    __esModule: true,
    default: () => <button>Editar tipo de e-mail</button>,
  }),
);

jest.mock(
  '../modal-edit-telefone/modal-edit-telefone-button',
  () => ({
    ModalEditTelefoneButton: () => (
      <button>Editar telefone</button>
    ),
  }),
);

const mockSalvarAcessibilidade =
  usuarioService.salvarAcessibilidade as jest.MockedFunction<
    typeof usuarioService.salvarAcessibilidade
  >;

const mockNotificationSuccess =
  notification.success as jest.MockedFunction<
    typeof notification.success
  >;

const mockNotificationError =
  notification.error as jest.MockedFunction<
    typeof notification.error
  >;

const mockOnClickVoltar =
  onClickVoltar as jest.MockedFunction<
    typeof onClickVoltar
  >;

const mockMaskTelefone =
  maskTelefone as jest.MockedFunction<
    typeof maskTelefone
  >;

describe('MeusDados', () => {
  const meusDadosBase = {
    login: 'usuario.teste',
    cpf: '123.456.789-00',
    nome: 'Usuário Teste',
    email: 'usuario@teste.com',
    telefone: '61999999999',
    tipo: TipoUsuario.Externo,
    usuarioAcessibilidade: {
      usuarioId: 10,
      possuiDeficiencia: true,
      descricaoDeficiencia: 'Deficiência visual',
      necessitaAdaptacao: true,
      descricaoAdaptacao: 'Leitor de tela',
    },
  };

  const renderizar = (
    meusDados: Record<string, unknown> = meusDadosBase,
  ) =>
    render(
      <MeusDadosContext.Provider
        value={{ meusDados } as never}
      >
        <MeusDados />
      </MeusDadosContext.Provider>,
    );

  beforeEach(() => {
    jest.clearAllMocks();

    mockAuthState = {
      usuarioNome: 'Usuário autenticado',
      usuarioLogin: 'login.autenticado',
    };

    mockPerfilState = {
      perfilSelecionado: {
        perfilNome: 'Administrador',
      },
    };

    mockGetFieldsValue.mockReturnValue({
      qualDeficiencia: 'Deficiência visual',
      qualTipoAdaptacao: 'Leitor de tela',
    });

    mockSalvarAcessibilidade.mockResolvedValue({
      sucesso: true,
    } as never);
  });

  it('renderiza os dados principais do usuário', () => {
    renderizar();

    expect(
      screen.getByRole('heading', {
        name: 'Meus dados',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Usuário autenticado'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Perfil: Administrador'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Usuário: usuario.teste'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('CPF: 123.456.789-00'),
    ).toBeInTheDocument();

    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
  });

  it('preenche o formulário e mascara o telefone ao montar', async () => {
    renderizar();

    await waitFor(() => {
      expect(mockMaskTelefone).toHaveBeenCalledWith(
        '61999999999',
      );
    });

    expect(mockSetFieldsValue).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        telefone: 'mascarado-61999999999',
      }),
    );

    expect(mockSetFieldsValue).toHaveBeenNthCalledWith(2, {
      pessoaComDeficiencia: 'Sim',
      qualDeficiencia: 'Deficiência visual',
      precisaDeAdaptacao: 'Sim',
      qualTipoAdaptacao: 'Leitor de tela',
    });
  });

  it('usa telefone vazio quando o usuário não possui telefone', async () => {
    renderizar({
      ...meusDadosBase,
      telefone: undefined,
    });

    await waitFor(() => {
      expect(mockSetFieldsValue).toHaveBeenCalledWith(
        expect.objectContaining({
          telefone: '',
        }),
      );
    });

    expect(mockMaskTelefone).not.toHaveBeenCalled();
  });

  it('não configura acessibilidade quando os dados não existem', async () => {
    renderizar({
      ...meusDadosBase,
      usuarioAcessibilidade: undefined,
    });

    await waitFor(() => {
      expect(mockSetFieldsValue).toHaveBeenCalledTimes(1);
    });

    expect(mockSetFieldsValue).not.toHaveBeenCalledWith(
      expect.objectContaining({
        pessoaComDeficiencia: expect.anything(),
      }),
    );

    expect(
      screen.getByRole('button', { name: 'Salvar' }),
    ).toBeDisabled();
  });

  it('converte possuiDeficiencia false para Não', async () => {
    renderizar({
      ...meusDadosBase,
      usuarioAcessibilidade: {
        ...meusDadosBase.usuarioAcessibilidade,
        possuiDeficiencia: false,
        necessitaAdaptacao: false,
      },
    });

    await waitFor(() => {
      expect(mockSetFieldsValue).toHaveBeenLastCalledWith(
        expect.objectContaining({
          pessoaComDeficiencia: 'Não',
          precisaDeAdaptacao: 'Não',
        }),
      );
    });
  });

  it('converte deficiência não informada para Prefiro não responder', async () => {
    renderizar({
      ...meusDadosBase,
      usuarioAcessibilidade: {
        ...meusDadosBase.usuarioAcessibilidade,
        possuiDeficiencia: null,
        necessitaAdaptacao: null,
      },
    });

    await waitFor(() => {
      expect(mockSetFieldsValue).toHaveBeenLastCalledWith(
        expect.objectContaining({
          pessoaComDeficiencia:
            'Prefiro não responder',
          precisaDeAdaptacao: undefined,
        }),
      );
    });
  });

  it('exibe os controles exclusivos do usuário externo', () => {
    renderizar();

    expect(
      screen.getByRole('button', {
        name: 'Editar tipo de e-mail',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('input-unidade'),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: 'Editar unidade',
      }),
    ).toBeInTheDocument();
  });

  it('oculta controles exclusivos para usuário não externo', () => {
    renderizar({
      ...meusDadosBase,
      tipo: TipoUsuario.Interno,
    });

    expect(
      screen.queryByRole('button', {
        name: 'Editar tipo de e-mail',
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByTestId('input-unidade'),
    ).not.toBeInTheDocument();
  });

  it('executa a navegação de voltar', () => {
    renderizar();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Voltar',
      }),
    );

    expect(mockOnClickVoltar).toHaveBeenCalledWith({
      navigate: mockNavigate,
      route: ROUTES.PRINCIPAL,
    });
  });

  it('habilita os campos dependentes quando a resposta é Sim', async () => {
    renderizar({
      ...meusDadosBase,
      usuarioAcessibilidade: undefined,
    });

    const selects = screen.getAllByRole('combobox');

    fireEvent.change(selects[0], {
      target: { value: 'Sim' },
    });

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(
          'Informe a deficiência',
        ),
      ).toBeEnabled();
    });

    expect(mockSetFieldValue).toHaveBeenCalledWith(
      'qualDeficiencia',
      undefined,
    );

    expect(mockSetFieldValue).toHaveBeenCalledWith(
      'precisaDeAdaptacao',
      undefined,
    );

    expect(mockSetFieldValue).toHaveBeenCalledWith(
      'qualTipoAdaptacao',
      undefined,
    );

    expect(
      screen.getByRole('button', { name: 'Salvar' }),
    ).toBeEnabled();
  });

  it('desabilita os campos dependentes quando a resposta não é Sim', async () => {
    renderizar();

    const selects = screen.getAllByRole('combobox');

    fireEvent.change(selects[0], {
      target: { value: 'Não' },
    });

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(
          'Informe a deficiência',
        ),
      ).toBeDisabled();
    });

    expect(
      screen.getAllByRole('combobox')[1],
    ).toBeDisabled();

    expect(
      screen.getByPlaceholderText(
        'Informe o tipo de adaptação',
      ),
    ).toBeDisabled();
  });

  it('habilita o tipo de adaptação ao selecionar Sim', async () => {
    renderizar();

    const selects = screen.getAllByRole('combobox');

    fireEvent.change(selects[1], {
      target: { value: 'Sim' },
    });

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(
          'Informe o tipo de adaptação',
        ),
      ).toBeEnabled();
    });

    expect(mockSetFieldValue).toHaveBeenCalledWith(
      'qualTipoAdaptacao',
      undefined,
    );
  });

  it('desabilita o tipo de adaptação ao selecionar Não', async () => {
    renderizar();

    const selects = screen.getAllByRole('combobox');

    fireEvent.change(selects[1], {
      target: { value: 'Não' },
    });

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(
          'Informe o tipo de adaptação',
        ),
      ).toBeDisabled();
    });
  });

  it('salva acessibilidade com deficiência e adaptação', async () => {
    renderizar();

    fireEvent.click(
      screen.getByRole('button', { name: 'Salvar' }),
    );

    await waitFor(() => {
      expect(
        mockSalvarAcessibilidade,
      ).toHaveBeenCalledWith('login.autenticado', {
        usuarioId: 10,
        possuiDeficiencia: true,
        descricaoDeficiencia: 'Deficiência visual',
        necessitaAdaptacao: true,
        descricaoAdaptacao: 'Leitor de tela',
        salvar: true,
      });
    });

    expect(mockNotificationSuccess).toHaveBeenCalledWith({
      message: 'Sucesso',
      description:
        'Seus dados foram salvos com sucesso!',
    });
  });

  it('salva false quando a pessoa informa que não possui deficiência', async () => {
    renderizar();

    const selects = screen.getAllByRole('combobox');

    fireEvent.change(selects[0], {
      target: { value: 'Não' },
    });

    fireEvent.click(
      screen.getByRole('button', { name: 'Salvar' }),
    );

    await waitFor(() => {
      expect(
        mockSalvarAcessibilidade,
      ).toHaveBeenCalledWith(
        'login.autenticado',
        expect.objectContaining({
          possuiDeficiencia: false,
          descricaoDeficiencia: undefined,
          necessitaAdaptacao: undefined,
          descricaoAdaptacao: undefined,
        }),
      );
    });
  });

  it('salva null quando a pessoa prefere não responder', async () => {
    renderizar();

    fireEvent.change(screen.getAllByRole('combobox')[0], {
      target: {
        value: 'Prefiro não responder',
      },
    });

    fireEvent.click(
      screen.getByRole('button', { name: 'Salvar' }),
    );

    await waitFor(() => {
      expect(
        mockSalvarAcessibilidade,
      ).toHaveBeenCalledWith(
        'login.autenticado',
        expect.objectContaining({
          possuiDeficiencia: null,
          descricaoDeficiencia: undefined,
          necessitaAdaptacao: undefined,
          descricaoAdaptacao: undefined,
        }),
      );
    });
  });

  it('salva sem descrição de adaptação quando adaptação é Não', async () => {
    renderizar();

    fireEvent.change(screen.getAllByRole('combobox')[1], {
      target: { value: 'Não' },
    });

    fireEvent.click(
      screen.getByRole('button', { name: 'Salvar' }),
    );

    await waitFor(() => {
      expect(
        mockSalvarAcessibilidade,
      ).toHaveBeenCalledWith(
        'login.autenticado',
        expect.objectContaining({
          necessitaAdaptacao: false,
          descricaoAdaptacao: undefined,
        }),
      );
    });
  });

  it('usa usuarioId null quando não existe acessibilidade anterior', async () => {
    renderizar({
      ...meusDadosBase,
      usuarioAcessibilidade: undefined,
    });

    fireEvent.change(screen.getAllByRole('combobox')[0], {
      target: { value: 'Sim' },
    });

    fireEvent.click(
      screen.getByRole('button', { name: 'Salvar' }),
    );

    await waitFor(() => {
      expect(
        mockSalvarAcessibilidade,
      ).toHaveBeenCalledWith(
        'login.autenticado',
        expect.objectContaining({
          usuarioId: null,
        }),
      );
    });
  });

  it('exibe erro retornado pelo serviço', async () => {
    mockSalvarAcessibilidade.mockResolvedValue({
      sucesso: false,
      mensagens: ['Dados inválidos'],
    } as never);

    renderizar();

    fireEvent.click(
      screen.getByRole('button', { name: 'Salvar' }),
    );

    await waitFor(() => {
      expect(mockNotificationError).toHaveBeenCalledWith({
        message: 'Erro',
        description: 'Dados inválidos',
      });
    });

    expect(mockNotificationSuccess).not.toHaveBeenCalled();
  });

  it('usa mensagem padrão quando o serviço não retorna mensagem', async () => {
    mockSalvarAcessibilidade.mockResolvedValue({
      sucesso: false,
    } as never);

    renderizar();

    fireEvent.click(
      screen.getByRole('button', { name: 'Salvar' }),
    );

    await waitFor(() => {
      expect(mockNotificationError).toHaveBeenCalledWith({
        message: 'Erro',
        description: 'Erro ao salvar acessibilidade',
      });
    });
  });

  it('ativa e remove o loading durante o salvamento', async () => {
    let resolver:
      | ((value: { sucesso: boolean }) => void)
      | undefined;

    mockSalvarAcessibilidade.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolver = resolve;
        }) as never,
    );

    renderizar();

    const botaoSalvar = screen.getByRole('button', {
      name: 'Salvar',
    });

    await act(async () => {
      fireEvent.click(botaoSalvar);
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Salvar' })).toHaveAttribute(
        'data-loading',
        'true',
      );
    });

    await act(async () => {
      resolver?.({ sucesso: true });
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Salvar' })).toHaveAttribute(
        'data-loading',
        'false',
      );
    });
  });
});
