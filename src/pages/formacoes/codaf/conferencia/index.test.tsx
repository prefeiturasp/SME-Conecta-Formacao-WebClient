/** @jest-environment jsdom */
import '@testing-library/jest-dom';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import dayjs from 'dayjs';
import React from 'react';
import { notification } from '~/components/lib/notification';
import { StatusCodafConferencia } from '~/core/enum/status-codaf-conferencia';
import {
  CodafConferenciaDTO,
  excluirCodafConferencia,
  obterDetalhesPropostaConferenciaComTurmasPorId,
  obterListaCodafConferencia,
} from '~/core/services/codaf-conferencia-service';
import { obterPermissaoPorMenu } from '~/core/utils/perfil';
import CodafConferencia, {
  obterEstadoBotaoCertificado,
  obterSituacaoTexto,
} from './index';

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

jest.mock('antd', () => {
  const actual = jest.requireActual('antd');

  const Select = ({ options = [], disabled, placeholder }: any) => (
    <select data-testid={`select-${placeholder}`} disabled={disabled}>
      {(options || []).map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );

  const DatePicker = ({ placeholder }: any) => (
    <input data-testid='datepicker-criacao' placeholder={placeholder} />
  );

  const Dropdown = ({ menu, dropdownRender, children }: any) => {
    const renderedMenu = (
      <div data-testid='dropdown-menu-mock'>
        {(menu?.items || []).map((item: any) => (
          <button
            key={item.key}
            type='button'
            data-menu-item={item.key}
            disabled={item.disabled}
            onClick={() => item.onClick?.({ domEvent: { stopPropagation: jest.fn() } })}
          >
            {item.label}
          </button>
        ))}
      </div>
    );

    return (
      <div>
        <div data-testid='dropdown-trigger-mock'>{children}</div>
        {dropdownRender ? dropdownRender(renderedMenu) : renderedMenu}
      </div>
    );
  };

  const Table = ({ columns = [], dataSource = [], onChange, onRow, pagination }: any) => (
    <div data-testid='table-codaf'>
      <div>
        {(columns || []).map((col: any) => (
          <span key={col.key}>{col.title}</span>
        ))}
      </div>
      {(dataSource || []).map((record: any, rowIndex: number) => {
        const rowProps = onRow ? onRow(record) : {};
        return (
          <div
            key={record.id ?? rowIndex}
            data-testid={`row-${record.id ?? rowIndex}`}
            onClick={rowProps.onClick}
          >
            {(columns || []).map((col: any) => (
              <div key={col.key}>
                {col.render ? col.render(record[col.dataIndex], record, rowIndex) : record[col.dataIndex]}
              </div>
            ))}
          </div>
        );
      })}
      <button
        type='button'
        data-testid='btn-page-2'
        onClick={() => onChange?.({ current: 2, pageSize: pagination?.pageSize })}
      >
        Page 2
      </button>
      <button
        type='button'
        data-testid='btn-page-undefined'
        onClick={() => onChange?.({ current: undefined, pageSize: pagination?.pageSize })}
      >
        Page Undefined
      </button>
      <button
        type='button'
        data-testid='btn-pagesize-20'
        onClick={() => onChange?.({ current: 1, pageSize: 20 })}
      >
        PageSize 20
      </button>
    </div>
  );

  return {
    ...actual,
    Select,
    DatePicker,
    Dropdown,
    Table,
  };
});

const mockNavigate = jest.fn();
let mockLocationState: any = null;

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/formacoes/codaf-conferencia', state: mockLocationState }),
}));

jest.mock('~/components/lib/notification', () => ({
  notification: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  },
}));

jest.mock('~/core/utils/perfil', () => ({
  obterPermissaoPorMenu: jest.fn(),
}));

jest.mock('~/components/main/input/area-promotora', () => () => (
  <div data-testid='select-area-promotora' />
));

