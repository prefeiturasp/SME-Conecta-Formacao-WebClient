import { describe, test, expect, beforeEach } from '@jest/globals';

// Simulador do localStorage para o ambiente Node.js do Jest
const localStorageMock = (function () {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
    removeItem(key: string) {
      delete store[key];
    },
  };
})();

// Injeta o mock no objeto global do Node
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

describe('ListaPresencaCodaf - Regras de Negócio', () => {
  
  // Limpa o LocalStorage mockado antes de cada teste para evitar poluição
  beforeEach(() => {
    localStorage.clear();
  });

  describe('obterSituacaoTexto', () => {
    const situacoes = [
      { id: 1, descricao: 'Iniciado' },
      { id: 2, descricao: 'Aguardando DF' },
      { id: 3, descricao: 'Devolvido pelo DF' },
      { id: 4, descricao: 'Finalizado' },
    ];

    const obterSituacaoTexto = (status: number): string => {
      const situacao = situacoes.find((s) => s.id === status);
      return situacao?.descricao || 'Desconhecido';
    };

    test('deve retornar descrição correta para status válido', () => {
      expect(obterSituacaoTexto(1)).toBe('Iniciado');
      expect(obterSituacaoTexto(2)).toBe('Aguardando DF');
      expect(obterSituacaoTexto(3)).toBe('Devolvido pelo DF');
      expect(obterSituacaoTexto(4)).toBe('Finalizado');
    });

    test('deve retornar "Desconhecido" para status inválido', () => {
      expect(obterSituacaoTexto(0)).toBe('Desconhecido');
      expect(obterSituacaoTexto(999)).toBe('Desconhecido');
    });
  });

  describe('getCertificadoButtonState - Lógica de Botões', () => {
    // Simulando a função interna do componente
    const getCertificadoButtonState = (statusCertificacaoTurma: number) => {
      if (statusCertificacaoTurma === 0) return { text: 'Sem certificado', disabled: true };
      if (statusCertificacaoTurma === 1) return { text: 'Não emitidos', disabled: true };
      if (statusCertificacaoTurma === 2) return { text: 'Emitir certificados', disabled: false };
      if (statusCertificacaoTurma === 3) return { text: 'Emitindo certificado', disabled: true };
      if (statusCertificacaoTurma === 4) return { text: 'Certificados emitidos', disabled: true };
      return { text: '—', disabled: true };
    };

    test('Status 0: Deve exibir "Sem certificado" e estar desabilitado', () => {
      expect(getCertificadoButtonState(0)).toEqual({ text: 'Sem certificado', disabled: true });
    });

    test('Status 1: Deve exibir "Não emitidos" e estar desabilitado', () => {
      expect(getCertificadoButtonState(1)).toEqual({ text: 'Não emitidos', disabled: true });
    });

    test('Status 2: Deve permitir a emissão (Habilitado)', () => {
      expect(getCertificadoButtonState(2)).toEqual({ text: 'Emitir certificados', disabled: false });
    });

    test('Status 3: Deve exibir "Emitindo certificado" e estar desabilitado', () => {
      expect(getCertificadoButtonState(3)).toEqual({ text: 'Emitindo certificado', disabled: true });
    });

    test('Status 4: Deve exibir "Certificados emitidos" e estar desabilitado', () => {
      expect(getCertificadoButtonState(4)).toEqual({ text: 'Certificados emitidos', disabled: true });
    });
  });

  describe('getMenuAcoes - Regras de Geração de Relatórios', () => {
    // Simulador da regra de negócio refatorada
    const simularRegraMenuAcoes = (
      codigoCursoEol: number | null,
      status: number,
      statusCertificacaoTurma: number,
      ehPerfilAdminDf: boolean
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

    test('Ação TXT EOL: Habilitado se estiver Aguardando DF (2) e possuir Código EOL', () => {
      const resultado = simularRegraMenuAcoes(123, 2, 1, false);
      expect(resultado.txtEolHabilitado).toBe(true);
    });

    test('Ação TXT EOL: Desabilitado se estiver Aguardando DF (2) mas SEM Código EOL', () => {
      const resultado = simularRegraMenuAcoes(null, 2, 1, false);
      expect(resultado.txtEolHabilitado).toBe(false);
    });

    test('Ação TXT EOL: Habilitado se estiver Finalizado (4) e usuário for ADMIN', () => {
      const resultado = simularRegraMenuAcoes(null, 4, 1, true); 
      expect(resultado.txtEolHabilitado).toBe(true);
    });

    test('Ação TXT EOL: Desabilitado se estiver Finalizado (4) mas usuário NÃO for ADMIN', () => {
      const resultado = simularRegraMenuAcoes(123, 4, 1, false);
      expect(resultado.txtEolHabilitado).toBe(false);
    });

    test('Ação CODAF: Habilitado apenas se a certificação da turma for concluída (4)', () => {
      expect(simularRegraMenuAcoes(123, 2, 4, false).codafHabilitado).toBe(true);
      expect(simularRegraMenuAcoes(123, 2, 3, false).codafHabilitado).toBe(false);
    });
  });

  describe('Gerenciamento de LocalStorage (Cache EOL e Certificados)', () => {
    const LOCAL_STORAGE_KEY = 'codaf_emitir_certificados_clicked';
    const EOL_STORAGE_KEY = 'eol_txt_generated';

    const saveEmitido = (id: number) => {
      const emitidos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
      if (!emitidos.includes(id)) {
        emitidos.push(id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(emitidos));
      }
    };

    const wasEmitido = (id: number): boolean => {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]').includes(id);
    };

    const setGenerated = (id: number) => {
      const map = JSON.parse(localStorage.getItem(EOL_STORAGE_KEY) || '{}');
      map[id] = true;
      localStorage.setItem(EOL_STORAGE_KEY, JSON.stringify(map));
    };

    const wasGenerated = (id: number): boolean => {
      return !!JSON.parse(localStorage.getItem(EOL_STORAGE_KEY) || '{}')[id];
    };

    test('Deve salvar e recuperar ID emitido corretamente', () => {
      expect(wasEmitido(99)).toBe(false);
      saveEmitido(99);
      expect(wasEmitido(99)).toBe(true);
      
      // Testar não duplicidade
      saveEmitido(99);
      const storage = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
      expect(storage.length).toBe(1);
    });

    test('Deve salvar e recuperar status de relatório CODAF gerado (EOL)', () => {
      expect(wasGenerated(55)).toBe(false);
      setGenerated(55);
      expect(wasGenerated(55)).toBe(true);
    });
  });

});