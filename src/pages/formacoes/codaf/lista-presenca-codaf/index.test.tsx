import { describe, test, expect, beforeEach } from '@jest/globals';

// ─── Helpers extraídos da lógica do componente ───────────────────────────────

const SITUACOES = [
  { id: 1, descricao: 'Iniciado' },
  { id: 2, descricao: 'Aguardando DF' },
  { id: 3, descricao: 'Devolvido pelo DF' },
  { id: 4, descricao: 'Finalizado' },
];

const obterSituacaoTexto = (status: number): string =>
  SITUACOES.find((s) => s.id === status)?.descricao || 'Desconhecido';

const getCertificadoButtonState = (statusCertificacaoTurma: number) => {
  if (statusCertificacaoTurma === 0) return { text: 'Sem certificado', disabled: true };
  if (statusCertificacaoTurma === 1) return { text: 'Não emitidos', disabled: true };
  if (statusCertificacaoTurma === 2) return { text: 'Emitir certificados', disabled: false };
  if (statusCertificacaoTurma === 3) return { text: 'Emitindo certificado', disabled: true };
  if (statusCertificacaoTurma === 4) return { text: 'Certificados emitidos', disabled: true };
  return { text: '—', disabled: true };
};

// ─────────────────────────────────────────────────────────────────────────────