jest.mock(
  '../lista-presenca-codaf/cadastro/componentes/modal-excluir/modal-excluir',
  () => (props: any) => (
    <div data-testid='modal-excluir-mock' data-visible={String(props.visible)}>
      <button type='button' data-testid='btn-confirmar-exclusao-mock' onClick={props.onConfirm}>
        Confirmar exclusao
      </button>
      <button type='button' data-testid='btn-cancelar-exclusao-mock' onClick={props.onCancel}>
        Cancelar exclusao
      </button>
    </div>
  ),
);

jest.mock('~/core/services/codaf-conferencia-service', () => ({
  obterListaCodafConferencia: jest.fn(),
  obterDetalhesPropostaConferenciaComTurmasPorId: jest.fn(),
  excluirCodafConferencia: jest.fn(),
}));

const registroIniciado: CodafConferenciaDTO = {
  id: 1,
  numeroHomologacao: 20261,
  nomeFormacao: 'Conferência Municipal de Educação',
  codigoFormacao: 446,
  nomeTurma: 'Turma A',
  nomeAreaPromotora: 'COPED',
  status: StatusCodafConferencia.INICIADO,
  statusCertificacaoTurma: 1,
  codigoCursoEol: null,
  codigoNivel: null,
  possuiAprovacoes: false,
  criadoEm: '2026-11-18T10:00:00Z',
};

const registroAguardando: CodafConferenciaDTO = {
  id: 2,
  numeroHomologacao: 20262,
  nomeFormacao: 'II Conferência Temática',
  codigoFormacao: 447,
  nomeTurma: 'Turma B',
  nomeAreaPromotora: 'DRE Ipiranga',
  status: StatusCodafConferencia.AGUARDANDO_FINALIZACAO,
  statusCertificacaoTurma: 2,
  codigoCursoEol: 999,
  codigoNivel: 1,
  possuiAprovacoes: true,
  criadoEm: '2026-11-18T11:00:00Z',
};

describe('CodafConferencia - Helpers', () => {
  test('obterSituacaoTexto deve mapear situações conhecidas e fallback', () => {
    expect(obterSituacaoTexto(StatusCodafConferencia.INICIADO)).toBe('Iniciado');
    expect(obterSituacaoTexto(StatusCodafConferencia.AGUARDANDO_FINALIZACAO)).toBe(
      'Aguardando Finalização',
    );
    expect(obterSituacaoTexto(StatusCodafConferencia.FINALIZADO)).toBe('Finalizado');
    expect(obterSituacaoTexto(999)).toBe('Desconhecido');
  });

  test('obterEstadoBotaoCertificado deve retornar o estado esperado para cada cenário', () => {
    expect(obterEstadoBotaoCertificado({ ...registroIniciado, possuiAprovacoes: false })).toEqual({
      label: 'Sem aprovações',
      disabled: true,
    });
    expect(
      obterEstadoBotaoCertificado({
        ...registroAguardando,
        possuiAprovacoes: true,
        statusCertificacaoTurma: 0,
      }),
    ).toEqual({ label: 'Sem certificado', disabled: true });
    expect(
      obterEstadoBotaoCertificado({
        ...registroAguardando,
        possuiAprovacoes: true,
        statusCertificacaoTurma: 1,
      }),
    ).toEqual({ label: 'Não emitidos', disabled: true });
    expect(
      obterEstadoBotaoCertificado({
        ...registroAguardando,
        possuiAprovacoes: true,
        statusCertificacaoTurma: 2,
      }),
    ).toEqual({ label: 'Emitir certificados', disabled: false });
    expect(
      obterEstadoBotaoCertificado({
        ...registroAguardando,
        possuiAprovacoes: true,
        statusCertificacaoTurma: 3,
      }),
    ).toEqual({ label: 'Emitindo certificado', disabled: true });
    expect(
      obterEstadoBotaoCertificado({
        ...registroAguardando,
        possuiAprovacoes: true,
        statusCertificacaoTurma: 4,
      }),
    ).toEqual({ label: 'Certificados emitidos', disabled: true });
    expect(
      obterEstadoBotaoCertificado({
        ...registroAguardando,
        possuiAprovacoes: true,
        statusCertificacaoTurma: undefined,
      }),
    ).toEqual({ label: '—', disabled: true });
  });
});

