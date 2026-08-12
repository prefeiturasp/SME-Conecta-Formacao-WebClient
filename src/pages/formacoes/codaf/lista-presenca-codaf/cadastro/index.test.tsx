import { describe, test, expect } from '@jest/globals';
import { DeltaInscritosDTO } from '../../../../../core/services/codaf-lista-presenca-service';
import { calcularAprovacao } from '../../../../../core/utils/codaf-utils';
import type { RegrasAprovacaoCursistaCodafDto } from '../../../../../core/dto/cursista-dto';

describe('CadastroListaPresencaCodaf - Regras de Negócio e Máquina de Estados', () => {

  describe('Filtragem de anexos exibidos', () => {
    const filtrarAnexosValidos = (anexos: Array<{ arquivoCodigo?: string | null }>) =>
      anexos.filter(
        (anexo) =>
          anexo?.arquivoCodigo != null &&
          anexo?.arquivoCodigo !== '' &&
          anexo?.arquivoCodigo !== '0',
      );

    test('DadoAnexosMistos_QuandoFiltrar_EntaoRetornaApenasCodigosValidos', () => {
      const anexos = [
        { arquivoCodigo: '123' },
        { arquivoCodigo: null },
        { arquivoCodigo: '0' },
        { arquivoCodigo: '' },
        { arquivoCodigo: 'abc' },
      ];

      const anexosFiltrados = filtrarAnexosValidos(anexos);

      expect(anexosFiltrados).toEqual([
        { arquivoCodigo: '123' },
        { arquivoCodigo: 'abc' },
      ]);
    });
  });

  describe('Conversores de Dados (Atividade Obrigatória)', () => {
    const atividadeObrigatorioParaLetra = (valor: boolean | null | undefined): 'S' | 'N' | null => {
      if (valor === null || valor === undefined) return null;
      return valor ? 'S' : 'N';
    };

    const letraParaAtividadeObrigatorio = (atividade: string | null): boolean | null => {
      if (atividade === 'S') return true;
      if (atividade === 'N') return false;
      return null;
    };

    test('DadoBooleanVerdadeiro_QuandoConverterParaLetra_EntaoRetornaS', () => {
      // Arrange / Act / Assert
      expect(atividadeObrigatorioParaLetra(true)).toBe('S');
      expect(atividadeObrigatorioParaLetra(false)).toBe('N');
      expect(atividadeObrigatorioParaLetra(null)).toBeNull();
      expect(atividadeObrigatorioParaLetra(undefined)).toBeNull();
    });

    test('DadoLetraS_QuandoConverterParaBooleano_EntaoRetornaVerdadeiro', () => {
      // Arrange / Act / Assert
      expect(letraParaAtividadeObrigatorio('S')).toBe(true);
      expect(letraParaAtividadeObrigatorio('N')).toBe(false);
      expect(letraParaAtividadeObrigatorio(null)).toBeNull();
      expect(letraParaAtividadeObrigatorio('X')).toBeNull();
    });
  });

  describe('Lógica de Snapshot do Delta (Prevenção de Condição de Corrida)', () => {
    const deltasSaoIguais = (d1: DeltaInscritosDTO | null, d2: DeltaInscritosDTO | null) => {
      if (!d1 && !d2) return true;
      if (!d1 || !d2) return false;

      const idsNovos1 = [...d1.inscritosNovos.map((i: { id: number }) => i.id)].sort();
      const idsNovos2 = [...d2.inscritosNovos.map((i: { id: number }) => i.id)].sort();
      if (JSON.stringify(idsNovos1) !== JSON.stringify(idsNovos2)) return false;

      const idsRemovidos1 = [...d1.inscritosRemovidos.map((i: { id: number }) => i.id)].sort();
      const idsRemovidos2 = [...d2.inscritosRemovidos.map((i: { id: number }) => i.id)].sort();
      if (JSON.stringify(idsRemovidos1) !== JSON.stringify(idsRemovidos2)) return false;

      return true;
    };

    const mockDelta = (idsNovos: number[], idsRemovidos: number[]): DeltaInscritosDTO => ({
      houveAlteracao: true,
      totalNovos: idsNovos.length,
      totalRemovidos: idsRemovidos.length,
      inscritosNovos: idsNovos.map(id => ({ id, nome: 'A', documento: '1', percentualFrequencia: 100, conceitoFinal: 'S', atividadeObrigatorio: true, aprovado: true })),
      inscritosRemovidos: idsRemovidos.map(id => ({ id, nome: 'A', documento: '1' })),
    });

    test('DadoAmbosOsDeltasNulos_QuandoComparar_EntaoSaoIguais', () => {
      // Arrange / Act / Assert
      expect(deltasSaoIguais(null, null)).toBe(true);
    });

    test('DadoApenasDeltaUmNulo_QuandoComparar_EntaoSaoDiferentes', () => {
      // Arrange / Act / Assert
      expect(deltasSaoIguais(mockDelta([1], []), null)).toBe(false);
      expect(deltasSaoIguais(null, mockDelta([1], []))).toBe(false);
    });

    test('DadoDeltasComMesmosIdsEmOrdensDiferentes_QuandoComparar_EntaoSaoIguais', () => {
      // Arrange
      const d1 = mockDelta([1, 2], [3]);
      const d2 = mockDelta([2, 1], [3]);

      // Act / Assert
      expect(deltasSaoIguais(d1, d2)).toBe(true);
    });

    test('DadoDeltaComIdNovoAdicional_QuandoComparar_EntaoDetectaCondicaoDeCorrida', () => {
      // Arrange
      const d1 = mockDelta([1, 2], []);
      const d2 = mockDelta([1, 2, 3], []);

      // Act / Assert
      expect(deltasSaoIguais(d1, d2)).toBe(false);
    });

    test('DadoDeltaComIdRemovidoDiferente_QuandoComparar_EntaoSaoDiferentes', () => {
      // Arrange
      const d1 = mockDelta([], [10]);
      const d2 = mockDelta([], [10, 11]);

      // Act / Assert
      expect(deltasSaoIguais(d1, d2)).toBe(false);
    });
  });

  describe('Máquina de Estados: Permissões, Visibilidade e Bloqueios', () => {
    type PerfilNome = 'DF' | 'EMFORPEF' | 'Admin DF' | 'Cursista';

    const simularEstadoUI = (
      perfilNome: PerfilNome,
      status: number | null,
      modoEdicao: boolean,
      mostrarDivergencia: boolean,
      formValido: boolean,
    ) => {
      const perfil = {
        df: perfilNome === 'DF',
        emforpef: perfilNome === 'EMFORPEF',
        admin: perfilNome === 'Admin DF',
        cursista: perfilNome === 'Cursista',
      };

      const ehAreaPromotora = !perfil.cursista && !perfil.admin;

      const situacao = {
        iniciado: status === 1,
        aguardandoDF: status === 2,
        devolvidoDF: status === 3,
        finalizado: status === 4,
      };

      const bloqueioDivergenciaSalvar = modoEdicao && (situacao.iniciado || situacao.aguardandoDF) && mostrarDivergencia;
      const bloqueioDivergenciaEnviarDF = modoEdicao && mostrarDivergencia;

      return {
        salvar: {
          visivel: (!situacao.aguardandoDF || (situacao.aguardandoDF && perfil.admin)) && !situacao.finalizado,
          bloqueado: situacao.finalizado || bloqueioDivergenciaSalvar,
        },
        enviarDF: {
          visivel: (situacao.iniciado || status === null || situacao.devolvidoDF) && ehAreaPromotora,
          bloqueado: situacao.finalizado || !!bloqueioDivergenciaEnviarDF,
        },
        devolver: {
          visivel: situacao.aguardandoDF && perfil.admin,
          bloqueado: !formValido || situacao.finalizado,
        },
      };
    };

    describe('Regras do Botão "Salvar"', () => {
      test('DadoPerfilAreaPromotoraStatusIniciado_QuandoCalcularBloqueios_EntaoSalvarVisivel', () => {
        // Arrange / Act
        const ui = simularEstadoUI('EMFORPEF', 1, true, false, true);

        // Assert
        expect(ui.salvar.visivel).toBe(true);
      });

      test('DadoPerfilAreaPromotoraStatusAguardandoDF_QuandoCalcularBloqueios_EntaoSalvarOculto', () => {
        // Arrange / Act
        const ui = simularEstadoUI('EMFORPEF', 2, true, false, true);

        // Assert
        expect(ui.salvar.visivel).toBe(false);
      });

      test('DadoPerfilAdminStatusAguardandoDF_QuandoCalcularBloqueios_EntaoSalvarVisivel', () => {
        // Arrange / Act
        const ui = simularEstadoUI('Admin DF', 2, true, false, true);

        // Assert
        expect(ui.salvar.visivel).toBe(true);
      });

      test('DadoStatusFinalizado_QuandoCalcularBloqueios_EntaoSalvarBloqueado', () => {
        // Arrange / Act
        const ui = simularEstadoUI('DF', 4, true, false, true);

        // Assert
        expect(ui.salvar.visivel).toBe(false);
        expect(ui.salvar.bloqueado).toBe(true);
      });

      test('DadoDivergenciaAtivaNaEdicao_QuandoCalcularBloqueios_EntaoSalvarBloqueado', () => {
        // Arrange / Act
        const ui = simularEstadoUI('EMFORPEF', 1, true, true, true);

        // Assert
        expect(ui.salvar.bloqueado).toBe(true);
      });
    });

    describe('Regras do Botão "Enviar para DF"', () => {
      test('DadoPerfilAreaPromotoraStatusIniciado_QuandoCalcularBloqueios_EntaoEnviarDFVisivel', () => {
        // Arrange / Act
        const ui = simularEstadoUI('EMFORPEF', 1, true, false, true);

        // Assert
        expect(ui.enviarDF.visivel).toBe(true);
      });

      test('DadoPerfilAreaPromotoraStatusDevolvido_QuandoCalcularBloqueios_EntaoEnviarDFVisivel', () => {
        // Arrange / Act
        const ui = simularEstadoUI('EMFORPEF', 3, true, false, true);

        // Assert
        expect(ui.enviarDF.visivel).toBe(true);
      });

      test('DadoPerfilAdminDF_QuandoCalcularBloqueios_EntaoEnviarDFOculto', () => {
        // Arrange / Act
        const ui = simularEstadoUI('Admin DF', 1, true, false, true);

        // Assert
        expect(ui.enviarDF.visivel).toBe(false);
      });

      test('DadoDivergenciaAtiva_QuandoCalcularBloqueios_EntaoEnviarDFBloqueado', () => {
        // Arrange / Act
        const ui = simularEstadoUI('EMFORPEF', 1, true, true, true);

        // Assert
        expect(ui.enviarDF.bloqueado).toBe(true);
      });

      test('DadoPerfilDFStatusIniciado_QuandoCalcularBloqueios_EntaoEnviarDFVisivel', () => {
        // Arrange / Act
        const ui = simularEstadoUI('DF', 1, true, false, true);

        // Assert
        expect(ui.enviarDF.visivel).toBe(true);
      });

      test('DadoStatusNulo_QuandoCalcularBloqueios_EntaoEnviarDFVisivel', () => {
        // Arrange / Act
        const ui = simularEstadoUI('EMFORPEF', null, true, false, true);

        // Assert
        expect(ui.enviarDF.visivel).toBe(true);
      });
    });

    describe('Regras do Botão "Devolver" (Correção)', () => {
      test('DadoPerfilAdminStatusAguardandoDFFormValido_QuandoCalcularBloqueios_EntaoDevolverVisivelEHabilitado', () => {
        // Arrange / Act
        const ui = simularEstadoUI('Admin DF', 2, true, false, true);

        // Assert
        expect(ui.devolver.visivel).toBe(true);
        expect(ui.devolver.bloqueado).toBe(false);
      });

      test('DadoPerfilAdminFormInvalido_QuandoCalcularBloqueios_EntaoDevolverBloqueado', () => {
        // Arrange / Act
        const ui = simularEstadoUI('Admin DF', 2, true, false, false);

        // Assert
        expect(ui.devolver.visivel).toBe(true);
        expect(ui.devolver.bloqueado).toBe(true);
      });

      test('DadoPerfilAreaPromotora_QuandoCalcularBloqueios_EntaoDevolverOculto', () => {
        // Arrange / Act
        const ui = simularEstadoUI('EMFORPEF', 2, true, false, true);

        // Assert
        expect(ui.devolver.visivel).toBe(false);
      });
    });

  });

  describe('CodafUtils - Motor de Regras de Certificacao (calcularAprovacao)', () => {
  
  const regrasBaseMock: RegrasAprovacaoCursistaCodafDto = {
    frequenciaMinima: 75,
    conceitosAceitos: ['S', 'P'],
    exigeAtividadeObrigatoria: true,
    possuiRegraAvaliacao: true
  };

  test('DadoRegrasNaoDefinidasQuandoCalcularEntaoRetornaNulo', () => {
    // Arrange
    const regrasNulas = undefined;

    // Act
    const resultado = calcularAprovacao(100, 'S', 'S', regrasNulas);

    // Assert
    expect(resultado).toBeNull();
  });

  test('DadoPossuiRegraAvaliacaoFalsoQuandoCalcularEntaoRetornaNulo', () => {
    // Arrange
    const regrasVazias: RegrasAprovacaoCursistaCodafDto = { ...regrasBaseMock, possuiRegraAvaliacao: false };

    // Act
    const resultado = calcularAprovacao(100, 'S', 'S', regrasVazias);

    // Assert
    expect(resultado).toBeNull();
  });

  test('DadoFrequenciaAbaixoDoMinimoQuandoCalcularEntaoRetornaFalso', () => {
    // Arrange
    const frequenciaReprovacao = 74;

    // Act
    const resultado = calcularAprovacao(frequenciaReprovacao, 'S', 'S', regrasBaseMock);

    // Assert
    expect(resultado).toBe(false);
  });

  test('DadoConceitoForaDosAceitosQuandoCalcularEntaoRetornaFalso', () => {
    // Arrange
    const conceitoFinalInvalido = 'NS';

    // Act
    const resultado = calcularAprovacao(100, conceitoFinalInvalido, 'S', regrasBaseMock);

    // Assert
    expect(resultado).toBe(false);
  });

  test('DadoConceitoNuloQuandoRegraExigeConceitoEntaoRetornaFalso', () => {
    // Arrange
    const conceitoFinalNulo = null;

    // Act
    const resultado = calcularAprovacao(100, conceitoFinalNulo, 'S', regrasBaseMock);

    // Assert
    expect(resultado).toBe(false);
  });

  test('DadoAtividadeObrigatoriaNaoRealizadaQuandoCalcularEntaoRetornaFalso', () => {
    // Arrange
    const atividadeNaoRealizada = 'N';

    // Act
    const resultado = calcularAprovacao(100, 'P', atividadeNaoRealizada, regrasBaseMock);

    // Assert
    expect(resultado).toBe(false);
  });

  test('DadoTodasAsRegrasSatisfeitasQuandoCalcularEntaoRetornaVerdadeiro', () => {
    // Arrange
    const frequenciaValida = 80;
    const conceitoValido = 'P';
    const atividadeRealizada = 'S';

    // Act
    const resultado = calcularAprovacao(frequenciaValida, conceitoValido, atividadeRealizada, regrasBaseMock);

    // Assert
    expect(resultado).toBe(true);
  });

  test('DadoRegraSemExigenciaDeAtividadeQuandoAvaliarComAtividadeNaoRealizadaEntaoRetornaVerdadeiro', () => {
    // Arrange
    const regrasSemAtividade = { ...regrasBaseMock, exigeAtividadeObrigatoria: false };

    // Act
    const resultado = calcularAprovacao(100, 'S', 'N', regrasSemAtividade);

    // Assert
    expect(resultado).toBe(true);
  });

  test('DadoRegraSemExigenciaDeConceitoQuandoAvaliarComQualquerConceitoEntaoRetornaVerdadeiro', () => {
    // Arrange
    const regrasSemConceito = { ...regrasBaseMock, conceitosAceitos: [] };

    // Act
    const resultado = calcularAprovacao(100, 'NS', 'S', regrasSemConceito);

    // Assert
    expect(resultado).toBe(true);
  });
});
});