describe('ListaPresencaCodaf - Regras de Negócio', () => {
  describe('obterSituacaoTexto', () => {
    test('DadoStatusValido_QuandoObterSituacao_EntaoRetornaDescricaoCorreta', () => {
      // Arrange / Act / Assert
      expect(obterSituacaoTexto(1)).toBe('Iniciado');
      expect(obterSituacaoTexto(2)).toBe('Aguardando DF');
      expect(obterSituacaoTexto(3)).toBe('Devolvido pelo DF');
      expect(obterSituacaoTexto(4)).toBe('Finalizado');
    });

    test('DadoStatusInvalido_QuandoObterSituacao_EntaoRetornaDesconhecido', () => {
      // Arrange / Act / Assert
      expect(obterSituacaoTexto(0)).toBe('Desconhecido');
      expect(obterSituacaoTexto(999)).toBe('Desconhecido');
    });
  });

  describe('getCertificadoButtonState', () => {
    test('DadoStatusZero_QuandoObterEstadoBotao_EntaoSemCertificadoDesabilitado', () => {
      // Arrange / Act / Assert
      expect(getCertificadoButtonState(0)).toEqual({ text: 'Sem certificado', disabled: true });
    });

    test('DadoStatusUm_QuandoObterEstadoBotao_EntaoNaoEmitidosDesabilitado', () => {
      // Arrange / Act / Assert
      expect(getCertificadoButtonState(1)).toEqual({ text: 'Não emitidos', disabled: true });
    });

    test('DadoStatusDois_QuandoObterEstadoBotao_EntaoEmitirHabilitado', () => {
      // Arrange / Act / Assert
      expect(getCertificadoButtonState(2)).toEqual({ text: 'Emitir certificados', disabled: false });
    });

    test('DadoStatusTres_QuandoObterEstadoBotao_EntaoEmitindoDesabilitado', () => {
      // Arrange / Act / Assert
      expect(getCertificadoButtonState(3)).toEqual({ text: 'Emitindo certificado', disabled: true });
    });

    test('DadoStatusQuatro_QuandoObterEstadoBotao_EntaoCertificadosEmitidosDesabilitado', () => {
      // Arrange / Act / Assert
      expect(getCertificadoButtonState(4)).toEqual({ text: 'Certificados emitidos', disabled: true });
    });
  });

  describe('getMenuAcoes', () => {
    const simularRegraMenuAcoes = (
      codigoCursoEol: number | null,
      status: number,
      statusCertificacaoTurma: number,
      ehPerfilAdminDf: boolean,
    ) => {
      const hasCodigoCursoEol = codigoCursoEol != null;
      const isAguardandoDF = status === 2;
      const isFinalizado = status === 4;
      const isCertificacaoConcluida = statusCertificacaoTurma === 4;

      const podeGerarComoComum = isAguardandoDF && hasCodigoCursoEol;
      const podeGerarComoAdmin = isFinalizado && ehPerfilAdminDf;
      const podeGerarTxtEol = podeGerarComoComum || podeGerarComoAdmin;

      return {
        txtEolHabilitado: podeGerarTxtEol,
        codafHabilitado: isCertificacaoConcluida,
      };
    };

    test('DadoStatusAguardandoDFComEolCode_QuandoAvaliarMenu_EntaoTxtEolHabilitado', () => {
      // Arrange
      const codigoCursoEol = 123;
      const status = 2;

      // Act
      const resultado = simularRegraMenuAcoes(codigoCursoEol, status, 1, false);

      // Assert
      expect(resultado.txtEolHabilitado).toBe(true);
    });

    test('DadoStatusAguardandoDF_SemEolCode_QuandoAvaliarMenu_EntaoTxtEolDesabilitado', () => {
      // Arrange
      const codigoCursoEol = null;
      const status = 2;

      // Act
      const resultado = simularRegraMenuAcoes(codigoCursoEol, status, 1, false);

      // Assert
      expect(resultado.txtEolHabilitado).toBe(false);
    });

    test('DadoStatusFinalizadoEPerfilAdmin_QuandoAvaliarMenu_EntaoTxtEolHabilitado', () => {
      // Arrange
      const status = 4;

      // Act
      const resultado = simularRegraMenuAcoes(null, status, 1, true);

      // Assert
      expect(resultado.txtEolHabilitado).toBe(true);
    });

    test('DadoStatusFinalizadoSemAdmin_QuandoAvaliarMenu_EntaoTxtEolDesabilitado', () => {
      // Arrange
      const status = 4;

      // Act
      const resultado = simularRegraMenuAcoes(123, status, 1, false);

      // Assert
      expect(resultado.txtEolHabilitado).toBe(false);
    });

    test('DadoStatusNemAguardandoNemFinalizado_QuandoAvaliarMenu_EntaoTxtEolDesabilitado', () => {
      // Arrange
      const status = 1;

      // Act
      const resultadoComEol = simularRegraMenuAcoes(123, status, 1, false);
      const resultadoAdminSemEol = simularRegraMenuAcoes(null, status, 1, true);

      // Assert
      expect(resultadoComEol.txtEolHabilitado).toBe(false);
      expect(resultadoAdminSemEol.txtEolHabilitado).toBe(false);
    });

    test('DadoCertificacaoConcluida_QuandoAvaliarMenu_EntaoCodafHabilitado', () => {
      // Arrange / Act / Assert
      expect(simularRegraMenuAcoes(123, 2, 4, false).codafHabilitado).toBe(true);
      expect(simularRegraMenuAcoes(123, 2, 3, false).codafHabilitado).toBe(false);
    });
  });

  describe('Gerenciamento de LocalStorage', () => {
    const LOCAL_STORAGE_KEY = 'codaf_emitir_certificados_clicked';
    const EOL_STORAGE_KEY = 'eol_txt_generated';

    const localStorageMock = (() => {
      let store: Record<string, string> = {};
      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value; },
        clear: () => { store = {}; },
      };
    })();

    Object.defineProperty(global, 'localStorage', { value: localStorageMock, configurable: true });

    const saveEmitido = (id: number) => {
      const emitidos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
      if (!emitidos.includes(id)) {
        emitidos.push(id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(emitidos));
      }
    };

    const wasEmitido = (id: number): boolean =>
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]').includes(id);

    const setGenerated = (id: number) => {
      const map = JSON.parse(localStorage.getItem(EOL_STORAGE_KEY) || '{}');
      map[id] = true;
      localStorage.setItem(EOL_STORAGE_KEY, JSON.stringify(map));
    };

    const wasGenerated = (id: number): boolean =>
      !!JSON.parse(localStorage.getItem(EOL_STORAGE_KEY) || '{}')[id];

    beforeEach(() => localStorage.clear());

    test('DadoIdNaoEmitido_QuandoSalvarEConsultar_EntaoRetornaVerdadeiro', () => {
      // Arrange
      expect(wasEmitido(99)).toBe(false);

      // Act
      saveEmitido(99);

      // Assert
      expect(wasEmitido(99)).toBe(true);
    });

    test('DadoIdJaSalvo_QuandoSalvarNovamente_EntaoNaoDuplica', () => {
      // Arrange
      saveEmitido(99);

      // Act
      saveEmitido(99);

      // Assert
      const storage = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
      expect(storage.length).toBe(1);
    });

    test('DadoIdNaoGerado_QuandoSalvarEConsultar_EntaoRetornaVerdadeiro', () => {
      // Arrange
      expect(wasGenerated(55)).toBe(false);

      // Act
      setGenerated(55);

      // Assert
      expect(wasGenerated(55)).toBe(true);
    });
  });
});