describe('CodafConferencia - Componente', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocationState = null;
    (obterPermissaoPorMenu as jest.Mock).mockReturnValue({
      podeConsultar: true,
      podeIncluir: true,
      podeAlterar: true,
      podeExcluir: true,
    });
    (obterListaCodafConferencia as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: {
        items: [registroIniciado, registroAguardando],
        totalRegistros: 2,
        totalPaginas: 1,
      },
    });
    (obterDetalhesPropostaConferenciaComTurmasPorId as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: {
        id: 446,
        nomeFormacao: 'Conferência Municipal',
        numeroFormacao: 20261,
        turmas: [
          { id: 10, nome: 'Turma Manhã', descricao: 'Turma Manhã 10/10' },
          { id: 11, nome: '', descricao: 'Turma Tarde' },
        ],
      },
    });
    (excluirCodafConferencia as jest.Mock).mockResolvedValue({ status: 204, sucesso: true });
  });

  test('deve renderizar a listagem, carregar dados iniciais e interagir com modal de confirmação de inscritos', async () => {
    const { container } = render(<CodafConferencia />);

    await waitFor(() => {
      expect(obterListaCodafConferencia).toHaveBeenCalledWith({
        NomeFormacao: undefined,
        CodigoFormacao: undefined,
        NumeroHomologacao: undefined,
        PropostaTurmaId: undefined,
        AreaPromotoraId: undefined,
        Status: undefined,
        DataCriacao: undefined,
        NumeroPagina: 1,
        NumeroRegistros: 10,
      });
    });

    expect(screen.getAllByText('CODAF Formações de Conferência').length).toBeGreaterThan(0);
    expect(screen.getByText('Conferência Municipal de Educação')).toBeInTheDocument();
    expect(screen.getByText('II Conferência Temática')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Novo registro' }));
    expect(
      screen.getByText(/Antes de iniciar o registro CODAF, verifique se todos os cursistas/i),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Ir para tela de inscrições' }));
    expect(mockNavigate).toHaveBeenCalledWith('/formacoes/inscricoes');

    fireEvent.click(screen.getByRole('button', { name: 'Novo registro' }));
    fireEvent.click(screen.getByRole('button', { name: 'Continuar registros' }));
    expect(mockNavigate).toHaveBeenCalledWith('/formacoes/codaf-conferencia/novo', {
      state: expect.objectContaining({
        paginaCorrente: 1,
        registrosPorPagina: 10,
        filtroUtilizado: false,
      }),
    });

    fireEvent.click(screen.getByRole('button', { name: 'Novo registro' }));
    fireEvent.click(screen.getByLabelText('Close'));

    // Também cobre retorno bem-sucedido via status 204 ao confirmar exclusão a partir da listagem
    const excluirButtons = container.querySelectorAll('button[data-menu-item="excluir"]');
    expect(excluirButtons).toHaveLength(1);
    fireEvent.click(excluirButtons[0]);
    await act(async () => {
      fireEvent.click(screen.getByTestId('btn-confirmar-exclusao-mock'));
    });
    expect(excluirCodafConferencia).toHaveBeenCalledWith(1);
    expect(notification.success).toHaveBeenCalledWith({
      message: 'Sucesso',
      description: 'Registro excluído com sucesso!',
    });
  });

  test('deve carregar turmas vinculadas ao informar Código da formação, filtrar e limpar filtros', async () => {
    render(<CodafConferencia />);

    await waitFor(() => expect(obterListaCodafConferencia).toHaveBeenCalledTimes(1));

    const inputNome = document.getElementById('CF_INPUT_NOME_FORMACAO') as HTMLInputElement;
    const inputCodigo = document.getElementById('CF_INPUT_CODIGO_FORMACAO') as HTMLInputElement;
    const inputHomologacao = document.getElementById(
      'CF_INPUT_NUMERO_HOMOLOGACAO',
    ) as HTMLInputElement;

    fireEvent.change(inputNome, { target: { value: 'Conferência' } });
    fireEvent.change(inputHomologacao, { target: { value: '20261' } });
    fireEvent.change(inputCodigo, { target: { value: '446' } });
    await act(async () => {
      fireEvent.blur(inputCodigo);
    });

    await waitFor(() => {
      expect(obterDetalhesPropostaConferenciaComTurmasPorId).toHaveBeenCalledWith(446);
    });

    const selectTurma = screen.getByTestId('select-Selecione a turma');
    expect(selectTurma).not.toBeDisabled();
    expect(screen.getByText('Turma Manhã')).toBeInTheDocument();
    expect(screen.getByText('Turma Tarde')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Filtrar' }));
    await waitFor(() => {
      expect(obterListaCodafConferencia).toHaveBeenLastCalledWith(
        expect.objectContaining({
          NomeFormacao: 'Conferência',
          CodigoFormacao: 446,
          NumeroHomologacao: 20261,
          NumeroPagina: 1,
          NumeroRegistros: 10,
        }),
      );
    });

    fireEvent.change(inputCodigo, { target: { value: '' } });
    await act(async () => {
      fireEvent.blur(inputCodigo);
    });
    expect(selectTurma).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'Limpar' }));
    await waitFor(() => {
      expect(obterListaCodafConferencia).toHaveBeenCalledTimes(3);
    });
  });

  test('deve restaurar estado da navegação e lidar com proposta sem turmas ou falha de API', async () => {
    mockLocationState = {
      formValues: {
        codigoFormacao: '999',
        dataCriacao: dayjs('2026-11-18'),
        situacao: StatusCodafConferencia.INICIADO,
      },
      paginaCorrente: 2,
      registrosPorPagina: 20,
      filtroUtilizado: true,
    };
    (obterPermissaoPorMenu as jest.Mock).mockReturnValue(undefined);
    (obterDetalhesPropostaConferenciaComTurmasPorId as jest.Mock).mockResolvedValueOnce({
      sucesso: true,
      dados: null,
    });
    (obterListaCodafConferencia as jest.Mock).mockResolvedValueOnce({
      sucesso: true,
      dados: { items: undefined, totalRegistros: 0 },
    });

    render(<CodafConferencia />);

    await waitFor(() => {
      expect(obterDetalhesPropostaConferenciaComTurmasPorId).toHaveBeenCalledWith(999);
      expect(obterListaCodafConferencia).toHaveBeenCalledWith(
        expect.objectContaining({
          CodigoFormacao: 999,
          DataCriacao: '2026-11-18',
          Status: StatusCodafConferencia.INICIADO,
          NumeroPagina: 2,
          NumeroRegistros: 20,
        }),
      );
    });

    const inputCodigo = document.getElementById('CF_INPUT_CODIGO_FORMACAO') as HTMLInputElement;
    (obterDetalhesPropostaConferenciaComTurmasPorId as jest.Mock).mockRejectedValueOnce(
      new Error('Falha'),
    );
    fireEvent.change(inputCodigo, { target: { value: '500' } });
    await act(async () => {
      fireEvent.blur(inputCodigo);
    });

    expect(notification.error).toHaveBeenCalledWith({
      message: 'Erro',
      description: 'Erro ao obter turmas da formação',
    });
  });

  test('deve restaurar location.state parcial sem campos preenchidos e tratar erro ao listar', async () => {
    mockLocationState = {};
    (obterListaCodafConferencia as jest.Mock)
      .mockResolvedValueOnce({ sucesso: false, dados: null })
      .mockRejectedValueOnce(new Error('Network error'));

    render(<CodafConferencia />);

    await waitFor(() => {
      expect(notification.error).toHaveBeenCalledWith({
        message: 'Erro',
        description: 'Erro ao buscar dados da lista de CODAF Conferência',
      });
    });

    fireEvent.click(screen.getByRole('button', { name: 'Filtrar' }));
    await waitFor(() => {
      expect(notification.error).toHaveBeenCalledTimes(2);
    });
  });

  test('deve navegar ao clicar na linha, interagir com botões/ações, paginar e excluir registro', async () => {
    (obterListaCodafConferencia as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: {
        items: [registroIniciado, registroAguardando],
        totalRegistros: 25,
        totalPaginas: 3,
      },
    });

    const { container } = render(<CodafConferencia />);
    await waitFor(() => expect(screen.getByTestId('row-1')).toBeInTheDocument());

    fireEvent.click(screen.getByTestId('row-1'));
    expect(mockNavigate).toHaveBeenCalledWith('/formacoes/codaf-conferencia/editar/1', {
      state: expect.any(Object),
    });

    fireEvent.click(screen.getByRole('button', { name: 'Emitir certificados' }));

    const triggerButtons = container.querySelectorAll('[data-testid="dropdown-trigger-mock"] button');
    triggerButtons.forEach((btn) => fireEvent.click(btn));

    await act(async () => {
      fireEvent.click(screen.getByTestId('btn-confirmar-exclusao-mock'));
    });
    expect(excluirCodafConferencia).not.toHaveBeenCalled();

    const excluirBtn = container.querySelector('button[data-menu-item="excluir"]') as HTMLElement;
    fireEvent.click(excluirBtn);
    expect(screen.getByTestId('modal-excluir-mock')).toHaveAttribute('data-visible', 'true');

    fireEvent.click(screen.getByTestId('btn-cancelar-exclusao-mock'));
    expect(screen.getByTestId('modal-excluir-mock')).toHaveAttribute('data-visible', 'false');

    fireEvent.click(excluirBtn);

    (excluirCodafConferencia as jest.Mock)
      .mockResolvedValueOnce({ status: 400, sucesso: false, mensagens: ['Erro customizado'] })
      .mockResolvedValueOnce({ status: 400, sucesso: false, mensagens: [] })
      .mockRejectedValueOnce(new Error('Falha grave'))
      .mockResolvedValueOnce({ status: 200, sucesso: true });

    await act(async () => {
      fireEvent.click(screen.getByTestId('btn-confirmar-exclusao-mock'));
    });
    expect(notification.error).toHaveBeenCalledWith({
      message: 'Erro',
      description: 'Erro customizado',
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('btn-confirmar-exclusao-mock'));
    });
    expect(notification.error).toHaveBeenCalledWith({
      message: 'Erro',
      description: 'Erro ao excluir o registro',
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('btn-confirmar-exclusao-mock'));
    });
    expect(notification.error).toHaveBeenCalledTimes(3);

    await act(async () => {
      fireEvent.click(screen.getByTestId('btn-confirmar-exclusao-mock'));
    });
    expect(notification.success).toHaveBeenCalledWith({
      message: 'Sucesso',
      description: 'Registro excluído com sucesso!',
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('btn-page-2'));
    });
    await waitFor(() => {
      expect(obterListaCodafConferencia).toHaveBeenLastCalledWith(
        expect.objectContaining({ NumeroPagina: 2, NumeroRegistros: 10 }),
      );
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('btn-page-undefined'));
    });
    await waitFor(() => {
      expect(obterListaCodafConferencia).toHaveBeenLastCalledWith(
        expect.objectContaining({ NumeroPagina: 1, NumeroRegistros: 10 }),
      );
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('btn-pagesize-20'));
    });
    await waitFor(() => {
      expect(obterListaCodafConferencia).toHaveBeenLastCalledWith(
        expect.objectContaining({ NumeroPagina: 1, NumeroRegistros: 20 }),
      );
    });
  });
});
