/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import React from 'react';

import ListaRegentes from './index';
import { PermissaoContext } from '../../../../../../../../routes/config/guard/permissao/provider';
import { CF_BUTTON_ADD_REGENTE } from '../../../../../../../../core/constants/ids/button/intex';
import { TipoFormacao } from '~/core/enum/tipo-formacao';
import { PropostaContext } from '~/pages/cadastros/propostas/form/provider';

type Regente = {
  id?: number;
  registroFuncional?: string;
  cpf?: string;
  nomeRegente?: string;
  nomesTurmas?: string;
};

type DrawerRegenteMockProps = {
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
  onRow?: (row: Regente) => {
    onClick?: () => void;
  };
};

const mockReloadTable = jest.fn();

let mockParams: {
  id?: string;
};

let capturedDrawerProps: DrawerRegenteMockProps | undefined;
let capturedDataTableProps: DataTableMockProps | undefined;

jest.mock('react-router-dom', () => ({
  useParams: () => mockParams,
}));

jest.mock(
  '~/routes/config/guard/permissao/provider',
  () => {
    const ReactModule = jest.requireActual<typeof import('react')>('react');
    return {
      PermissaoContext: ReactModule.createContext({
        desabilitarCampos: false,
      }),
    };
  },
);

jest.mock(
  '~/pages/cadastros/propostas/form/steps/formulario-profissionais/components/lista-regentes/drawer',
  () => ({
    __esModule: true,
    default: (props: DrawerRegenteMockProps) => {
      capturedDrawerProps = props;
      return (
        <div data-testid='drawer-regente'>
          <span data-testid='drawer-regente-id'>{String(props.id)}</span>
          <button type='button' onClick={() => props.onCloseModal(false)}>
            Fechar sem recarregar
          </button>
          <button type='button' onClick={() => props.onCloseModal(true)}>
            Fechar e recarregar
          </button>
        </div>
      );
    },
  }),
);

jest.mock(
  '~/components/lib/card-table-profissional-regente',
  () => {
    const ReactModule = jest.requireActual<typeof import('react')>('react');

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

      const regenteTeste: Regente = {
        id: 77,
        registroFuncional: '7654321',
        cpf: '987.654.321-00',
        nomeRegente: 'Regente Teste',
        nomesTurmas: 'Turma B',
      };

      const rowProps = props.onRow?.(regenteTeste);

      return (
        <div data-testid='data-table-regente'>
          <span data-testid='data-table-url'>{props.url}</span>
          <span data-testid='data-table-columns'>
            {props.columns.map((column) => column.dataIndex).join(',')}
          </span>
          <button type='button' onClick={rowProps?.onClick}>
            Editar regente
          </button>
        </div>
      );
    });

    Component.displayName = 'DataTableProfissionalRegenteMock';

    return {
      __esModule: true,
      default: Component,
    };
  },
);

jest.mock('../../../../styles', () => ({
  TituloListaPaginada: ({ children }: { children?: React.ReactNode }) => <h3>{children}</h3>,
  TituloSecao: ({ children }: { children?: React.ReactNode }) => <h2>{children}</h2>,
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
  Col: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Row: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
}));

describe('ListaRegentes', () => {
  const renderizar = (
    recarregarTurmas = false,
    desabilitarCampos = false,
    tipoFormacao?: TipoFormacao,
  ) =>
    render(
      <PermissaoContext.Provider
        value={{ desabilitarCampos } as never}
      >
        <PropostaContext.Provider
          value={{
            formInitialValues: { tipoFormacao },
            setFormInitialValues: jest.fn(),
          }}
        >
          <ListaRegentes recarregarTurmas={recarregarTurmas} />
        </PropostaContext.Provider>
      </PermissaoContext.Provider>,
    );

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {
      id: '456',
    };
    capturedDrawerProps = undefined;
    capturedDataTableProps = undefined;
  });

  it('renderiza os títulos da seção', () => {
    renderizar();

    expect(
      screen.getByRole('heading', {
        name: 'Regentes',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: 'Lista de regentes',
      }),
    ).toBeInTheDocument();
  });

  it('configura o botão de adicionar regentes com id e texto corretos', () => {
    renderizar();

    const botao = screen.getByRole('button', {
      name: 'Adicionar regentes',
    });

    expect(botao).toHaveAttribute('id', CF_BUTTON_ADD_REGENTE);
    expect(botao).toHaveAttribute('data-button-type', 'primary');
  });

  it('desabilita o botão conforme a permissão desabilitarCampos', () => {
    renderizar(false, true);

    expect(
      screen.getByRole('button', {
        name: 'Adicionar regentes',
      }),
    ).toBeDisabled();
  });

  it('desabilita o botão de adicionar regentes quando o tipo de formação for Conferencia', () => {
    renderizar(false, false, TipoFormacao.Conferencia);

    expect(
      screen.getByRole('button', {
        name: 'Adicionar regentes',
      }),
    ).toBeDisabled();
  });

  it('habilita o botão de adicionar regentes quando o tipo de formação for Curso', () => {
    renderizar(false, false, TipoFormacao.Curso);

    expect(
      screen.getByRole('button', {
        name: 'Adicionar regentes',
      }),
    ).not.toBeDisabled();
  });

  it('habilita o botão de adicionar regentes quando o tipo de formação for Evento', () => {
    renderizar(false, false, TipoFormacao.Evento);

    expect(
      screen.getByRole('button', {
        name: 'Adicionar regentes',
      }),
    ).not.toBeDisabled();
  });

  it('abre o drawer ao clicar em Adicionar regentes', () => {
    renderizar();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Adicionar regentes',
      }),
    );

    expect(screen.getByTestId('drawer-regente')).toBeInTheDocument();
    expect(capturedDrawerProps?.id).toBeUndefined();
  });

  it('fecha o drawer e não recarrega tabela', () => {
    renderizar();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Adicionar regentes',
      }),
    );

    fireEvent.click(screen.getByText('Fechar sem recarregar'));

    expect(screen.queryByTestId('drawer-regente')).not.toBeInTheDocument();
    expect(mockReloadTable).not.toHaveBeenCalled();
  });

  it('fecha o drawer e recarrega tabela', () => {
    renderizar();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Adicionar regentes',
      }),
    );

    fireEvent.click(screen.getByText('Fechar e recarregar'));

    expect(screen.queryByTestId('drawer-regente')).not.toBeInTheDocument();
    expect(mockReloadTable).toHaveBeenCalledTimes(1);
  });

  it('configura as colunas esperadas na tabela de regentes', () => {
    renderizar();

    expect(capturedDataTableProps?.columns.map((c) => c.dataIndex)).toEqual([
      'registroFuncional',
      'cpf',
      'nomeRegente',
      'nomesTurmas',
    ]);
  });

  it('monta a URL da tabela com o id da proposta', () => {
    renderizar();

    expect(capturedDataTableProps?.url).toBe('v1/proposta/456/regente');
  });

  it('abre o drawer para editar o regente selecionado ao clicar na linha', () => {
    renderizar();

    fireEvent.click(screen.getByText('Editar regente'));

    expect(screen.getByTestId('drawer-regente')).toBeInTheDocument();
    expect(capturedDrawerProps?.id).toBe(77);
  });
});
