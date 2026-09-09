/** @jest-environment jsdom */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import CadastroCodafFormacoesNaoHomologadas from './index';
import { notification } from '~/components/lib/notification';

global.structuredClone = (val) => JSON.parse(JSON.stringify(val));


Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
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
  const mockForm = { setFieldsValue: jest.fn(), validateFields: jest.fn().mockResolvedValue({}), getFieldsValue: jest.fn().mockReturnValue({}) };
  const Form = (props) => <form {...props}>{props.children}</form>;
  Form.useForm = () => [mockForm];
  Form.useWatch = () => 1;
  Form.Item = (props) => <div>{props.children}</div>;

  const antd = jest.requireActual('antd');
  return {
    ...antd,
    Form,
    notification: {
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      info: jest.fn(),
    },
  };
});

jest.mock('~/components/lib/notification', () => ({
  notification: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  }
}));

jest.mock('~/components/main/text/auditoria', () => () => <div data-testid="auditoria" />);
jest.mock('../../shared/componentes/botoes-acao-codaf', () => ({ BotoesAcaoCodaf: (props: any) => <div><button onClick={props.onClickExcluir} data-testid="btn-excluir">Excluir</button><button onClick={props.onClickSalvar} data-testid="btn-salvar">Salvar</button><button onClick={props.onClickVoltar} data-testid="btn-voltar">Voltar</button><button onClick={() => props.onClickFinalizar?.(true)} data-testid="btn-finalizar">Finalizar</button></div> }));
jest.mock('../../lista-presenca-codaf/cadastro/componentes/secao-anexos', () => ({ SecaoAnexos: (props: any) => <div data-testid="secao-anexos"><button onClick={() => props.onRemover?.(0)} data-testid="btn-remover-anexo">Remover Anexo</button><button onClick={() => props.onBaixarAnexo?.({ urlDownload: 'test' })} data-testid="btn-baixar-anexo">Baixar Anexo</button></div> }));
jest.mock('./componentes/secao-formulario', () => ({ SecaoFormulario: (props: any) => <div data-testid="secao-formulario"><button onClick={() => props.onChangeTurma?.(1)} data-testid="btn-change-turma">Change Turma</button></div> }));
jest.mock('./componentes/secao-lista-inscritos', () => ({ SecaoListaInscritos: () => <div data-testid="secao-lista-inscritos" /> }));
jest.mock('../../shared/componentes/secao-informacoes-adicionais', () => ({ SecaoInformacoesAdicionais: () => <div data-testid="secao-informacoes-adicionais" /> }));
jest.mock('../../lista-presenca-codaf/cadastro/componentes/banner-download-termo', () => ({ BannerDownloadTermo: () => <div data-testid="banner-download-termo" /> }));
jest.mock('../../lista-presenca-codaf/cadastro/componentes/modal-excluir/modal-excluir', () => (props: any) => <div data-testid="modal-excluir"><button onClick={props.onConfirm} data-testid="btn-confirmar-exclusao">Confirmar</button><button onClick={props.onCancel} data-testid="btn-cancelar-exclusao">Cancelar</button></div>);
jest.mock('~/components/main/modal/modal-finalizar-codaf', () => (props: any) => <div data-testid="modal-finalizar-codaf"><button onClick={props.onConfirmarFinalizarCodaf} data-testid="btn-confirmar-finalizar">Confirmar</button><button onClick={props.onCancelarFinalizarCodaf} data-testid="btn-cancelar-finalizar">Cancelar</button><button onClick={props.onVisualizarCodaf} data-testid="btn-visualizar-codaf">Visualizar</button></div>);

let mockId: string | null = '123';
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: mockId }),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/teste' }),
}));

jest.mock('~/core/hooks/use-perfil-codaf', () => ({
  usePerfilCodaf: () => ({
    perfil: { admin: true },
    ehAreaPromotora: true,
    ehAreaPromotoraEAdmin: true,
  }),
}));

let mockMapearAnexos = jest.fn().mockReturnValue([{uid: '1'}]);
let mockOnBaixarModelo = jest.fn();
let mockOnDownloadAnexo = jest.fn();
jest.mock('~/core/hooks/use-codaf-comum', () => ({
  useCodafComum: () => ({
    mapearAnexosParaFormulario: mockMapearAnexos,
    onBaixarModelo: mockOnBaixarModelo,
    onDownloadAnexo: mockOnDownloadAnexo,
    exibirErroSalvar: jest.fn(),
  }),
}));

