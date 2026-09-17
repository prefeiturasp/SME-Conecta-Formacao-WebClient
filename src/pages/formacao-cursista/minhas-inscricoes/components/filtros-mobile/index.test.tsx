/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import dayjs from 'dayjs';

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

import MinhasInscricoesFiltrosMobile, { contarFiltrosAplicados, situacoesOptions } from './index';

describe('MinhasInscricoesFiltrosMobile', () => {
  const defaultProps = {
    open: true,
    abaAtiva: 'andamento' as const,
    filtros: {},
    onClose: jest.fn(),
    onApply: jest.fn(),
    onClear: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar os campos da aba andamento', () => {
    render(<MinhasInscricoesFiltrosMobile {...defaultProps} />);

    expect(screen.getByTestId('filtro-codigo-formacao')).toBeInTheDocument();
    expect(screen.getByTestId('filtro-nome-formacao')).toBeInTheDocument();
    expect(screen.getByTestId('filtro-data-inscricao')).toBeInTheDocument();
    expect(screen.getByTestId('filtro-turma')).toBeInTheDocument();
    expect(screen.getByTestId('filtro-data-inicial')).toBeInTheDocument();
    expect(screen.getByTestId('filtro-data-final')).toBeInTheDocument();
    expect(screen.getByTestId('filtro-situacao')).toBeInTheDocument();
  });

  it('deve renderizar os campos da aba finalizadas', () => {
    render(<MinhasInscricoesFiltrosMobile {...defaultProps} abaAtiva='finalizadas' />);

    expect(screen.getByTestId('filtro-nome-formacao-finalizadas')).toBeInTheDocument();
    expect(screen.getByTestId('filtro-situacao-finalizadas')).toBeInTheDocument();
    expect(screen.getByTestId('filtro-data-inicial-finalizadas')).toBeInTheDocument();
    expect(screen.getByTestId('filtro-data-final-finalizadas')).toBeInTheDocument();
    expect(screen.queryByTestId('filtro-codigo-formacao')).not.toBeInTheDocument();
  });

  it('deve permitir alterar campos e aplicar filtros na aba andamento', () => {
    render(<MinhasInscricoesFiltrosMobile {...defaultProps} />);

    const inputCodigo = screen.getByTestId('filtro-codigo-formacao');
    fireEvent.change(inputCodigo, { target: { value: '12345' } });

    const inputNome = screen.getByTestId('filtro-nome-formacao');
    fireEvent.change(inputNome, { target: { value: 'Curso React' } });

    const inputTurma = screen.getByTestId('filtro-turma');
    fireEvent.change(inputTurma, { target: { value: 'Turma A' } });

    const inputDataInscricao = screen.getByPlaceholderText('00/00/0000');
    fireEvent.change(inputDataInscricao, { target: { value: '10/05/2026' } });
    fireEvent.keyDown(inputDataInscricao, { key: 'Enter' });

    const inputDataInicial = screen.getByPlaceholderText('Data inicial');
    fireEvent.change(inputDataInicial, { target: { value: '01/06/2026' } });
    fireEvent.keyDown(inputDataInicial, { key: 'Enter' });

    const inputDataFinal = screen.getByPlaceholderText('Data final');
    fireEvent.change(inputDataFinal, { target: { value: '30/06/2026' } });
    fireEvent.keyDown(inputDataFinal, { key: 'Enter' });

    const btnBuscar = screen.getByTestId('mobile-filter-panel-apply-btn');
    fireEvent.click(btnBuscar);

    expect(defaultProps.onApply).toHaveBeenCalledWith(
      expect.objectContaining({
        CodigoFormacao: '12345',
        NomeFormacao: 'Curso React',
        NomeTurma: 'Turma A',
      }),
    );
  });

  it('deve permitir alterar campos e aplicar filtros na aba finalizadas', () => {
    render(<MinhasInscricoesFiltrosMobile {...defaultProps} abaAtiva='finalizadas' />);

    const inputNome = screen.getByTestId('filtro-nome-formacao-finalizadas');
    fireEvent.change(inputNome, { target: { value: 'Curso Angular' } });

    const inputDataInicial = screen.getByPlaceholderText('Data inicial');
    fireEvent.change(inputDataInicial, { target: { value: '01/01/2026' } });
    fireEvent.keyDown(inputDataInicial, { key: 'Enter' });

    const inputDataFinal = screen.getByPlaceholderText('Data final');
    fireEvent.change(inputDataFinal, { target: { value: '31/01/2026' } });
    fireEvent.keyDown(inputDataFinal, { key: 'Enter' });

    const btnBuscar = screen.getByTestId('mobile-filter-panel-apply-btn');
    fireEvent.click(btnBuscar);

    expect(defaultProps.onApply).toHaveBeenCalledWith(
      expect.objectContaining({
        NomeFormacao: 'Curso Angular',
      }),
    );
  });

  it('deve chamar onClear e resetar ao clicar em limpar filtros', () => {
    render(<MinhasInscricoesFiltrosMobile {...defaultProps} filtros={{ CodigoFormacao: '999' }} />);

    const btnLimpar = screen.getByTestId('mobile-filter-panel-clear-btn');
    fireEvent.click(btnLimpar);

    expect(defaultProps.onClear).toHaveBeenCalledTimes(1);
  });

  it('deve selecionar uma opção no select de situação', () => {
    render(<MinhasInscricoesFiltrosMobile {...defaultProps} />);

    const combobox = screen.getByRole('combobox');
    fireEvent.mouseDown(combobox);
    const option = screen.getByTitle('Confirmada');
    fireEvent.click(option);

    const btnBuscar = screen.getByTestId('mobile-filter-panel-apply-btn');
    fireEvent.click(btnBuscar);

    expect(defaultProps.onApply).toHaveBeenCalledWith(
      expect.objectContaining({
        Situacao: 1,
      }),
    );
  });

  it('deve selecionar uma opção no select de situação da aba finalizadas', () => {
    render(<MinhasInscricoesFiltrosMobile {...defaultProps} abaAtiva='finalizadas' />);

    const combobox = screen.getByRole('combobox');
    fireEvent.mouseDown(combobox);
    const option = screen.getByTitle('Transferida');
    fireEvent.click(option);

    const btnBuscar = screen.getByTestId('mobile-filter-panel-apply-btn');
    fireEvent.click(btnBuscar);

    expect(defaultProps.onApply).toHaveBeenCalledWith(
      expect.objectContaining({
        SituacaoInscricao: 6,
      }),
    );
  });

  it('deve sincronizar draftFiltros quando a prop filtros mudar', () => {
    const { rerender } = render(
      <MinhasInscricoesFiltrosMobile {...defaultProps} filtros={{ CodigoFormacao: '100' }} />,
    );

    const inputCodigo = screen.getByTestId('filtro-codigo-formacao') as HTMLInputElement;
    expect(inputCodigo.value).toBe('100');

    rerender(
      <MinhasInscricoesFiltrosMobile {...defaultProps} filtros={{ CodigoFormacao: '200' }} />,
    );

    const inputAtualizado = screen.getByTestId('filtro-codigo-formacao') as HTMLInputElement;
    expect(inputAtualizado.value).toBe('200');
  });

  describe('contarFiltrosAplicados', () => {
    it('deve retornar 0 quando não houver filtros aplicados', () => {
      expect(contarFiltrosAplicados({}, 'andamento')).toBe(0);
      expect(contarFiltrosAplicados({}, 'finalizadas')).toBe(0);
    });

    it('deve contar filtros na aba andamento corretamente', () => {
      expect(contarFiltrosAplicados({ CodigoFormacao: 123 }, 'andamento')).toBe(1);

      expect(contarFiltrosAplicados({ NomeFormacao: 'Formação Teste' }, 'andamento')).toBe(1);

      expect(contarFiltrosAplicados({ NomeFormacao: '   ' }, 'andamento')).toBe(0);

      expect(contarFiltrosAplicados({ DataInscricao: dayjs() }, 'andamento')).toBe(1);

      expect(contarFiltrosAplicados({ NomeTurma: 'Turma 1' }, 'andamento')).toBe(1);

      expect(contarFiltrosAplicados({ NomeTurma: '   ' }, 'andamento')).toBe(0);

      // Período conta como 1 seja apenas data inicial, apenas final ou ambas
      expect(contarFiltrosAplicados({ DataInicial: dayjs() }, 'andamento')).toBe(1);

      expect(contarFiltrosAplicados({ DataFinal: dayjs() }, 'andamento')).toBe(1);

      expect(
        contarFiltrosAplicados({ DataInicial: dayjs(), DataFinal: dayjs() }, 'andamento'),
      ).toBe(1);

      expect(contarFiltrosAplicados({ Situacao: 1 }, 'andamento')).toBe(1);

      // Todos combinados = 6
      expect(
        contarFiltrosAplicados(
          {
            CodigoFormacao: 123,
            NomeFormacao: 'Teste',
            DataInscricao: dayjs(),
            NomeTurma: 'T1',
            DataInicial: dayjs(),
            DataFinal: dayjs(),
            Situacao: 2,
          },
          'andamento',
        ),
      ).toBe(6);
    });

    it('deve contar filtros na aba finalizadas corretamente', () => {
      expect(contarFiltrosAplicados({ NomeFormacao: 'Concluído' }, 'finalizadas')).toBe(1);

      expect(contarFiltrosAplicados({ SituacaoInscricao: 3 }, 'finalizadas')).toBe(1);

      expect(contarFiltrosAplicados({ DataInicial: dayjs() }, 'finalizadas')).toBe(1);

      expect(
        contarFiltrosAplicados(
          {
            NomeFormacao: 'Concluído',
            SituacaoInscricao: 1,
            DataInicial: dayjs(),
            DataFinal: dayjs(),
          },
          'finalizadas',
        ),
      ).toBe(3);
    });
  });

  it('deve ter as 6 opções de situação com os valores corretos', () => {
    expect(situacoesOptions).toHaveLength(6);
    expect(situacoesOptions.map((o) => o.label)).toEqual([
      'Confirmada',
      'Enviada',
      'Aguardando a análise',
      'Cancelada',
      'Em espera',
      'Transferida',
    ]);
  });
});
