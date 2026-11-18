/** @jest-environment jsdom */
import '@testing-library/jest-dom';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { notification } from '~/components/lib/notification';
import CadastroCodafConferencia, { validarArquivoPdf } from './index';

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

const mockSetFieldsValue = jest.fn();
const mockValidateFields = jest.fn();
const mockFormInstance = {
  setFieldsValue: mockSetFieldsValue,
  validateFields: mockValidateFields,
};
let mockWatchValues: Record<string, any> = {
  turmaId: 10,
  codigoFormacao: 100,
  codigoCursoEol: 555,
};

jest.mock('antd/lib/form/Form', () => ({
  useForm: () => [mockFormInstance],
}));

jest.mock('antd', () => {
  const antd = jest.requireActual('antd');
  const Form: any = (props: any) => <form {...props}>{props.children}</form>;
  Form.useWatch = (name: string) => mockWatchValues[name];
  Form.Item = (props: any) => <div>{props.children}</div>;
  return {
    ...antd,
    Form,
  };
});

jest.mock('~/components/lib/notification', () => ({
  notification: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
const mockLocation = { pathname: '/teste', state: { page: 1 } };
let mockId: string | undefined = '123';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: mockId }),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

let mockPerfil = {
  ehAreaPromotora: true,
  ehAreaPromotoraEAdmin: true,
};

jest.mock('~/core/hooks/use-perfil-codaf', () => ({
  usePerfilCodaf: () => mockPerfil,
}));

const mockMapearAnexos = jest.fn().mockReturnValue([{ uid: '1' }]);
const mockOnDownloadAnexo = jest.fn();
const mockExibirErroSalvar = jest.fn();

jest.mock('~/core/hooks/use-codaf-comum', () => ({
  useCodafComum: () => ({
    mapearAnexosParaFormulario: mockMapearAnexos,
    onDownloadAnexo: mockOnDownloadAnexo,
    exibirErroSalvar: mockExibirErroSalvar,
  }),
}));

const mockConfirmarExclusao = jest.fn();
const mockCancelarExclusao = jest.fn();
const mockOnClickExcluir = jest.fn();

jest.mock('~/core/hooks/use-exclusao-codaf', () => ({
  useExclusaoCodaf: () => ({
    modalExcluirVisible: true,
    loadingExclusao: false,
    onClickExcluir: mockOnClickExcluir,
    cancelarExclusao: mockCancelarExclusao,
    confirmarExclusao: mockConfirmarExclusao,
  }),
}));

let mockCursistasState: any[] = [
  { id: 1, rfOuCpf: '111', nomeCursista: 'Ana', participou: true },
  { id: 2, rfOuCpf: '222', nomeCursista: 'Bruno', participou: false },
];
const mockSetCursistas = jest.fn((updater) => {
  if (typeof updater === 'function') {
    mockCursistasState = updater(mockCursistasState);
  } else {
    mockCursistasState = updater;
  }
});
let mockSelecionadosIds: number[] = [1];
const mockSetSelecionadosIds = jest.fn((ids) => {
  mockSelecionadosIds = ids;
});
const mockSetPaginaAtual = jest.fn();
const mockSetTotalRegistros = jest.fn();
const mockHandleTableChange = jest.fn();

jest.mock('~/core/hooks/use-tabela-inscritos', () => ({
  useTabelaInscritos: () => ({
    cursistas: mockCursistasState,
    setCursistas: mockSetCursistas,
    cursistasSelecionadosIds: mockSelecionadosIds,
    setCursistasSelecionadosIds: mockSetSelecionadosIds,
    paginaAtualInscritos: 1,
    setPaginaAtualInscritos: mockSetPaginaAtual,
    registrosPorPaginaInscritos: 10,
    totalRegistrosInscritos: mockCursistasState.length,
    setTotalRegistrosInscritos: mockSetTotalRegistros,
    handleTableChangeInscritos: mockHandleTableChange,
  }),
}));

const mockObterPorId = jest.fn();
const mockCriarCodaf = jest.fn();
const mockAtualizarCodaf = jest.fn();
const mockObterInscritos = jest.fn();
const mockObterDetalhesProposta = jest.fn();
const mockVerificarTurma = jest.fn();
const mockUploadAnexo = jest.fn();

jest.mock('~/core/services/codaf-conferencia-service', () => ({
  obterCodafConferenciaPorId: (...args: any[]) => mockObterPorId(...args),
  criarCodafConferencia: (...args: any[]) => mockCriarCodaf(...args),
  atualizarCodafConferencia: (...args: any[]) => mockAtualizarCodaf(...args),
  excluirCodafConferencia: jest.fn(),
  obterInscritosTurmaConferencia: (...args: any[]) => mockObterInscritos(...args),
  obterDetalhesPropostaConferenciaComTurmasPorId: (...args: any[]) =>
    mockObterDetalhesProposta(...args),
  verificarTurmaPossuiCodafConferencia: (...args: any[]) => mockVerificarTurma(...args),
  fazerUploadAnexoCodafConferencia: (...args: any[]) => mockUploadAnexo(...args),
}));

jest.mock('~/components/main/text/auditoria', () => () => <div data-testid='auditoria' />);

let capturedFormularioProps: any = null;
jest.mock('./componentes/secao-formulario', () => {
  const actual = jest.requireActual('./componentes/secao-formulario');
  return {
    ...actual,
    SecaoFormularioConferencia: (props: any) => {
      capturedFormularioProps = props;
      return <div data-testid='secao-formulario' />;
    },
  };
});

let capturedListaInscritosProps: any = null;
jest.mock('../../formacoes-nao-homologadas/cadastro/componentes/secao-lista-inscritos', () => ({
  SecaoListaInscritos: (props: any) => {
    capturedListaInscritosProps = props;
    return <div data-testid='secao-lista-inscritos' />;
  },
}));

let capturedSecaoAnexosProps: any = null;
jest.mock('../../lista-presenca-codaf/cadastro/componentes/secao-anexos', () => ({
  SecaoAnexos: (props: any) => {
    capturedSecaoAnexosProps = props;
    return <div data-testid='secao-anexos' />;
  },
}));

jest.mock('../../shared/componentes/secao-informacoes-adicionais', () => ({
  SecaoInformacoesAdicionais: () => <div data-testid='secao-informacoes-adicionais' />,
}));

let capturedBotoesProps: any = null;
jest.mock('../../shared/componentes/botoes-acao-codaf', () => ({
  BotoesAcaoCodaf: (props: any) => {
    capturedBotoesProps = props;
    return (
      <div>
        <button data-testid='btn-voltar' onClick={props.onClickVoltar}>
          Voltar
        </button>
        <button data-testid='btn-cancelar' onClick={props.onClickCancelar}>
          Cancelar
        </button>
        <button data-testid='btn-excluir' onClick={props.onClickExcluir}>
          Excluir
        </button>
        <button data-testid='btn-salvar' onClick={props.onClickSalvar}>
          Salvar
        </button>
      </div>
    );
  },
}));

let capturedDrawerProps: any = null;
jest.mock(
  '../../formacoes-nao-homologadas/cadastro/componentes/drawer-edicao-lote-cursistas',
  () => ({
    DrawerEdicaoLoteCursistas: (props: any) => {
      capturedDrawerProps = props;
      return <div data-testid='drawer-lote' />;
    },
  }),
);

let capturedModalExcluirProps: any = null;
jest.mock('../../lista-presenca-codaf/cadastro/componentes/modal-excluir/modal-excluir', () => {
  return (props: any) => {
    capturedModalExcluirProps = props;
    return (
      <div data-testid='modal-excluir'>
        <button data-testid='btn-confirmar-excluir' onClick={props.onConfirm}>
          Confirmar
        </button>
      </div>
    );
  };
});

let capturedOnChangeParticipou: ((id: number, val: boolean) => void) | null = null;
jest.mock('../../shared/componentes/codaf-colunas-factory', () => ({
  criarColunasCodafNaoHomologado: (
    _pag: number,
    _reg: number,
    _bloq: boolean,
    onChange: (id: number, val: boolean) => void,
  ) => {
    capturedOnChangeParticipou = onChange;
    return [];
  },
}));

describe('CadastroCodafConferencia', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockId = '123';
    mockWatchValues = {
      turmaId: 10,
      codigoFormacao: 100,
      codigoCursoEol: 555,
    };
    mockCursistasState = [
      { id: 1, rfOuCpf: '111', nomeCursista: 'Ana', participou: true },
      { id: 2, rfOuCpf: '222', nomeCursista: 'Bruno', participou: false },
    ];
    mockSelecionadosIds = [1];
    mockPerfil = {
      ehAreaPromotora: true,
      ehAreaPromotoraEAdmin: true,
    };

    mockObterPorId.mockResolvedValue({
      sucesso: true,
      dados: {
        id: 123,
        propostaId: 100,
        propostaTurmaId: 10,
        numeroHomologacao: 20261,
        nomeFormacao: 'Conferência Municipal',
        codigoFormacao: 100,
        numeroComunicado: 12,
        dataComunicado: '2026-10-01',
        paginaComunicadoDom: 5,
        dataPublicacaoDom: '2026-10-02',
        codigoCursoEol: 555,
        codigoNivel: 1,
        observacao: 'Obs inicial',
        status: 1,
        certificadoEmitido: false,
        criadoEm: '2026-10-01',
        criadoPor: 'Admin',
        criadoLogin: 'admin',
        alteradoEm: '2026-10-02',
        alteradoPor: 'Admin',
        alteradoLogin: 'admin',
        anexos: [{ arquivoCodigo: 'abc', nomeArquivo: 'ata.pdf' }],
      },
    });

    mockObterDetalhesProposta.mockResolvedValue({
      sucesso: true,
      dados: {
        id: 100,
        nomeFormacao: 'Conferência Municipal',
        numeroFormacao: 20261,
        tipoFormacao: 3,
        turmas: [{ id: 10, descricao: 'Turma 1' }],
      },
    });

    mockObterInscritos.mockResolvedValue({
      sucesso: true,
      dados: {
        items: [
          { id: 1, nome: 'Ana', documento: '111', participou: true },
          { id: 2, nome: 'Bruno', documento: '222', participou: null },
        ],
        totalRegistros: 2,
      },
    });

    mockValidateFields.mockResolvedValue({
      codigoFormacao: 100,
      turmaId: 10,
      numeroComunicado: 12,
      dataComunicado: '2026-10-01',
      paginaComunicadoDom: 5,
      dataPublicacaoDom: '2026-10-02',
      codigoCursoEol: 555,
      codigoNivel: 1,
      observacao: 'Texto',
      anexos: [
        { response: { codigo: 'guid-1' }, name: 'a.pdf' },
        { arquivoCodigo: 'guid-2', nomeArquivo: 'b.pdf' },
      ],
    });

    mockAtualizarCodaf.mockResolvedValue({ sucesso: true, dados: { id: 123 } });
    mockCriarCodaf.mockResolvedValue({ sucesso: true, dados: { id: 456 } });
  });

  describe('validarArquivoPdf', () => {
    it('deve validar corretamente arquivos PDF e rejeitar outros formatos', () => {
      expect(validarArquivoPdf(null)).toBe(false);
      expect(validarArquivoPdf({})).toBe(false);
      expect(validarArquivoPdf({ name: 'imagem.png', type: 'image/png' })).toBe(false);
      expect(validarArquivoPdf({ name: 'falso.pdf', type: 'image/png' })).toBe(false);
      expect(validarArquivoPdf({ name: 'ata.PDF', type: 'application/pdf' })).toBe(true);
      expect(validarArquivoPdf({ name: 'ata.pdf' })).toBe(true);
    });
  });

  it('deve carregar dados no modo edicao, atualizar participacao, salvar e excluir', async () => {
    render(
      <BrowserRouter>
        <CadastroCodafConferencia />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(mockObterPorId).toHaveBeenCalledWith(123);
    });

    act(() => {
      capturedOnChangeParticipou?.(1, false);
    });
    expect(mockSetCursistas).toHaveBeenCalled();

    act(() => {
      capturedListaInscritosProps.rowSelection.onChange([1, 2]);
      capturedListaInscritosProps.rowSelection.getCheckboxProps();
      capturedListaInscritosProps.onClickRegistrarDados();
      capturedListaInscritosProps.onClickEditarDados();
    });

    await act(async () => {
      await capturedDrawerProps.onConfirmar({ participou: true });
    });

    expect(mockAtualizarCodaf).toHaveBeenCalled();
    expect(notification.success).toHaveBeenCalled();

    act(() => {
      capturedDrawerProps.onClose();
    });

    fireEvent.click(screen.getByTestId('btn-confirmar-excluir'));
    expect(mockConfirmarExclusao).toHaveBeenCalledWith(123);

    fireEvent.click(screen.getByTestId('btn-cancelar'));
  });

  it('deve tratar campos nulos e turmas vazias ou com falha no carregamento em modo edicao', async () => {
    mockObterDetalhesProposta.mockResolvedValueOnce({
      sucesso: true,
      dados: { turmas: [{ id: 10, nome: 'Turma Sem Descricao' }] },
    });
    mockObterPorId.mockResolvedValueOnce({
      sucesso: true,
      dados: {
        id: 123,
        propostaId: 100,
        propostaTurmaId: 10,
        status: 2,
        certificadoEmitido: false,
      },
    });

    const { unmount } = render(
      <BrowserRouter>
        <CadastroCodafConferencia />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(mockObterPorId).toHaveBeenCalledWith(123);
    });
    unmount();

    mockObterPorId.mockResolvedValueOnce({
      sucesso: true,
      dados: {
        id: 123,
        propostaId: 100,
        propostaTurmaId: 10,
        status: 3,
        certificadoEmitido: undefined,
        dataComunicado: null,
        dataPublicacaoDom: null,
        observacao: null,
        alteradoEm: null,
        alteradoPor: null,
        alteradoLogin: null,
        anexos: [],
      },
    });
    mockObterDetalhesProposta.mockResolvedValueOnce({
      sucesso: true,
      dados: { turmas: [] },
    });

    render(
      <BrowserRouter>
        <CadastroCodafConferencia />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(mockObterPorId).toHaveBeenCalledWith(123);
    });
  });

  it('deve tratar erro ao carregar turmas no modo edicao', async () => {
    mockObterDetalhesProposta.mockRejectedValueOnce(new Error('Falha rede'));

    render(
      <BrowserRouter>
        <CadastroCodafConferencia />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(mockObterDetalhesProposta).toHaveBeenCalled();
    });
  });

  it('deve redirecionar quando obterCodafConferenciaPorId retornar falha ou lancar erro', async () => {
    mockObterPorId.mockResolvedValueOnce({
      sucesso: false,
      mensagens: ['Não encontrado'],
    });

    const { unmount } = render(
      <BrowserRouter>
        <CadastroCodafConferencia />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(notification.error).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalled();
    });
    unmount();

    mockObterPorId.mockResolvedValueOnce({
      sucesso: false,
    });
    const { unmount: unmount2 } = render(
      <BrowserRouter>
        <CadastroCodafConferencia />
      </BrowserRouter>,
    );
    await waitFor(() => {
      expect(notification.error).toHaveBeenCalled();
    });
    unmount2();

    mockObterPorId.mockRejectedValueOnce(new Error('Erro fatal'));
    render(
      <BrowserRouter>
        <CadastroCodafConferencia />
      </BrowserRouter>,
    );
    await waitFor(() => {
      expect(notification.error).toHaveBeenCalled();
    });
  });

  it('deve tratar cenarios de busca de inscritos por turma (sem turmaId, falha e excecao)', async () => {
    mockId = undefined;
    mockWatchValues = { turmaId: undefined, codigoFormacao: undefined, codigoCursoEol: undefined };

    const { unmount } = render(
      <BrowserRouter>
        <CadastroCodafConferencia />
      </BrowserRouter>,
    );
    expect(mockSetTotalRegistros).toHaveBeenCalledWith(0);
    unmount();

    mockWatchValues = { turmaId: 10, codigoFormacao: 100, codigoCursoEol: null };
    mockObterInscritos.mockResolvedValueOnce({
      sucesso: true,
      dados: { items: [], totalRegistros: 0 },
    });
    const { unmount: unmount2 } = render(
      <BrowserRouter>
        <CadastroCodafConferencia />
      </BrowserRouter>,
    );
    await waitFor(() => {
      expect(mockObterInscritos).toHaveBeenCalled();
    });
    unmount2();

    mockObterInscritos.mockResolvedValueOnce({ sucesso: false });
    const { unmount: unmount3 } = render(
      <BrowserRouter>
        <CadastroCodafConferencia />
      </BrowserRouter>,
    );
    await waitFor(() => {
      expect(notification.warning).toHaveBeenCalled();
    });
    unmount3();

    mockObterInscritos.mockRejectedValueOnce(new Error('Falha inscritos'));
    render(
      <BrowserRouter>
        <CadastroCodafConferencia />
      </BrowserRouter>,
    );
    await waitFor(() => {
      expect(notification.error).toHaveBeenCalled();
    });
  });

  it('deve validar codigo da formacao no onBlur e onChange para todos os cenarios', async () => {
    mockId = undefined;
    render(
      <BrowserRouter>
        <CadastroCodafConferencia />
      </BrowserRouter>,
    );

    act(() => {
      capturedFormularioProps.onChangeCodigoFormacao('100');
    });

    await act(async () => {
      await capturedFormularioProps.onBlurCodigoFormacao('abc');
    });

    // Proposta nao pertence ao tipo conferencia
    mockObterDetalhesProposta.mockResolvedValueOnce({
      sucesso: true,
      dados: { id: 100, tipoFormacao: 1, situacao: 1, turmas: [] },
    });
    await act(async () => {
      await capturedFormularioProps.onBlurCodigoFormacao('100');
    });
    expect(notification.warning).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'A formação informada não pertence ao tipo Conferência.',
      }),
    );

    // Proposta nao esta com situacao Publicada
    mockObterDetalhesProposta.mockResolvedValueOnce({
      sucesso: true,
      dados: { id: 100, tipoFormacao: 3, situacao: 2, turmas: [] },
    });
    await act(async () => {
      await capturedFormularioProps.onBlurCodigoFormacao('100');
    });
    expect(notification.warning).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'A formação informada deve estar com a situação Publicada.',
      }),
    );

    // Proposta do tipo conferencia publicada com turmas
    mockObterDetalhesProposta.mockResolvedValueOnce({
      sucesso: true,
      dados: {
        id: 100,
        nomeFormacao: 'Conf',
        numeroFormacao: 1,
        tipoFormacao: 3,
        situacao: 1,
        turmas: [{ id: 10, nome: 'Turma A' }],
      },
    });
    await act(async () => {
      await capturedFormularioProps.onBlurCodigoFormacao('100');
    });

    // Proposta sem turmas
    mockObterDetalhesProposta.mockResolvedValueOnce({
      sucesso: true,
      dados: { id: 100, tipoFormacao: 3, turmas: [] },
    });
    await act(async () => {
      await capturedFormularioProps.onBlurCodigoFormacao('100');
    });
    expect(notification.warning).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Nenhuma turma encontrada para esta formação',
      }),
    );

    // Proposta nao encontrada (204 No Content)
    mockObterDetalhesProposta.mockResolvedValueOnce({
      sucesso: true,
      dados: null,
    });
    await act(async () => {
      await capturedFormularioProps.onBlurCodigoFormacao('999');
    });
    expect(notification.info).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Formação de conferência publicada não encontrada',
      }),
    );

    // Falha HTTP retornada pelo helper obterRegistro
    mockObterDetalhesProposta.mockResolvedValueOnce({
      sucesso: false,
      dados: null,
    });
    await act(async () => {
      await capturedFormularioProps.onBlurCodigoFormacao('999');
    });
    expect(notification.warning).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Erro ao buscar detalhes da formação',
      }),
    );

    // Erro na requisicao (excecao)
    mockObterDetalhesProposta.mockRejectedValueOnce(new Error('Erro'));
    await act(async () => {
      await capturedFormularioProps.onBlurCodigoFormacao('999');
    });
    expect(notification.warning).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Erro ao buscar detalhes da formação',
      }),
    );
  });

  it('deve validar se a turma selecionada ja possui CODAF de conferencia', async () => {
    mockId = undefined;
    render(
      <BrowserRouter>
        <CadastroCodafConferencia />
      </BrowserRouter>,
    );

    await act(async () => {
      await capturedFormularioProps.onSelectTurma(undefined);
    });

    mockObterDetalhesProposta.mockResolvedValueOnce({
      sucesso: true,
      dados: {
        id: 100,
        tipoFormacao: 3,
        turmas: [
          { id: 10, descricao: 'Turma 10' },
          { id: 20, descricao: 'Turma 20' },
        ],
      },
    });
    await act(async () => {
      await capturedFormularioProps.onBlurCodigoFormacao('100');
    });

    mockVerificarTurma.mockResolvedValueOnce({ sucesso: true, dados: true });
    await act(async () => {
      await capturedFormularioProps.onSelectTurma(10);
    });
    expect(notification.warning).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Esta turma já está vinculada a um CODAF Formação de Conferência.',
      }),
    );

    mockVerificarTurma.mockResolvedValueOnce({ sucesso: true, dados: false });
    await act(async () => {
      await capturedFormularioProps.onSelectTurma(20);
    });

    mockVerificarTurma.mockRejectedValueOnce(new Error('Erro'));
    await act(async () => {
      await capturedFormularioProps.onSelectTurma(20);
    });
  });

  it('deve bloquear upload de anexo que nao seja PDF e permitir PDF', async () => {
    mockId = undefined;
    render(
      <BrowserRouter>
        <CadastroCodafConferencia />
      </BrowserRouter>,
    );

    const formDataInvalido = new FormData();
    formDataInvalido.append(
      'arquivo',
      new File(['conteudo'], 'imagem.png', { type: 'image/png' }),
    );

    const resInvalido = await capturedSecaoAnexosProps.fazerUploadAnexoCodaf(formDataInvalido, {});
    expect(resInvalido.sucesso).toBe(false);
    expect(notification.error).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Só é permitido inserir arquivos no formato PDF.',
      }),
    );

    const formDataValido = new FormData();
    formDataValido.append(
      'arquivo',
      new File(['%PDF'], 'documento.pdf', { type: 'application/pdf' }),
    );
    mockUploadAnexo.mockResolvedValueOnce({ sucesso: true });
    await capturedSecaoAnexosProps.fazerUploadAnexoCodaf(formDataValido, {});
    expect(mockUploadAnexo).toHaveBeenCalled();
  });

  it('deve salvar em modo criacao com campos opcionais vazios e tratar falhas ao salvar', async () => {
    mockId = undefined;
    mockValidateFields.mockResolvedValueOnce({
      codigoFormacao: 0,
      turmaId: 0,
      numeroComunicado: null,
      dataComunicado: null,
      paginaComunicadoDom: null,
      dataPublicacaoDom: null,
      codigoCursoEol: null,
      codigoNivel: null,
      observacao: '',
      anexos: undefined,
    });
    mockCursistasState = [{ id: 1, rfOuCpf: '111', nomeCursista: 'Ana', participou: null }];

    render(
      <BrowserRouter>
        <CadastroCodafConferencia />
      </BrowserRouter>,
    );

    mockCriarCodaf.mockResolvedValueOnce({ sucesso: true, dados: {} });
    mockObterPorId.mockResolvedValueOnce({ sucesso: false });
    await act(async () => {
      fireEvent.click(screen.getByTestId('btn-salvar'));
    });

    mockCriarCodaf.mockResolvedValueOnce({ sucesso: true, dados: { id: 999 } });
    mockObterPorId.mockResolvedValueOnce({ sucesso: false });
    await act(async () => {
      fireEvent.click(screen.getByTestId('btn-salvar'));
    });
    expect(mockCriarCodaf).toHaveBeenCalled();

    // Falha na criacao sem mensagens
    mockCriarCodaf.mockResolvedValueOnce({ sucesso: false });
    await act(async () => {
      await capturedDrawerProps.onConfirmar({ participou: false });
    });
    expect(notification.error).toHaveBeenCalled();

    // Excecao no validateFields
    mockValidateFields.mockRejectedValueOnce(new Error('Validacao falhou'));
    await act(async () => {
      fireEvent.click(screen.getByTestId('btn-salvar'));
    });
    expect(mockExibirErroSalvar).toHaveBeenCalled();
  });

  it('deve tratar erro ao atualizar em modo edicao com mensagens da API', async () => {
    mockId = '123';
    mockAtualizarCodaf.mockResolvedValueOnce({
      sucesso: false,
      mensagens: ['Erro customizado'],
    });

    render(
      <BrowserRouter>
        <CadastroCodafConferencia />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(mockObterPorId).toHaveBeenCalled();
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('btn-salvar'));
    });

    expect(notification.error).toHaveBeenCalledWith({
      message: 'Erro ao salvar',
      description: 'Erro customizado',
    });

    mockAtualizarCodaf.mockResolvedValueOnce({
      sucesso: false,
      mensagens: [],
    });
    await act(async () => {
      fireEvent.click(screen.getByTestId('btn-salvar'));
    });
    expect(notification.error).toHaveBeenCalledWith({
      message: 'Erro ao salvar',
      description: 'Erro ao atualizar o registro',
    });
  });
});