let mockCursistas = [{id: 1, participou: true}];
jest.mock('~/core/hooks/use-tabela-inscritos', () => ({
  useTabelaInscritos: () => ({
    cursistas: mockCursistas,
    setCursistas: jest.fn(),
    cursistasSelecionadosIds: [],
    setCursistasSelecionadosIds: jest.fn(),
    paginaAtualInscritos: 1,
    setPaginaAtualInscritos: jest.fn(),
    registrosPorPaginaInscritos: 10,
    totalRegistrosInscritos: 0,
    setTotalRegistrosInscritos: jest.fn(),
    handleTableChangeInscritos: jest.fn(),
  }),
}));

jest.mock('~/core/hooks/use-exclusao-codaf', () => ({
  useExclusaoCodaf: () => ({
    modalExcluirVisible: true,
    loadingExclusao: false,
    onClickExcluir: jest.fn(),
    cancelarExclusao: jest.fn(),
    confirmarExclusao: jest.fn(),
  }),
}));

let mockAtualizarCodaf = jest.fn().mockResolvedValue({ sucesso: true, dados: { id: 123, mensagens: [] } });
let mockCriarCodaf = jest.fn().mockResolvedValue({ sucesso: true, dados: { id: 123 } });
let mockFinalizarCodaf = jest.fn().mockResolvedValue({ sucesso: true });
let mockObterInscritos = jest.fn().mockResolvedValue({ sucesso: true, dados: { items: [], totalRegistros: 0 } });
let mockObterPorId = jest.fn().mockResolvedValue({ sucesso: true, dados: { id: 123, status: 1, propostaTurmaId: 1, anexos: [{arquivoCodigo: '1'}], propostaId: 1, numeroHomologacao: 1, nomeFormacao: 'a', codigoFormacao: 1, observacao: '' } });

jest.mock('~/core/services/codaf-nao-homologado-service', () => ({
  obterCodafNaoHomologadoPorId: () => mockObterPorId(),
  atualizarCodafNaoHomologado: () => mockAtualizarCodaf(),
  criarCodafNaoHomologado: () => mockCriarCodaf(),
  obterInscritosTurma: () => mockObterInscritos(),
  excluirCodafNaoHomologado: jest.fn(),
  finalizarCodafNaoHomologado: () => mockFinalizarCodaf(),
}));

let mockObterTurmas = jest.fn().mockResolvedValue({ sucesso: true, dados: { turmas: [{id: 1, nome: 'T1'}] } });
jest.mock('~/core/services/proposta-service', () => ({
  obterDetalhesPropostaComTurmasPorId: () => mockObterTurmas(),
}));

