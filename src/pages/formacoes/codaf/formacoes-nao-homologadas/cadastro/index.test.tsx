import { describe, test, expect } from '@jest/globals';

// ─── Helpers extraídos da lógica do componente ───────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────

describe('CadastroCodafFormacoesNaoHomologadas - Regras de Negócio e Máquina de Estados', () => {
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
      const response = { sucesso: false, mensagens: ['Campo obrigatório', 'Turma inválida'] };

      // Act
      const resultado = tratarRespostaSalvar(response, false);

      // Assert
      expect(resultado.tipo).toBe('erro');
      expect(resultado.mensagem).toBe('Campo obrigatório, Turma inválida');
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
