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

import { ListaCardsPropostas } from './inde';
import { ROUTES } from '../../../../core/enum/routes-enum';
import {
  SituacaoProposta,
  SituacaoPropostaTagDisplay,
} from '../../../../core/enum/situacao-proposta';
import { obterPropostasDashboard } from '../../../../core/services/proposta-service';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('~/core/services/proposta-service', () => ({
  obterPropostasDashboard: jest.fn(),
}));

jest.mock('~/components/main/empty', () => ({
  __esModule: true,
  default: () => (
    <div data-testid='empty-component'>
      Nenhuma proposta encontrada
    </div>
  ),
}));

jest.mock('~/core/styles/colors', () => ({
  Colors: {
    Neutral: {
      LIGHTEST: '#f5f5f5',
      DARK: '#333333',
    },
    Suporte: {
      Primary: {
        INFO: '#1677ff',
      },
    },
  },
}));

jest.mock('styled-components', () => {
  const ReactModule =
    jest.requireActual<typeof import('react')>('react');

  const styled = {
    div: (
      _styles: TemplateStringsArray,
      ..._expressions: unknown[]
    ) => {
      return ({
        children,
      }: {
        children?: React.ReactNode;
      }) =>
        ReactModule.createElement(
          'div',
          {
            'data-testid': 'proposta-hover',
          },
          children,
        );
    },
  };

  return {
    __esModule: true,
    default: styled,
  };
});

jest.mock('antd', () => {
  const ReactModule =
    jest.requireActual<typeof import('react')>('react');

  const Col = ({
    children,
    xs,
  }: {
    children?: React.ReactNode;
    xs?: number;
  }) =>
    ReactModule.createElement(
      'div',
      {
        'data-testid': 'antd-col',
        'data-xs': xs,
      },
      children,
    );

  const Flex = ({
    children,
    onClick,
    justify,
    align,
    gap,
    style,
  }: {
    children?: React.ReactNode;
    onClick?: () => void;
    justify?: string;
    align?: string;
    gap?: number;
    style?: React.CSSProperties;
  }) =>
    ReactModule.createElement(
      'div',
      {
        role: onClick ? 'button' : undefined,
        tabIndex: onClick ? 0 : undefined,
        onClick,
        'data-testid': onClick
          ? 'proposta-item-clicavel'
          : 'flex-container',
        'data-justify': justify,
        'data-align': align,
        'data-gap': gap,
        style,
      },
      children,
    );

  const Typography = ({
    children,
    style,
  }: {
    children?: React.ReactNode;
    style?: React.CSSProperties;
  }) =>
    ReactModule.createElement(
      'span',
      {
        style,
      },
      children,
    );

  Typography.Text = ({
    children,
    style,
    onClick,
    ellipsis,
  }: {
    children?: React.ReactNode;
    style?: React.CSSProperties;
    onClick?: () => void;
    ellipsis?: {
      tooltip?: React.ReactNode;
    };
  }) =>
    ReactModule.createElement(
      'span',
      {
        style,
        onClick,
        role: onClick ? 'button' : undefined,
        tabIndex: onClick ? 0 : undefined,
        title:
          typeof ellipsis?.tooltip === 'string'
            ? ellipsis.tooltip
            : undefined,
      },
      children,
    );

  const List = ({
    dataSource,
    renderItem,
    loading,
    locale,
    grid,
  }: {
    dataSource?: unknown[];
    renderItem?: (
      item: unknown,
      index: number,
    ) => React.ReactNode;
    loading?: boolean;
    locale?: {
      emptyText?: React.ReactNode;
    };
    grid?: Record<string, unknown>;
  }) => {
    if (loading) {
      return ReactModule.createElement(
        'div',
        {
          'data-testid': 'list-loading',
          'data-grid': JSON.stringify(grid),
        },
        'Carregando',
      );
    }

    if (!dataSource?.length) {
      return ReactModule.createElement(
        'div',
        {
          'data-testid': 'list-empty',
          'data-grid': JSON.stringify(grid),
        },
        locale?.emptyText ?? null,
      );
    }

    return ReactModule.createElement(
      'div',
      {
        'data-testid': 'antd-list',
        'data-grid': JSON.stringify(grid),
      },
      dataSource.map((item, index) =>
        ReactModule.createElement(
          ReactModule.Fragment,
          {
            key: index,
          },
          renderItem?.(item, index),
        ),
      ),
    );
  };

  List.Item = ({
    children,
  }: {
    children?: React.ReactNode;
  }) =>
    ReactModule.createElement(
      'div',
      {
        'data-testid': 'list-item',
      },
      children,
    );

  const Card = ({
    children,
    title,
    extra,
    actions,
    loading,
    style,
  }: {
    children?: React.ReactNode;
    title?: React.ReactNode;
    extra?: React.ReactNode;
    actions?: React.ReactNode[];
    loading?: boolean;
    style?: React.CSSProperties;
  }) =>
    ReactModule.createElement(
      'article',
      {
        'data-testid': 'proposta-card',
        'data-loading': String(Boolean(loading)),
        style,
      },
      ReactModule.createElement(
        'header',
        {
          'data-testid': 'card-title',
        },
        title,
      ),
      ReactModule.createElement(
        'div',
        {
          'data-testid': 'card-extra',
        },
        extra,
      ),
      ReactModule.createElement(
        'section',
        null,
        children,
      ),
      ReactModule.createElement(
        'footer',
        null,
        actions?.map((action, index) =>
          ReactModule.createElement(
            ReactModule.Fragment,
            {
              key: index,
            },
            action,
          ),
        ),
      ),
    );

  return {
    Card,
    Col,
    Flex,
    List,
    Typography,
  };
});

