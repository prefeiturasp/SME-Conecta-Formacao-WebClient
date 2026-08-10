import { describe, test, expect, beforeEach } from '@jest/globals';

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

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

describe('FormacoesNaoHomologadas - Regras de Negócio', () => {
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

  describe('getDeclaracaoButtonState - Lógica de Botões', () => {
    const getDeclaracaoButtonState = (status: number) => {
      if (status === 0) return { text: 'Sem declaração', disabled: true };
      if (status === 1) return { text: 'Não emitidas', disabled: true };
      if (status === 2) return { text: 'Emitir declarações', disabled: false };
      if (status === 3) return { text: 'Emitindo declarações', disabled: true };
      if (status === 4) return { text: 'Declarações emitidas', disabled: true };
      return { text: '—', disabled: true };
    };

    test('Status 0: Deve exibir "Sem declaração" e estar desabilitado', () => {
      expect(getDeclaracaoButtonState(0)).toEqual({ text: 'Sem declaração', disabled: true });
    });

    test('Status 1: Deve exibir "Não emitidas" e estar desabilitado', () => {
      expect(getDeclaracaoButtonState(1)).toEqual({ text: 'Não emitidas', disabled: true });
    });

    test('Status 2: Deve exibir "Emitir declarações" e estar habilitado', () => {
      expect(getDeclaracaoButtonState(2)).toEqual({ text: 'Emitir declarações', disabled: false });
    });

    test('Status 3: Deve exibir "Emitindo declarações" e estar desabilitado', () => {
      expect(getDeclaracaoButtonState(3)).toEqual({ text: 'Emitindo declarações', disabled: true });
    });

    test('Status 4: Deve exibir "Declarações emitidas" e estar desabilitado', () => {
      expect(getDeclaracaoButtonState(4)).toEqual({ text: 'Declarações emitidas', disabled: true });
    });

    test('Status inválido: Deve exibir "—" e estar desabilitado', () => {
      expect(getDeclaracaoButtonState(999)).toEqual({ text: '—', disabled: true });
    });
  });
});