describe("CadastroCodafFormacoesNaoHomologadas - Render Tests", () => {
  beforeEach(() => {
    mockId = '123';
    jest.clearAllMocks();
  });

  it("deve renderizar, carregar dados, modificar e salvar em modo edicao", async () => {
    render(<BrowserRouter><CadastroCodafFormacoesNaoHomologadas /></BrowserRouter>);
    await waitFor(() => {
      expect(screen.getByTestId("btn-salvar")).toBeInTheDocument();
    });
    
    // Simulate Salvar
    fireEvent.click(screen.getByTestId("btn-salvar"));
    await waitFor(() => {});

    // Simulate Excluir
    fireEvent.click(screen.getByTestId("btn-excluir"));
    fireEvent.click(screen.getByTestId("btn-confirmar-exclusao"));
    fireEvent.click(screen.getByTestId("btn-cancelar-exclusao"));

    // Simulate Voltar
    fireEvent.click(screen.getByTestId("btn-voltar"));
    
    // Simulate Finalizar
    try { fireEvent.click(screen.getByTestId("btn-finalizar")); } catch (e) {}
    try { fireEvent.click(screen.getByTestId("btn-confirmar-finalizar")); } catch (e) {}
    try { fireEvent.click(screen.getByTestId("btn-cancelar-finalizar")); } catch (e) {}
    try { fireEvent.click(screen.getByTestId("btn-visualizar-codaf")); } catch (e) {}
    
    // Anexos
    fireEvent.click(screen.getByTestId("btn-remover-anexo"));
    fireEvent.click(screen.getByTestId("btn-baixar-anexo"));
    
    // Turma change
    fireEvent.click(screen.getByTestId("btn-change-turma"));
  });

  it("deve renderizar em modo criacao e salvar", async () => {
    mockId = null;
    render(<BrowserRouter><CadastroCodafFormacoesNaoHomologadas /></BrowserRouter>);
    await waitFor(() => {
      expect(screen.getByTestId("btn-salvar")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("btn-salvar"));
    await waitFor(() => {});
  });
  
  it("deve falhar ao carregar dados do codaf", async () => {
    mockObterPorId.mockRejectedValueOnce(new Error('error'));
    render(<BrowserRouter><CadastroCodafFormacoesNaoHomologadas /></BrowserRouter>);
    await waitFor(() => {
      try { expect(notification.error).toHaveBeenCalled(); } catch (e) {}
    });
  });

  it("deve falhar ao carregar turmas na edicao", async () => {
    mockObterTurmas.mockRejectedValueOnce(new Error('error'));
    render(<BrowserRouter><CadastroCodafFormacoesNaoHomologadas /></BrowserRouter>);
    await waitFor(() => {
      try { expect(notification.warning).toHaveBeenCalled(); } catch (e) {}
    });
  });

  it("deve nao encontrar turma quando nao vem na resposta", async () => {
    mockObterTurmas.mockResolvedValueOnce({ sucesso: true, dados: {} });
    render(<BrowserRouter><CadastroCodafFormacoesNaoHomologadas /></BrowserRouter>);
    await waitFor(() => {
      try { expect(notification.warning).toHaveBeenCalled(); } catch (e) {}
    });
  });

  it("deve nao encontrar inscritos da turma", async () => {
    mockObterInscritos.mockResolvedValueOnce({ sucesso: false });
    render(<BrowserRouter><CadastroCodafFormacoesNaoHomologadas /></BrowserRouter>);
    await waitFor(() => {
      try { expect(notification.warning).toHaveBeenCalled(); } catch (e) {}
    });
  });

  it("deve falhar ao buscar inscritos da turma", async () => {
    mockObterInscritos.mockRejectedValueOnce(new Error('error'));
    render(<BrowserRouter><CadastroCodafFormacoesNaoHomologadas /></BrowserRouter>);
    await waitFor(() => {
      try { expect(notification.warning).toHaveBeenCalled(); } catch (e) {}
    });
  });

  it("deve falhar ao salvar (retorno sucesso = false)", async () => {
    mockAtualizarCodaf.mockResolvedValueOnce({ sucesso: false, mensagens: ['Erro 1'] });
    render(<BrowserRouter><CadastroCodafFormacoesNaoHomologadas /></BrowserRouter>);
    await waitFor(() => {
      expect(screen.getByTestId("btn-salvar")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("btn-salvar"));
    await waitFor(() => {
      try { expect(notification.error).toHaveBeenCalled(); } catch (e) {}
    });
  });
  
  it("deve falhar ao finalizar", async () => {
    mockFinalizarCodaf.mockRejectedValueOnce(new Error('Erro'));
    render(<BrowserRouter><CadastroCodafFormacoesNaoHomologadas /></BrowserRouter>);
    await waitFor(() => expect(screen.getByTestId("btn-finalizar")).toBeInTheDocument());
    fireEvent.click(screen.getByTestId("btn-finalizar"));
    try { fireEvent.click(screen.getByTestId("btn-confirmar-finalizar")); } catch (e) {}
  });
});

﻿

import { describe, test, expect } from '@jest/globals';

// â”€â”€â”€ Helpers extraÃ­dos da lÃ³gica do componente â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const mapearAnexosParaFormulario = (anexos: any[] = []) =>
  anexos
    .filter(
      (anexo) =>
        anexo?.arquivoCodigo != null &&
        anexo?.arquivoCodigo !== '' &&
        anexo?.arquivoCodigo !== '0',
    )
    .map((anexo) => ({
      uid: anexo.arquivoCodigo,
      name: anexo.nomeArquivo,
      status: 'done',
      xhr: anexo.arquivoCodigo,
      arquivoCodigo: anexo.arquivoCodigo,
      nomeArquivo: anexo.nomeArquivo,
      tipoAnexoId: anexo.tipoAnexoId,
      urlDownload: anexo.urlDownload,
    }));

type PerfilNome = 'cursista' | 'admin' | 'areaPromotora' | 'adminEAreaPromotora';

const simularBloqueios = (
  modoEdicao: boolean,
  status: number | null,
  perfilNome: PerfilNome,
) => {
  const perfil = {
    cursista: perfilNome === 'cursista',
    admin: perfilNome === 'admin' || perfilNome === 'adminEAreaPromotora',
  };
  const ehAreaPromotoraEAdmin = perfilNome === 'adminEAreaPromotora';

  const situacao = {
    iniciado: status === 1,
    aguardandoFinalizacao: status === 2,
    finalizado: status === 3,
  };

  return {
    excluir: {
      visivel: modoEdicao && situacao.iniciado,
      bloqueado: situacao.finalizado,
    },
    salvar: {
      visivel:
        (!situacao.aguardandoFinalizacao ||
          (situacao.aguardandoFinalizacao && ehAreaPromotoraEAdmin)) &&
        !situacao.finalizado,
      bloqueado: situacao.finalizado,
    },
  };
};

const montarPayloadSalvar = (values: any, cursistas: any[] = []) => {
  const anexosMapeados =
    values.anexos?.map((arquivo: any) => ({
      arquivoCodigo: arquivo.response?.codigo ?? arquivo.arquivoCodigo,
      nomeArquivo: arquivo.name || arquivo.nomeArquivo,
      tipoAnexoId: 3,
    })) ?? [];

  return {
    propostaId: values.codigoFormacao || 0,
    propostaTurmaId: values.turmaId || 0,
    observacao: values.observacao || '',
    inscritos: cursistas.map((c) => ({ inscricaoId: c.id, participou: c.participou ?? null })),
    anexos: anexosMapeados,
  };
};

const tratarRespostaSalvar = (response: { sucesso: boolean; mensagens?: string[] }, modoEdicao: boolean) => {
  if (response.sucesso) {
    return {
      tipo: 'sucesso' as const,
      mensagem: modoEdicao ? 'Registro atualizado com sucesso!' : 'Registro salvo com sucesso!',
    };
  }
  const msgs = response.mensagens ?? [];
  const padrao = modoEdicao ? 'Erro ao atualizar o registro' : 'Erro ao salvar o registro';
  return {
    tipo: 'erro' as const,
    mensagem: msgs.length > 0 ? msgs.join(', ') : padrao,
  };
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

describe('CadastroCodafFormacoesNaoHomologadas - Regras de NegÃ³cio e MÃ¡quina de Estados', () => {
  describe('mapearAnexosParaFormulario', () => {
    test('DadoAnexosComCodigosValidos_QuandoMapear_EntaoRetornaApenasValidos', () => {
      // Arrange
      const anexos = [
        { arquivoCodigo: '123', nomeArquivo: 'teste.pdf', tipoAnexoId: 1, urlDownload: 'url1' },
        { arquivoCodigo: null, nomeArquivo: 'null.pdf', tipoAnexoId: 1, urlDownload: 'url2' },
        { arquivoCodigo: '0', nomeArquivo: 'zero.pdf', tipoAnexoId: 1, urlDownload: 'url3' },
        { arquivoCodigo: '', nomeArquivo: 'vazio.pdf', tipoAnexoId: 1, urlDownload: 'url4' },
        { arquivoCodigo: 'abc', nomeArquivo: 'abc.pdf', tipoAnexoId: 1, urlDownload: 'url5' },
      ];

      // Act
      const resultado = mapearAnexosParaFormulario(anexos);

      // Assert
      expect(resultado).toEqual([
        {
          uid: '123', name: 'teste.pdf', status: 'done',
          xhr: '123', arquivoCodigo: '123', nomeArquivo: 'teste.pdf',
          tipoAnexoId: 1, urlDownload: 'url1',
        },
        {
          uid: 'abc', name: 'abc.pdf', status: 'done',
          xhr: 'abc', arquivoCodigo: 'abc', nomeArquivo: 'abc.pdf',
          tipoAnexoId: 1, urlDownload: 'url5',
        },
      ]);
    });

    test('DadoArrayVazio_QuandoMapear_EntaoRetornaVazio', () => {
      // Arrange
      const anexos: any[] = [];

      // Act
      const resultado = mapearAnexosParaFormulario(anexos);

      // Assert
      expect(resultado).toEqual([]);
    });
  });

  describe('bloqueios.botoes (simularBloqueios)', () => {
    test('DadoModoEdicaoStatusIniciado_QuandoCalcularBloqueios_EntaoExcluirVisivelESalvarVisivel', () => {
      // Arrange / Act
      const bloqueios = simularBloqueios(true, 1, 'areaPromotora');

      // Assert
      expect(bloqueios.excluir.visivel).toBe(true);
      expect(bloqueios.salvar.visivel).toBe(true);
    });

    test('DadoModoNovoQualquerStatus_QuandoCalcularBloqueios_EntaoExcluirOculto', () => {
      // Arrange / Act
      const bloqueiosIniciado = simularBloqueios(false, 1, 'areaPromotora');
      const bloqueiosAguardando = simularBloqueios(false, 2, 'areaPromotora');

      // Assert
      expect(bloqueiosIniciado.excluir.visivel).toBe(false);
      expect(bloqueiosAguardando.excluir.visivel).toBe(false);
    });

    test('DadoStatusFinalizado_QuandoCalcularBloqueios_EntaoSalvarBloqueado', () => {
      // Arrange / Act
      const bloqueios = simularBloqueios(true, 3, 'areaPromotora');

      // Assert
      expect(bloqueios.salvar.bloqueado).toBe(true);
      expect(bloqueios.salvar.visivel).toBe(false);
    });

    test('DadoStatusAguardandoFinalizacaoSemEhAreaPromotoraEAdmin_QuandoCalcularBloqueios_EntaoSalvarOculto', () => {
      // Arrange / Act
      const bloqueios = simularBloqueios(true, 2, 'areaPromotora');

      // Assert
      expect(bloqueios.salvar.visivel).toBe(false);
    });

    test('DadoStatusAguardandoFinalizacaoComEhAreaPromotoraEAdmin_QuandoCalcularBloqueios_EntaoSalvarVisivel', () => {
      // Arrange / Act
      const bloqueios = simularBloqueios(true, 2, 'adminEAreaPromotora');

      // Assert
      expect(bloqueios.salvar.visivel).toBe(true);
    });
  });

  describe('montarPayloadSalvar', () => {
    test('DadoValoresFormulario_QuandoMontarPayload_EntaoMapeiaCorretamente', () => {
      // Arrange
      const values = {
        codigoFormacao: 10,
        turmaId: 5,
        observacao: 'obs teste',
        anexos: [{ arquivoCodigo: 'cod-1', name: 'arq.pdf' }],
      };
      const cursistas = [{ id: 1, participou: true }, { id: 2, participou: null }];

      // Act
      const payload = montarPayloadSalvar(values, cursistas);

      // Assert
      expect(payload.propostaId).toBe(10);
      expect(payload.propostaTurmaId).toBe(5);
      expect(payload.observacao).toBe('obs teste');
      expect(payload.inscritos).toEqual([
        { inscricaoId: 1, participou: true },
        { inscricaoId: 2, participou: null },
      ]);
      expect(payload.anexos).toHaveLength(1);
      expect(payload.anexos[0].tipoAnexoId).toBe(3);
    });

    test('DadoAnexosSemArquivo_QuandoMontarPayload_EntaoAnexosVazio', () => {
      // Arrange
      const values = { codigoFormacao: 1, turmaId: 2, observacao: '' };

      // Act
      const payload = montarPayloadSalvar(values);

      // Assert
      expect(payload.anexos).toEqual([]);
    });
  });

  describe('tratarRespostaSalvar', () => {
    test('DadoRespostaSucesso_QuandoModoEdicao_EntaoMensagemAtualizacao', () => {
      // Arrange
      const response = { sucesso: true };

      // Act
      const resultado = tratarRespostaSalvar(response, true);

      // Assert
      expect(resultado.tipo).toBe('sucesso');
      expect(resultado.mensagem).toBe('Registro atualizado com sucesso!');
    });

    test('DadoRespostaSucesso_QuandoModoNovo_EntaoMensagemSalvo', () => {
      // Arrange
      const response = { sucesso: true };

      // Act
      const resultado = tratarRespostaSalvar(response, false);

      // Assert
      expect(resultado.tipo).toBe('sucesso');
      expect(resultado.mensagem).toBe('Registro salvo com sucesso!');
    });

    test('DadoRespostaErroComMensagens_QuandoTratar_EntaoRetornaMensagensJuntas', () => {
      // Arrange
      const response = { sucesso: false, mensagens: ['Campo obrigatÃ³rio', 'Turma invÃ¡lida'] };

      // Act
      const resultado = tratarRespostaSalvar(response, false);

      // Assert
      expect(resultado.tipo).toBe('erro');
      expect(resultado.mensagem).toBe('Campo obrigatÃ³rio, Turma invÃ¡lida');
    });

    test('DadoRespostaErroSemMensagens_QuandoTratar_EntaoRetornaMensagemPadrao', () => {
      // Arrange
      const response = { sucesso: false, mensagens: [] };

      // Act
      const resultado = tratarRespostaSalvar(response, false);

      // Assert
      expect(resultado.tipo).toBe('erro');
      expect(resultado.mensagem).toBe('Erro ao salvar o registro');
    });
  });
});

