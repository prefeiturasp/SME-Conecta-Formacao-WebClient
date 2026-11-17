/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ROUTES } from '~/core/enum/routes-enum';
import api from '~/core/services/api';
import { cancelarInscricao } from '~/core/services/inscricao-service';
import { confirmacao } from '~/core/services/alerta-service';
import { notification } from '~/components/lib/notification';

import MinhasInscricoesMobile from './index';
import { InscricaoProps } from '../../listagem';

jest.mock('../modal-edit-cargo-funcao/modal-edit-cargo-funcao-button', () => {
  return function MockModalEditCargoFuncaoButton() {
    return <button data-testid='mock-edit-cargo-btn'>Editar Cargo</button>;
  };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/formacao-cursista/minhas-inscricoes' }),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

jest.mock('~/core/services/api', () => ({
  get: jest.fn(),
}));

jest.mock('~/core/services/inscricao-service', () => ({
  URL_INSCRICAO: 'v1/Inscricao',
  cancelarInscricao: jest.fn(),
}));

jest.mock('~/core/services/alerta-service', () => ({
  confirmacao: jest.fn(),
}));

jest.mock('~/components/lib/notification', () => ({
  notification: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('antd/es/date-picker/locale/pt_BR', () => ({}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const originalGetComputedStyle = window.getComputedStyle.bind(window);
beforeAll(() => {
  window.getComputedStyle = (elt: Element, _pseudoElt?: string | null) => {
    try {
      return originalGetComputedStyle(elt);
    } catch {
      return elt instanceof HTMLElement ? elt.style : ({} as CSSStyleDeclaration);
    }
  };
});

afterAll(() => {
  window.getComputedStyle = originalGetComputedStyle;
});

const mockInscricoes: InscricaoProps[] = [
  {
    id: 1,
    codigoFormacao: 101,
    nomeFormacao: 'Formação Gamificação',
    nomeTurma: 'Turma G1',
    datas: '01/06/2026 a 30/06/2026',
    cargoFuncaoCodigo: '10',
    cargoFuncao: 'Professor',
    situacao: 'Confirmada',
    podeCancelar: true,
    integrarNoSga: false,
    iniciado: false,
  },
  {
    id: 2,
    codigoFormacao: 102,
    nomeFormacao: 'Formação Robótica',
    nomeTurma: 'Turma R1',
    datas: '15/06/2026 a 15/07/2026',
    cargoFuncaoCodigo: '10',
    cargoFuncao: 'Professor',
    situacao: 'Aguardando a análise',
    podeCancelar: true,
    integrarNoSga: true,
    iniciado: true,
  },
];

describe('MinhasInscricoesMobile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (api.get as jest.Mock).mockResolvedValue({
      data: {
        items: mockInscricoes,
        totalRegistros: 2,
        sucesso: true,
      },
    });
  });

  it('deve renderizar o cabeçalho e navegar ao clicar em Explorar formações', async () => {
    render(<MinhasInscricoesMobile />);

    expect(screen.getByText('Minhas inscrições')).toBeInTheDocument();
    const btnExplorar = screen.getByTestId('btn-explorar-formacoes-mobile');
    expect(btnExplorar).toBeInTheDocument();

    fireEvent.click(btnExplorar);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.AREA_PUBLICA);
  });

  it('deve alternar entre as abas Próximas e Finalizadas e atualizar descrição', async () => {
    render(<MinhasInscricoesMobile />);

    await waitFor(() => {
      expect(
        screen.getByText('Formações em que você se inscreveu e que ainda vão acontecer.'),
      ).toBeInTheDocument();
    });

    const tabFinalizadas = screen.getByTestId('tab-finalizadas');
    fireEvent.click(tabFinalizadas);

    await waitFor(() => {
      expect(
        screen.getByText(/Confira aqui todas as formações em que você se inscreveu/),
      ).toBeInTheDocument();
    });

    // Clicar na mesma aba não faz nada
    fireEvent.click(tabFinalizadas);
    expect(tabFinalizadas).toHaveAttribute('aria-selected', 'true');
  });

  it('deve filtrar pela busca rápida', async () => {
    render(<MinhasInscricoesMobile />);

    await waitFor(() => {
      expect(screen.getByTestId('cards-list')).toBeInTheDocument();
    });

    const inputBusca = screen.getByTestId('input-busca-rapida');
    fireEvent.change(inputBusca, { target: { value: 'Gamificação' } });

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('NomeFormacao=Gamifica%C3%A7%C3%A3o'),
        expect.any(Object),
      );
    });
  });

  it('deve abrir o painel de filtros e aplicar filtros avançados com badge', async () => {
    render(<MinhasInscricoesMobile />);

    await waitFor(() => {
      expect(screen.getByTestId('btn-abrir-filtros')).toBeInTheDocument();
    });

    // Abrir painel
    fireEvent.click(screen.getByTestId('btn-abrir-filtros'));

    await waitFor(() => {
      expect(screen.getByTestId('mobile-filter-panel')).toBeInTheDocument();
    });

    // Fechar pelo botão X (cobre onClose)
    const btnFecharPainel = screen.getByTestId('mobile-filter-panel-close-btn');
    fireEvent.click(btnFecharPainel);
    await waitFor(() => {
      expect(screen.queryByTestId('mobile-filter-panel')).not.toBeInTheDocument();
    });

    // Reabrir painel
    fireEvent.click(screen.getByTestId('btn-abrir-filtros'));

    // Preencher filtros
    const inputCodigo = screen.getByTestId('filtro-codigo-formacao');
    fireEvent.change(inputCodigo, { target: { value: '101' } });

    const btnAplicar = screen.getByTestId('mobile-filter-panel-apply-btn');
    fireEvent.click(btnAplicar);

    await waitFor(() => {
      expect(screen.getByTestId('badge-filtros')).toHaveTextContent('1');
      expect(screen.getByTestId('btn-abrir-filtros')).toHaveTextContent('Limpar filtros');
    });

    // Clicar no botão "Limpar filtros" limpa os filtros diretamente sem abrir o painel
    fireEvent.click(screen.getByTestId('btn-abrir-filtros'));

    await waitFor(() => {
      expect(screen.queryByTestId('badge-filtros')).not.toBeInTheDocument();
      expect(screen.queryByTestId('mobile-filter-panel')).not.toBeInTheDocument();
      expect(screen.getByTestId('btn-abrir-filtros')).toHaveTextContent('Filtros');
    });

    // Abrir painel e testar botão de limpar interno do painel (handleClearFiltros)
    fireEvent.click(screen.getByTestId('btn-abrir-filtros'));
    await waitFor(() => {
      expect(screen.getByTestId('mobile-filter-panel')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('mobile-filter-panel-clear-btn'));
    await waitFor(() => {
      expect(screen.queryByTestId('mobile-filter-panel')).not.toBeInTheDocument();
    });
  });

  it('deve renderizar empty state quando não houver registros e navegar no botão', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: {
        items: [],
        totalRegistros: 0,
        sucesso: true,
      },
    });

    render(<MinhasInscricoesMobile />);

    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });

    const btnEmpty = screen.getByTestId('btn-empty-explorar');
    fireEvent.click(btnEmpty);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.AREA_PUBLICA);
  });

  it('deve suportar paginação progressiva com Exibir mais sem duplicar IDs', async () => {
    (api.get as jest.Mock)
      .mockResolvedValueOnce({
        data: {
          items: [mockInscricoes[0]],
          totalRegistros: 2,
          sucesso: true,
        },
      })
      .mockResolvedValueOnce({
        data: {
          items: [mockInscricoes[0], mockInscricoes[1]], // retorna item 1 repetido e item 2 novo
          totalRegistros: 2,
          sucesso: true,
        },
      });

    render(<MinhasInscricoesMobile />);

    await waitFor(() => {
      expect(screen.getByTestId('btn-exibir-mais')).toBeInTheDocument();
      expect(screen.getByTestId('contador-inscricoes')).toHaveTextContent(
        'Exibindo 1 de 2 inscrições',
      );
    });

    const btnExibirMais = screen.getByTestId('btn-exibir-mais');
    expect(btnExibirMais).toBeEnabled();
    fireEvent.click(btnExibirMais);

    await waitFor(() => {
      expect(screen.getByTestId('contador-inscricoes')).toHaveTextContent(
        'Exibindo 2 de 2 inscrições',
      );
      const btnMais = screen.getByTestId('btn-exibir-mais');
      expect(btnMais).toBeInTheDocument();
      expect(btnMais).toBeDisabled();
    });

    // Clicar no botão desabilitado não deve fazer nova busca
    fireEvent.click(screen.getByTestId('btn-exibir-mais'));
    expect(api.get).toHaveBeenCalledTimes(2);
  });

  it('deve abrir o modal de detalhes da inscrição e fechá-lo', async () => {
    render(<MinhasInscricoesMobile />);

    await waitFor(() => {
      expect(screen.getByTestId('btn-detalhes-1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('btn-detalhes-1'));

    await waitFor(() => {
      expect(screen.getByTestId('modal-detalhes-inscricao')).toBeInTheDocument();
      expect(screen.getByText('Detalhes da inscrição')).toBeInTheDocument();
    });

    const btnFechar = screen.getByTestId('btn-fechar-detalhes');
    fireEvent.click(btnFechar);

    await waitFor(() => {
      expect(screen.queryByTestId('modal-detalhes-inscricao')).not.toBeInTheDocument();
    });
  });

  it('deve cancelar inscrição com sucesso após confirmação', async () => {
    (cancelarInscricao as jest.Mock).mockResolvedValueOnce({ sucesso: true });
    (confirmacao as jest.Mock).mockImplementationOnce(({ onOk }) => onOk());

    render(<MinhasInscricoesMobile ehCursista={true} />);

    await waitFor(() => {
      expect(screen.getByTestId('btn-cancelar-2')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('btn-cancelar-2'));

    await waitFor(() => {
      expect(confirmacao).toHaveBeenCalled();
      expect(cancelarInscricao).toHaveBeenCalledWith(2);
      expect(notification.success).toHaveBeenCalledWith({
        message: 'Sucesso',
        description: 'Inscrição cancelada com sucesso!',
      });
    });
  });

  it('deve exibir notificação de erro quando cancelamento falhar', async () => {
    (cancelarInscricao as jest.Mock).mockRejectedValueOnce(new Error('Erro na API'));
    (confirmacao as jest.Mock).mockImplementationOnce(({ onOk }) => onOk());

    render(<MinhasInscricoesMobile ehCursista={true} />);

    await waitFor(() => {
      expect(screen.getByTestId('btn-cancelar-1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('btn-cancelar-1'));

    await waitFor(() => {
      expect(notification.error).toHaveBeenCalledWith({
        message: 'Erro',
        description: 'Não foi possível cancelar a inscrição.',
      });
    });
  });

  it('deve cobrir mensagens de confirmação para perfil não cursista e diferentes cenários', async () => {
    (cancelarInscricao as jest.Mock).mockResolvedValue({ sucesso: true });
    (confirmacao as jest.Mock).mockImplementation(({ onOk }) => onOk());

    // Record com integrarNoSga e iniciado para não cursista
    const recordNaoCursistaSga: InscricaoProps = {
      ...mockInscricoes[0],
      id: 3,
      integrarNoSga: true,
      iniciado: true,
    };

    // Record sem integrarNoSga e não iniciado para não cursista
    const recordNaoCursistaSemSga: InscricaoProps = {
      ...mockInscricoes[0],
      id: 4,
      integrarNoSga: false,
      iniciado: false,
    };

    (api.get as jest.Mock).mockResolvedValueOnce({
      data: {
        items: [recordNaoCursistaSga, recordNaoCursistaSemSga],
        totalRegistros: 2,
        sucesso: true,
      },
    });

    render(<MinhasInscricoesMobile ehCursista={false} />);

    await waitFor(() => {
      expect(screen.getByTestId('btn-cancelar-3')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('btn-cancelar-3'));
    expect(confirmacao).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.anything(),
      }),
    );

    fireEvent.click(screen.getByTestId('btn-cancelar-4'));
    expect(confirmacao).toHaveBeenCalled();
  });

  it('deve lidar com erro na chamada da API de listagem gracefully', async () => {
    (api.get as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<MinhasInscricoesMobile />);

    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });
  });

  it('deve aplicar filtros com datas e turma em andamento e finalizadas', async () => {
    render(<MinhasInscricoesMobile />);

    await waitFor(() => {
      expect(screen.getByTestId('btn-abrir-filtros')).toBeInTheDocument();
    });

    // Abrir filtros
    fireEvent.click(screen.getByTestId('btn-abrir-filtros'));

    await waitFor(() => {
      expect(screen.getByTestId('filtro-nome-formacao')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId('filtro-nome-formacao'), {
      target: { value: 'Formação Web' },
    });
    fireEvent.change(screen.getByTestId('filtro-turma'), {
      target: { value: 'Turma W' },
    });

    const btnAplicar = screen.getByTestId('mobile-filter-panel-apply-btn');
    fireEvent.click(btnAplicar);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('NomeFormacao=Forma%C3%A7%C3%A3o+Web'),
        expect.any(Object),
      );
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('NomeTurma=Turma+W'),
        expect.any(Object),
      );
    });

    // Mudar para aba finalizadas com filtros
    fireEvent.click(screen.getByTestId('tab-finalizadas'));

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('v1/Inscricao/finalizadas'),
        expect.any(Object),
      );
    });

    // Clicar novamente em proximas quando já estiver nela
    fireEvent.click(screen.getByTestId('tab-proximas'));
    await waitFor(() => {
      expect(screen.getByTestId('tab-proximas')).toHaveAttribute('aria-selected', 'true');
    });
    fireEvent.click(screen.getByTestId('tab-proximas'));
  });

  it('deve enviar parâmetros completos de data e situação para a API em ambas as abas', async () => {
    render(<MinhasInscricoesMobile />);

    await waitFor(() => {
      expect(screen.getByTestId('btn-abrir-filtros')).toBeInTheDocument();
    });

    // Abrir filtros na aba andamento
    fireEvent.click(screen.getByTestId('btn-abrir-filtros'));

    const inputDataInscricao = screen.getByPlaceholderText('00/00/0000');
    fireEvent.change(inputDataInscricao, { target: { value: '15/05/2026' } });
    fireEvent.keyDown(inputDataInscricao, { key: 'Enter' });

    const inputDataInicial = screen.getByPlaceholderText('Data inicial');
    fireEvent.change(inputDataInicial, { target: { value: '01/06/2026' } });
    fireEvent.keyDown(inputDataInicial, { key: 'Enter' });

    const inputDataFinal = screen.getByPlaceholderText('Data final');
    fireEvent.change(inputDataFinal, { target: { value: '30/06/2026' } });
    fireEvent.keyDown(inputDataFinal, { key: 'Enter' });

    const combobox = screen.getByRole('combobox');
    fireEvent.mouseDown(combobox);
    const option = screen.getByTitle('Confirmada');
    fireEvent.click(option);

    fireEvent.click(screen.getByTestId('mobile-filter-panel-apply-btn'));

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('Situacao=1'),
        expect.any(Object),
      );
    });

    // Ir para finalizadas e preencher situação e datas
    fireEvent.click(screen.getByTestId('tab-finalizadas'));
    await waitFor(() => {
      expect(screen.getByTestId('btn-abrir-filtros')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('btn-abrir-filtros'));
    const comboboxFin = screen.getAllByRole('combobox')[0];
    fireEvent.mouseDown(comboboxFin);
    const optionFin = screen.getByTitle('Transferida');
    fireEvent.click(optionFin);

    const inputDataInicialFin = screen.getByPlaceholderText('Data inicial');
    fireEvent.change(inputDataInicialFin, { target: { value: '01/01/2026' } });
    fireEvent.keyDown(inputDataInicialFin, { key: 'Enter' });

    const inputDataFinalFin = screen.getByPlaceholderText('Data final');
    fireEvent.change(inputDataFinalFin, { target: { value: '31/01/2026' } });
    fireEvent.keyDown(inputDataFinalFin, { key: 'Enter' });

    fireEvent.click(screen.getByTestId('mobile-filter-panel-apply-btn'));

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('SituacaoInscricao=6'),
        expect.any(Object),
      );
    });
  });

  it('deve lidar com resposta de listagem nula e cancelamento com sucesso false', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: null,
    });

    render(<MinhasInscricoesMobile />);

    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });

    // Testar resposta sem sucesso ao cancelar
    (cancelarInscricao as jest.Mock).mockResolvedValueOnce({
      sucesso: false,
    });

    (api.get as jest.Mock).mockResolvedValueOnce({
      data: {
        items: [mockInscricoes[0]],
        totalRegistros: 1,
        sucesso: true,
      },
    });

    fireEvent.change(screen.getByTestId('input-busca-rapida'), {
      target: { value: 'Gamificação' },
    });

    await waitFor(() => {
      expect(screen.getByTestId('btn-cancelar-1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('btn-cancelar-1'));
    expect(confirmacao).toHaveBeenCalled();

    const lastCall = (confirmacao as jest.Mock).mock.calls[
      (confirmacao as jest.Mock).mock.calls.length - 1
    ][0];
    await act(async () => {
      await lastCall.onOk();
    });
  });

  it('deve renderizar breadcrumb na versão mobile', async () => {
    render(<MinhasInscricoesMobile />);

    expect(screen.getByTestId('mobile-breadcrumb-wrapper')).toBeInTheDocument();
  });

  it('deve renderizar o botão Voltar ao Topo quando o painel de filtros estiver fechado e ocultá-lo quando aberto', async () => {
    render(<MinhasInscricoesMobile />);

    await waitFor(() => {
      expect(screen.getByTestId('btn-voltar-ao-topo')).toBeInTheDocument();
    });

    // Abrir o painel de filtros
    fireEvent.click(screen.getByTestId('btn-abrir-filtros'));
    await waitFor(() => {
      expect(screen.getByTestId('mobile-filter-panel')).toBeInTheDocument();
    });

    // Botão voltar ao topo não deve ficar visível com o painel aberto
    expect(screen.queryByTestId('btn-voltar-ao-topo')).not.toBeInTheDocument();

    // Fechar o painel
    fireEvent.click(screen.getByTestId('mobile-filter-panel-close-btn'));
    await waitFor(() => {
      expect(screen.getByTestId('btn-voltar-ao-topo')).toBeInTheDocument();
    });
  });

  it('deve renderizar badges de situação da inscrição e de aprovação na aba finalizadas e permitir filtrar por situação de aprovação', async () => {
    const finalizadasItens: InscricaoProps[] = [
      {
        ...mockInscricoes[0],
        id: 10,
        situacao: 'Concluída',
        situacaoAprovacao: 1, // Aprovado
      },
      {
        ...mockInscricoes[1],
        id: 11,
        situacao: 'Concluída',
        situacaoAprovacao: 2, // Reprovado
      },
      {
        ...mockInscricoes[1],
        id: 12,
        situacao: 'Cancelada',
        situacaoAprovacao: 3, // Não inscrito
      },
    ];

    (api.get as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('finalizadas')) {
        return Promise.resolve({
          data: {
            items: finalizadasItens,
            totalRegistros: 3,
            sucesso: true,
          },
        });
      }
      return Promise.resolve({
        data: {
          items: mockInscricoes,
          totalRegistros: 2,
          sucesso: true,
        },
      });
    });

    render(<MinhasInscricoesMobile />);

    await waitFor(() => {
      expect(screen.getByTestId('cards-list')).toBeInTheDocument();
    });

    // Troca para finalizadas
    fireEvent.click(screen.getByTestId('tab-finalizadas'));

    await waitFor(() => {
      expect(screen.getByTestId('status-badge-10')).toBeInTheDocument();
      expect(screen.getByTestId('status-aprovacao-badge-10')).toHaveTextContent('Aprovado');
      expect(screen.getByTestId('status-aprovacao-badge-11')).toHaveTextContent('Reprovado');
      expect(screen.getByTestId('status-aprovacao-badge-12')).toHaveTextContent('Não inscrito');
    });

    fireEvent.click(screen.getByTestId('btn-abrir-filtros'));
    await waitFor(() => {
      expect(screen.getByTestId('mobile-filter-panel')).toBeInTheDocument();
    });

    const selects = screen.getAllByRole('combobox');
    // Situação de aprovação é o segundo select no painel de finalizadas
    fireEvent.mouseDown(selects[1]);
    const optionAprovado = screen.getByTitle('Aprovado');
    fireEvent.click(optionAprovado);

    fireEvent.click(screen.getByTestId('mobile-filter-panel-apply-btn'));

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('SituacaoAprovacao=1'),
        expect.any(Object),
      );
      // Filtragem client-side deve manter apenas o aprovado
      expect(screen.getByTestId('status-aprovacao-badge-10')).toBeInTheDocument();
      expect(screen.queryByTestId('status-aprovacao-badge-11')).not.toBeInTheDocument();
      expect(screen.queryByTestId('status-aprovacao-badge-12')).not.toBeInTheDocument();
    });

    // Limpar filtros clicando no botão Limpar filtros
    fireEvent.click(screen.getByTestId('btn-abrir-filtros'));
    await waitFor(() => {
      expect(screen.getByTestId('btn-abrir-filtros')).toHaveTextContent('Filtros');
    });

    // Reabrir e filtrar por Reprovado (2)
    fireEvent.click(screen.getByTestId('btn-abrir-filtros'));
    await waitFor(() => {
      expect(screen.getByTestId('mobile-filter-panel')).toBeInTheDocument();
    });

    const selects2 = screen.getAllByRole('combobox');
    fireEvent.mouseDown(selects2[1]);
    const optionReprovado = screen.getByTitle('Reprovado');
    fireEvent.click(optionReprovado);
    fireEvent.click(screen.getByTestId('mobile-filter-panel-apply-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('status-aprovacao-badge-11')).toBeInTheDocument();
      expect(screen.queryByTestId('status-aprovacao-badge-10')).not.toBeInTheDocument();
    });

    // Limpar filtros e filtrar por Não inscrito (3)
    fireEvent.click(screen.getByTestId('btn-abrir-filtros'));
    await waitFor(() => {
      expect(screen.getByTestId('btn-abrir-filtros')).toHaveTextContent('Filtros');
    });

    fireEvent.click(screen.getByTestId('btn-abrir-filtros'));
    await waitFor(() => {
      expect(screen.getByTestId('mobile-filter-panel')).toBeInTheDocument();
    });

    const selects3 = screen.getAllByRole('combobox');
    fireEvent.mouseDown(selects3[1]);
    const optionNaoInscrito = screen.getByTitle('Não inscrito');
    fireEvent.click(optionNaoInscrito);
    fireEvent.click(screen.getByTestId('mobile-filter-panel-apply-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('status-aprovacao-badge-12')).toBeInTheDocument();
      expect(screen.queryByTestId('status-aprovacao-badge-10')).not.toBeInTheDocument();
    });
  });

  it('deve alternar entre os estados Filtros e Limpar filtros no botão e controlar o painel e limpeza', async () => {
    render(<MinhasInscricoesMobile />);

    // 1. Sem filtros: label "Filtros", badge ausente, clique abre painel
    const btnFiltros = screen.getByTestId('btn-abrir-filtros');
    expect(btnFiltros).toHaveTextContent('Filtros');
    expect(screen.queryByTestId('badge-filtros')).not.toBeInTheDocument();

    fireEvent.click(btnFiltros);
    await waitFor(() => {
      expect(screen.getByTestId('mobile-filter-panel')).toBeInTheDocument();
    });

    // Preenche campo de busca e 2 filtros avançados
    fireEvent.change(screen.getByTestId('input-busca-rapida'), {
      target: { value: 'Robótica' },
    });
    fireEvent.change(screen.getByTestId('filtro-codigo-formacao'), {
      target: { value: '102' },
    });
    fireEvent.change(screen.getByTestId('filtro-turma'), {
      target: { value: 'Turma R1' },
    });

    fireEvent.click(screen.getByTestId('mobile-filter-panel-apply-btn'));

    // 2. Com filtros aplicados: label "Limpar filtros", badge presente com valor "02"
    await waitFor(() => {
      expect(screen.getByTestId('badge-filtros')).toHaveTextContent('02');
      expect(screen.getByTestId('btn-abrir-filtros')).toHaveTextContent('Limpar filtros');
    });

    // Clique NÃO abre o painel e limpa os filtros avançados, preservando busca rápida
    fireEvent.click(screen.getByTestId('btn-abrir-filtros'));

    await waitFor(() => {
      expect(screen.queryByTestId('mobile-filter-panel')).not.toBeInTheDocument();
      expect(screen.queryByTestId('badge-filtros')).not.toBeInTheDocument();
      // 3. Label volta para "Filtros"
      expect(screen.getByTestId('btn-abrir-filtros')).toHaveTextContent('Filtros');
      // Busca rápida foi preservada
      expect(screen.getByTestId('input-busca-rapida')).toHaveValue('Robótica');
    });

    // Botão volta a abrir painel
    fireEvent.click(screen.getByTestId('btn-abrir-filtros'));
    await waitFor(() => {
      expect(screen.getByTestId('mobile-filter-panel')).toBeInTheDocument();
    });
  });

  it('deve renderizar a busca em linha própria e o botão de filtros abaixo da busca no layout mobile', () => {
    render(<MinhasInscricoesMobile />);

    const searchFilterSection = screen.getByTestId('search-filter-section');
    expect(searchFilterSection).toBeInTheDocument();

    const inputBusca = screen.getByTestId('input-busca-rapida');
    const btnFiltros = screen.getByTestId('btn-abrir-filtros');

    expect(searchFilterSection).toContainElement(inputBusca);
    expect(searchFilterSection).toContainElement(btnFiltros);
  });
});
