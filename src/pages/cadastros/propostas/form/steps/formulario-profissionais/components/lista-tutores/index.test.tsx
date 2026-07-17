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

import ListaTutores from './index';
import { PermissaoContext } from '../../../../../../../../routes/config/guard/permissao/provider';
import { CF_BUTTON_ADD_TUTOR } from '../../../../../../../../core/constants/ids/button/intex';

type Tutor = {
  id?: number;
  registroFuncional?: string;
  cpf?: string;
  nomeTutor?: string;
  nomesTurmas?: string;
};

type DrawerTutorMockProps = {
  openModal: boolean;
  onCloseModal: (recarregarLista: boolean) => void;
  id?: number;
};

type DataTableMockProps = {
  url: string;
  columns: Array<{
    title?: React.ReactNode;
    dataIndex?: string;
  }>;
  onRow?: (row: Tutor) => {
    onClick?: () => void;
  };
};

const mockReloadTable = jest.fn();

let mockParams: {
  id?: string;
};

let capturedDrawerProps:
  | DrawerTutorMockProps
  | undefined;

let capturedDataTableProps:
  | DataTableMockProps
  | undefined;

jest.mock('react-router-dom', () => ({
  useParams: () => mockParams,
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

jest.mock(
  '~/components/lib/card-table/provider',
  () => ({
    __esModule: true,
    default: ({
      children,
    }: {
      children?: React.ReactNode;
    }) => (
      <div data-testid='data-table-provider'>
        {children}
      </div>
    ),
  }),
);

jest.mock(
  '~/pages/cadastros/propostas/form/steps/formulario-profissionais/components/lista-tutores/drawer',
  () => ({
    __esModule: true,
    default: (props: DrawerTutorMockProps) => {
      capturedDrawerProps = props;

      return (
        <div data-testid='drawer-tutor'>
          <span data-testid='drawer-tutor-id'>
            {String(props.id)}
          </span>

          <button
            type='button'
            onClick={() => props.onCloseModal(false)}
          >
            Fechar sem recarregar
          </button>

          <button
            type='button'
            onClick={() => props.onCloseModal(true)}
          >
            Fechar e recarregar
          </button>
        </div>
      );
    },
  }),
);

jest.mock(
  '~/components/lib/card-table-profissional-tutor',
  () => {
    const ReactModule =
      jest.requireActual<typeof import('react')>('react');

    const Component = ReactModule.forwardRef<
      { reloadTable: () => void },
      DataTableMockProps
    >((props, ref) => {
      capturedDataTableProps = props;

      ReactModule.useImperativeHandle(
        ref,
        () => ({
          reloadTable: mockReloadTable,
        }),
        [],
      );

      const tutorTeste: Tutor = {
        id: 55,
        registroFuncional: '1234567',
        cpf: '123.456.789-00',
        nomeTutor: 'Tutor Teste',
        nomesTurmas: 'Turma A',
      };

      const rowProps = props.onRow?.(tutorTeste);

      return (
        <div data-testid='data-table-tutor'>
          <span data-testid='data-table-url'>
            {props.url}
          </span>

          <span data-testid='data-table-columns'>
            {props.columns
              .map((column) => column.dataIndex)
              .join(',')}
          </span>

          <button
            type='button'
            onClick={rowProps?.onClick}
          >
            Editar tutor
          </button>
        </div>
      );
    });

    Component.displayName =
      'DataTableProfissionalTutorMock';

    return {
      __esModule: true,
      default: Component,
    };
  },
);

jest.mock('../../../../styles', () => ({
  TituloListaPaginada: ({
    children,
  }: {
    children?: React.ReactNode;
  }) => <h3>{children}</h3>,
  TituloSecao: ({
    children,
  }: {
    children?: React.ReactNode;
  }) => <h2>{children}</h2>,
}));

jest.mock('antd', () => ({
  Button: ({
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
  ),
  Col: ({
    children,
  }: {
    children?: React.ReactNode;
  }) => <div>{children}</div>,
  Row: ({
    children,
  }: {
    children?: React.ReactNode;
  }) => <div>{children}</div>,
}));

describe('ListaTutores', () => {
  const renderizar = (
    recarregarTurmas = false,
    desabilitarCampos = false,
  ) =>
    render(
      <PermissaoContext.Provider
        value={{ desabilitarCampos } as never}
      >
        <ListaTutores
          recarregarTurmas={recarregarTurmas}
        />
      </PermissaoContext.Provider>,
    );

  beforeEach(() => {
    jest.clearAllMocks();

    mockParams = {
      id: '123',
    };

    capturedDrawerProps = undefined;
    capturedDataTableProps = undefined;
  });

  it('renderiza os títulos da seção', () => {
    renderizar();

    expect(
      screen.getByRole('heading', {
        name: 'Mediadores',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: 'Lista de mediadores',
      }),
    ).toBeInTheDocument();
  });

  it('renderiza dentro do provider da tabela', () => {
    renderizar();

    expect(
      screen.getByTestId('data-table-provider'),
    ).toBeInTheDocument();
  });

  it('configura o botão de adicionar mediador', () => {
    renderizar();

    const botao = screen.getByRole('button', {
      name: 'Adicionar mediadores',
    });

    expect(botao).toHaveAttribute(
      'id',
      CF_BUTTON_ADD_TUTOR,
    );

    expect(botao).toHaveAttribute(
      'data-button-type',
      'primary',
    );

    expect(botao).toBeEnabled();
  });

  it('desabilita o botão conforme a permissão', () => {
    renderizar(false, true);

    expect(
      screen.getByRole('button', {
        name: 'Adicionar mediadores',
      }),
    ).toBeDisabled();
  });

  it('não renderiza o drawer inicialmente', () => {
    renderizar();

    expect(
      screen.queryByTestId('drawer-tutor'),
    ).not.toBeInTheDocument();
  });

  it('abre o drawer para adicionar um novo mediador', () => {
    renderizar();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Adicionar mediadores',
      }),
    );

    expect(
      screen.getByTestId('drawer-tutor'),
    ).toBeInTheDocument();

    expect(capturedDrawerProps).toEqual(
      expect.objectContaining({
        openModal: true,
        id: undefined,
        onCloseModal: expect.any(Function),
      }),
    );
  });

  it('fecha o drawer sem recarregar a tabela', () => {
    renderizar();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Adicionar mediadores',
      }),
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Fechar sem recarregar',
      }),
    );

    expect(
      screen.queryByTestId('drawer-tutor'),
    ).not.toBeInTheDocument();

    expect(mockReloadTable).not.toHaveBeenCalled();
  });

  it('fecha o drawer e recarrega a tabela', () => {
    renderizar();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Adicionar mediadores',
      }),
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Fechar e recarregar',
      }),
    );

    expect(
      screen.queryByTestId('drawer-tutor'),
    ).not.toBeInTheDocument();

    expect(mockReloadTable).toHaveBeenCalledTimes(1);
  });

  it('abre o drawer para editar o tutor selecionado', () => {
    renderizar();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Editar tutor',
      }),
    );

    expect(
      screen.getByTestId('drawer-tutor'),
    ).toBeInTheDocument();

    expect(capturedDrawerProps).toEqual(
      expect.objectContaining({
        openModal: true,
        id: 55,
      }),
    );

    expect(
      screen.getByTestId('drawer-tutor-id'),
    ).toHaveTextContent('55');
  });

  it('limpa o tutor selecionado ao abrir um novo cadastro', () => {
    renderizar();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Editar tutor',
      }),
    );

    expect(capturedDrawerProps?.id).toBe(55);

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Fechar sem recarregar',
      }),
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Adicionar mediadores',
      }),
    );

    expect(capturedDrawerProps?.id).toBeUndefined();
  });

  it('limpa o tutor selecionado ao fechar o drawer', () => {
    renderizar();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Editar tutor',
      }),
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Fechar sem recarregar',
      }),
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Adicionar mediadores',
      }),
    );

    expect(capturedDrawerProps?.id).toBeUndefined();
  });

  it('monta a URL da tabela com o id da proposta', () => {
    mockParams = {
      id: '987',
    };

    renderizar();

    expect(capturedDataTableProps?.url).toBe(
      'v1/proposta/987/tutor',
    );

    expect(
      screen.getByTestId('data-table-url'),
    ).toHaveTextContent(
      'v1/proposta/987/tutor',
    );
  });

  it('usa zero na URL quando a rota não possui id', () => {
    mockParams = {};

    renderizar();

    expect(capturedDataTableProps?.url).toBe(
      'v1/proposta/0/tutor',
    );
  });

  it('configura as colunas esperadas', () => {
    renderizar();

    expect(capturedDataTableProps?.columns).toEqual([
      {
        title: 'RF',
        dataIndex: 'registroFuncional',
      },
      {
        title: 'CPF',
        dataIndex: 'cpf',
      },
      {
        title: 'Mediador',
        dataIndex: 'nomeTutor',
      },
      {
        title: 'Turmas',
        dataIndex: 'nomesTurmas',
      },
    ]);

    expect(
      screen.getByTestId('data-table-columns'),
    ).toHaveTextContent(
      'registroFuncional,cpf,nomeTutor,nomesTurmas',
    );
  });

  it('configura o clique da linha para edição', () => {
    renderizar();

    const tutor: Tutor = {
      id: 99,
      nomeTutor: 'Outro tutor',
    };

    const rowProps =
      capturedDataTableProps?.onRow?.(tutor);

    expect(rowProps).toEqual({
      onClick: expect.any(Function),
    });

    act(() => {
      rowProps?.onClick?.();
    });

    expect(capturedDrawerProps?.id).toBe(99);
  });

  it('recarrega a tabela quando recarregarTurmas é true', async () => {
    renderizar(true);

    await waitFor(() => {
      expect(mockReloadTable).toHaveBeenCalledTimes(1);
    });
  });

  it('não recarrega a tabela quando recarregarTurmas é false', () => {
    renderizar(false);

    expect(mockReloadTable).not.toHaveBeenCalled();
  });
  it('recarrega quando a propriedade muda para true', async () => {
    const { rerender } = render(
      <PermissaoContext.Provider value={{ desabilitarCampos: false } as never}>
        <ListaTutores recarregarTurmas={false} />
      </PermissaoContext.Provider>,
    );

    expect(mockReloadTable).not.toHaveBeenCalled();

    rerender(
      <PermissaoContext.Provider value={{ desabilitarCampos: false } as never}>
        <ListaTutores recarregarTurmas />
      </PermissaoContext.Provider>,
    );

    await waitFor(() => {
      expect(mockReloadTable).toHaveBeenCalledTimes(1);
    });
  });
});