const mockObterPropostasDashboard =
  obterPropostasDashboard as jest.MockedFunction<
    typeof obterPropostasDashboard
  >;

describe('ListaCardsPropostas', () => {
  const filtrosPadrao = {
    texto: 'proposta',
    situacao: undefined,
    pagina: 1,
  };

  const criarItem = (
    overrides: Record<string, unknown> = {},
  ) => ({
    situacao: SituacaoProposta.Publicada,
    cor: '#00ff00',
    totalRegistros: 2,
    propostas: [
      {
        numero: 123,
        nome: 'Proposta de teste',
        data: '13/07/2026 10:30',
      },
      {
        numero: 456,
        nome: 'Segunda proposta',
        data: '13/07/2026 11:00',
      },
    ],
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockObterPropostasDashboard.mockResolvedValue({
      sucesso: true,
      dados: [],
    } as never);
  });

  it('consulta as propostas ao montar o componente', async () => {
    render(
      <ListaCardsPropostas
        filters={filtrosPadrao}
        carregando={false}
      />,
    );

    await waitFor(() => {
      expect(
        mockObterPropostasDashboard,
      ).toHaveBeenCalledTimes(1);
    });

    expect(
      mockObterPropostasDashboard,
    ).toHaveBeenCalledWith(filtrosPadrao);
  });

  it('consulta novamente quando os filtros são alterados', async () => {
    const { rerender } = render(
      <ListaCardsPropostas
        filters={filtrosPadrao}
        carregando={false}
      />,
    );

    await waitFor(() => {
      expect(
        mockObterPropostasDashboard,
      ).toHaveBeenCalledTimes(1);
    });

    const novosFiltros = {
      ...filtrosPadrao,
      texto: 'nova busca',
    } as never;

    rerender(
      <ListaCardsPropostas
        filters={novosFiltros}
        carregando={false}
      />,
    );

    await waitFor(() => {
      expect(
        mockObterPropostasDashboard,
      ).toHaveBeenCalledTimes(2);
    });

    expect(
      mockObterPropostasDashboard,
    ).toHaveBeenLastCalledWith(novosFiltros);
  });

  it('exibe o componente vazio antes e depois de uma resposta sem registros', async () => {
    mockObterPropostasDashboard.mockResolvedValue({
      sucesso: true,
      dados: [],
    } as never);

    render(
      <ListaCardsPropostas
        filters={filtrosPadrao}
        carregando={false}
      />,
    );

    expect(
      screen.getByTestId('empty-component'),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        mockObterPropostasDashboard,
      ).toHaveBeenCalled();
    });

    expect(
      screen.getByText('Nenhuma proposta encontrada'),
    ).toBeInTheDocument();
  });

  it('não altera os dados quando o serviço retorna sucesso falso', async () => {
    mockObterPropostasDashboard.mockResolvedValue({
      sucesso: false,
      dados: [criarItem()],
    } as never);

    render(
      <ListaCardsPropostas
        filters={filtrosPadrao}
        carregando={false}
      />,
    );

    await waitFor(() => {
      expect(
        mockObterPropostasDashboard,
      ).toHaveBeenCalled();
    });

    expect(
      screen.queryByText('Proposta de teste'),
    ).not.toBeInTheDocument();

    expect(
      screen.getByTestId('empty-component'),
    ).toBeInTheDocument();
  });

  it('exibe o estado de carregamento', () => {
    render(
      <ListaCardsPropostas
        filters={filtrosPadrao}
        carregando
      />,
    );

    expect(
      screen.getByTestId('list-loading'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Carregando'),
    ).toBeInTheDocument();
  });

  it('configura o grid responsivo da lista principal', () => {
    render(
      <ListaCardsPropostas
        filters={filtrosPadrao}
        carregando={false}
      />,
    );

    const listaVazia =
      screen.getByTestId('list-empty');

    expect(listaVazia).toHaveAttribute(
      'data-grid',
      JSON.stringify({
        gutter: [26, 26],
        xs: 1,
        sm: 1,
        md: 2,
        lg: 2,
        xl: 2,
        xxl: 4,
      }),
    );
  });

  it('renderiza os dados retornados com sucesso', async () => {
    mockObterPropostasDashboard.mockResolvedValue({
      sucesso: true,
      dados: [criarItem()],
    } as never);

    render(
      <ListaCardsPropostas
        filters={filtrosPadrao}
        carregando={false}
      />,
    );

    expect(
      await screen.findByText(
        `${SituacaoPropostaTagDisplay[SituacaoProposta.Publicada]}`,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText('123 - Proposta de teste'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('456 - Segunda proposta'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('13/07/2026 10:30'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Data/Hora'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Ver mais 2'),
    ).toBeInTheDocument();
  });

  it('configura tooltip, estilos e propriedades do item da proposta', async () => {
    mockObterPropostasDashboard.mockResolvedValue({
      sucesso: true,
      dados: [criarItem()],
    } as never);

    render(
      <ListaCardsPropostas
        filters={filtrosPadrao}
        carregando={false}
      />,
    );

    const texto = await screen.findByText(
      '123 - Proposta de teste',
    );

    expect(texto).toHaveAttribute(
      'title',
      'Proposta de teste',
    );

    expect(texto).toHaveStyle({
      fontSize: '13px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      width: '70%',
    });

    expect(
      screen.getByText('13/07/2026 10:30'),
    ).toHaveStyle({
      fontSize: '10px',
      color: '#333333',
    });
  });

  it('aplica a cor da situação à borda do card', async () => {
    mockObterPropostasDashboard.mockResolvedValue({
      sucesso: true,
      dados: [
        criarItem({
          cor: 'rgb(10, 20, 30)',
        }),
      ],
    } as never);

    render(
      <ListaCardsPropostas
        filters={filtrosPadrao}
        carregando={false}
      />,
    );

    const card =
      await screen.findByTestId('proposta-card');

    expect(card).toHaveStyle({
      borderLeft: '10px solid rgb(10, 20, 30)',
      borderRadius: '5px',
    });
  });

  it('navega para a edição ao clicar em uma proposta', async () => {
    mockObterPropostasDashboard.mockResolvedValue({
      sucesso: true,
      dados: [criarItem()],
    } as never);

    render(
      <ListaCardsPropostas
        filters={filtrosPadrao}
        carregando={false}
      />,
    );

    const itensClicaveis =
      await screen.findAllByTestId(
        'proposta-item-clicavel',
      );

    fireEvent.click(itensClicaveis[0]);

    expect(mockNavigate).toHaveBeenCalledWith(
      `${ROUTES.CADASTRO_DE_PROPOSTAS}/editar/123`,
      {
        replace: true,
      },
    );
  });

  it('navega para a listagem filtrada ao clicar em Ver mais', async () => {
    mockObterPropostasDashboard.mockResolvedValue({
      sucesso: true,
      dados: [criarItem()],
    } as never);

    render(
      <ListaCardsPropostas
        filters={filtrosPadrao}
        carregando={false}
      />,
    );

    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Ver mais 2',
      }),
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      ROUTES.CADASTRO_DE_PROPOSTAS,
      {
        state: {
          filters: {
            ...filtrosPadrao,
            situacao: SituacaoProposta.Publicada,
          },
        },
      },
    );
  });

  it('não navega ao clicar em Ver mais quando a situação é falsy', async () => {
    mockObterPropostasDashboard.mockResolvedValue({
      sucesso: true,
      dados: [
        criarItem({
          situacao: undefined,
        }),
      ],
    } as never);

    render(
      <ListaCardsPropostas
        filters={filtrosPadrao}
        carregando={false}
      />,
    );

    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Ver mais 2',
      }),
    );

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it.each([
    SituacaoProposta.Publicada,
    SituacaoProposta.Rascunho,
    SituacaoProposta.Cadastrada,
    SituacaoProposta.AguardandoAnaliseDf,
    SituacaoProposta.AguardandoAnaliseGestao,
    SituacaoProposta.Desfavoravel,
    SituacaoProposta.Devolvida,
  ])(
    'renderiza corretamente a situação %s',
    async (situacao) => {
      mockObterPropostasDashboard.mockResolvedValue({
        sucesso: true,
        dados: [
          criarItem({
            situacao,
            cor: '#abcdef',
          }),
        ],
      } as never);

      render(
        <ListaCardsPropostas
          filters={filtrosPadrao}
          carregando={false}
        />,
      );

      expect(
        await screen.findByText(
          `${SituacaoPropostaTagDisplay[situacao]}`,
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByTestId('proposta-card'),
      ).toHaveStyle({
        borderLeft: '10px solid #abcdef',
      });
    },
  );

  it('executa o caso default para uma situação não reconhecida', async () => {
    mockObterPropostasDashboard.mockResolvedValue({
      sucesso: true,
      dados: [
        criarItem({
          situacao: 'SITUACAO_DESCONHECIDA',
          cor: '#123456',
        }),
      ],
    } as never);

    render(
      <ListaCardsPropostas
        filters={filtrosPadrao}
        carregando={false}
      />,
    );

    expect(
      await screen.findByTestId('proposta-card'),
    ).toHaveStyle({
      borderLeft: '10px solid #123456',
    });
  });

  it('renderiza uma lista interna vazia quando o card não possui propostas', async () => {
    mockObterPropostasDashboard.mockResolvedValue({
      sucesso: true,
      dados: [
        criarItem({
          propostas: [],
        }),
      ],
    } as never);

    render(
      <ListaCardsPropostas
        filters={filtrosPadrao}
        carregando={false}
      />,
    );

    expect(
      await screen.findByTestId('proposta-card'),
    ).toBeInTheDocument();

    expect(
      screen.queryByText('Proposta de teste'),
    ).not.toBeInTheDocument();
  });

  it('renderiza múltiplos cards retornados pelo serviço', async () => {
    mockObterPropostasDashboard.mockResolvedValue({
      sucesso: true,
      dados: [
        criarItem({
          situacao: SituacaoProposta.Publicada,
          totalRegistros: 2,
        }),
        criarItem({
          situacao: SituacaoProposta.Rascunho,
          cor: '#ff0000',
          totalRegistros: 5,
          propostas: [
            {
              numero: 999,
              nome: 'Proposta em rascunho',
              data: '13/07/2026 15:00',
            },
          ],
        }),
      ],
    } as never);

    render(
      <ListaCardsPropostas
        filters={filtrosPadrao}
        carregando={false}
      />,
    );

    await waitFor(() => {
      expect(
        screen.getAllByTestId('proposta-card'),
      ).toHaveLength(2);
    });

    expect(
      screen.getByText('999 - Proposta em rascunho'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Ver mais 5'),
    ).toBeInTheDocument();
  });

  it('mantém o carregamento do Card sincronizado com a propriedade carregando', async () => {
    mockObterPropostasDashboard.mockResolvedValue({
      sucesso: true,
      dados: [criarItem()],
    } as never);

    const { rerender } = render(
      <ListaCardsPropostas
        filters={filtrosPadrao}
        carregando={false}
      />,
    );

    expect(
      await screen.findByTestId('proposta-card'),
    ).toHaveAttribute('data-loading', 'false');

    rerender(
      <ListaCardsPropostas
        filters={filtrosPadrao}
        carregando
      />,
    );

    expect(
      screen.getByTestId('list-loading'),
    ).toBeInTheDocument();
  });

  it('mantém os dados da resposta mais recente renderizados', async () => {
    let resolver:
      | ((value: unknown) => void)
      | undefined;

    mockObterPropostasDashboard.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolver = resolve;
        }) as never,
    );

    render(
      <ListaCardsPropostas
        filters={filtrosPadrao}
        carregando={false}
      />,
    );

    expect(
      screen.getByTestId('empty-component'),
    ).toBeInTheDocument();

    await act(async () => {
      resolver?.({
        sucesso: true,
        dados: [criarItem()],
      });
    });

    expect(
      await screen.findByText('123 - Proposta de teste'),
    ).toBeInTheDocument();
  });
});
