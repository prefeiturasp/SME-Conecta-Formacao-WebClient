import { describe, test, expect, beforeEach } from '@jest/globals';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
    removeItem: (key: string) => { delete store[key]; },
  };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

/* ---- helpers replicando lógica do componente ---- */
const STATUS_LISTA = [
  { id: 1, descricao: 'Iniciado' },
  { id: 2, descricao: 'Aguardando finalização' },
  { id: 3, descricao: 'Finalizado' },
];

const obterSituacaoTexto = (idStatus: number): string =>
  STATUS_LISTA.find((s) => s.id === idStatus)?.descricao || 'Desconhecido';

const sanitizarNumero = (valor: string): number =>
  Number(valor.trim().replaceAll(/\D/g, ''));

const lidarComAlteracoesDaTabela = (
  paginacao: { pageSize: number; current: number },
  registrosApiPorPagina: number,
) => {
  if (paginacao.pageSize !== registrosApiPorPagina) {
    return { paginaCorrente: 1, registrosApiPorPagina: paginacao.pageSize, deveBuscar: false };
  }
  return { paginaCorrente: paginacao.current, registrosApiPorPagina, deveBuscar: true };
};

/* ===================== TESTS ===================== */

describe('FormacoesNaoHomologadas', () => {
  beforeEach(() => localStorage.clear());

  describe('obterSituacaoTexto', () => {
    test('DadoStatusValido_QuandoObterSituacaoTexto_EntaoRetornaDescricaoCorreta', () => {
      // Arrange / Act / Assert
      expect(obterSituacaoTexto(1)).toBe('Iniciado');
      expect(obterSituacaoTexto(2)).toBe('Aguardando finalização');
      expect(obterSituacaoTexto(3)).toBe('Finalizado');
    });

    test('DadoStatusInvalido_QuandoObterSituacaoTexto_EntaoRetornaDesconhecido', () => {
      // Arrange / Act / Assert
      expect(obterSituacaoTexto(0)).toBe('Desconhecido');
      expect(obterSituacaoTexto(999)).toBe('Desconhecido');
      expect(obterSituacaoTexto(-1)).toBe('Desconhecido');
    });
  });

  describe('lidarComAlteracoesDaTabela', () => {
    test('DadoPageSizeIgualAoAtual_QuandoAlterarTabela_EntaoAtualizaApenasPaginaAtual', () => {
      // Arrange
      const paginacaoAtual = { pageSize: 10, current: 3 };

      // Act
      const resultado = lidarComAlteracoesDaTabela(paginacaoAtual, 10);

      // Assert
      expect(resultado.paginaCorrente).toBe(3);
      expect(resultado.registrosApiPorPagina).toBe(10);
      expect(resultado.deveBuscar).toBe(true);
    });

    test('DadoPageSizeDiferente_QuandoAlterarTabela_EntaoRedefineParaPaginaUm', () => {
      // Arrange
      const paginacaoNova = { pageSize: 20, current: 2 };

      // Act
      const resultado = lidarComAlteracoesDaTabela(paginacaoNova, 10);

      // Assert
      expect(resultado.paginaCorrente).toBe(1);
      expect(resultado.registrosApiPorPagina).toBe(20);
      expect(resultado.deveBuscar).toBe(false);
    });
  });

  describe('aoSairDoCampoCodigoProposta - sanitização', () => {
    test('DadoValorVazio_QuandoSanitizar_EntaoRetornaZero', () => {
      expect(sanitizarNumero('')).toBe(0);
    });

    test('DadoApenasCaracteresNaoNumericos_QuandoSanitizar_EntaoRetornaZero', () => {
      expect(sanitizarNumero('abc!@#')).toBe(0);
    });

    test('DadoValorNumerico_QuandoSanitizar_EntaoRetornaNumero', () => {
      expect(sanitizarNumero('12345')).toBe(12345);
    });

    test('DadoValorMistoComEspacos_QuandoSanitizar_EntaoExtaiApenasDigitos', () => {
      expect(sanitizarNumero('  AB 123 ')).toBe(123);
    });
  });
});
