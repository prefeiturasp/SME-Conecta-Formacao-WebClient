/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { obterFormacaoPaginada } from '~/core/services/area-publica-service';
import { ListaFormacoesMobile } from './index';

beforeAll(() => {
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
});

jest.mock('~/core/services/area-publica-service', () => ({
  obterFormacaoPaginada: jest.fn(),
}));

const mockObterFormacaoPaginada = obterFormacaoPaginada as jest.MockedFunction<
  typeof obterFormacaoPaginada
>;

const mockFormacoes = (quantidade: number, inicioId = 1) =>
  Array.from({ length: quantidade }, (_, i) => ({
    id: inicioId + i,
    titulo: `Formação ${inicioId + i}`,
    periodo: '10/06/2025 até 31/07/2025',
    periodoInscricao: '10/06/2025 até 31/07/2025',
    areaPromotora: 'Multimeios',
    tipoFormacaoDescricao: 'Curso',
    formatoDescricao: 'Presencial',
    cursoComCertificado: true,
  }));

const renderComRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('ListaFormacoesMobile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve carregar 10 itens na primeira página e exibir contador e botão habilitado', async () => {
    mockObterFormacaoPaginada.mockResolvedValueOnce({
      sucesso: true,
      dados: {
        items: mockFormacoes(10),
        totalRegistros: 52,
      },
    } as any);

    renderComRouter(<ListaFormacoesMobile filtroFormacao={{}} />);

    await waitFor(() => {
      expect(mockObterFormacaoPaginada).toHaveBeenCalledWith({}, 1, 10);
    });

    await waitFor(() => {
      expect(screen.getByTestId('contador-inscricoes')).toHaveTextContent(
        'Exibindo 10 de 52 inscrições',
      );
    });

    const botaoExibirMais = screen.getByTestId('btn-exibir-mais');
    expect(botaoExibirMais).toBeInTheDocument();
    expect(botaoExibirMais).not.toBeDisabled();
  });

  test('deve exibir botão desabilitado quando todos os itens já foram carregados (ex: 01 de 01)', async () => {
    mockObterFormacaoPaginada.mockResolvedValueOnce({
      sucesso: true,
      dados: {
        items: mockFormacoes(1),
        totalRegistros: 1,
      },
    } as any);

    renderComRouter(<ListaFormacoesMobile filtroFormacao={{}} />);

    await waitFor(() => {
      expect(screen.getByTestId('contador-inscricoes')).toHaveTextContent(
        'Exibindo 01 de 01 inscrições',
      );
    });

    const botaoExibirMais = screen.getByTestId('btn-exibir-mais');
    expect(botaoExibirMais).toBeDisabled();
  });

  test('deve buscar próxima página de 10 e concatenar ao clicar em Exibir mais', async () => {
    mockObterFormacaoPaginada
      .mockResolvedValueOnce({
        sucesso: true,
        dados: {
          items: mockFormacoes(10, 1),
          totalRegistros: 25,
        },
      } as any)
      .mockResolvedValueOnce({
        sucesso: true,
        dados: {
          items: mockFormacoes(10, 11),
          totalRegistros: 25,
        },
      } as any);

    renderComRouter(<ListaFormacoesMobile filtroFormacao={{}} />);

    await waitFor(() => {
      expect(screen.getByTestId('contador-inscricoes')).toHaveTextContent(
        'Exibindo 10 de 25 inscrições',
      );
    });

    const botaoExibirMais = screen.getByTestId('btn-exibir-mais');
    fireEvent.click(botaoExibirMais);

    await waitFor(() => {
      expect(mockObterFormacaoPaginada).toHaveBeenCalledWith({}, 2, 10);
    });

    await waitFor(() => {
      expect(screen.getByTestId('contador-inscricoes')).toHaveTextContent(
        'Exibindo 20 de 25 inscrições',
      );
    });
  });

  test('deve exibir card de estado vazio quando não houver formações', async () => {
    mockObterFormacaoPaginada.mockResolvedValueOnce({
      sucesso: true,
      dados: {
        items: [],
        totalRegistros: 0,
      },
    } as any);

    renderComRouter(<ListaFormacoesMobile filtroFormacao={{}} />);

    await waitFor(() => {
      expect(
        screen.getByText('Não encontramos dados para essa busca!'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Experimente buscar com um novo nome.'),
      ).toBeInTheDocument();
    });
  });
});
