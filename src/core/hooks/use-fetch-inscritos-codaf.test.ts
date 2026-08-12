/**
 * @jest-environment jsdom
 */
import { renderHook, act, waitFor } from '@testing-library/react';
import { useFetchInscritosCodaf } from './use-fetch-inscritos-codaf';
import { notification } from '~/components/lib/notification';

if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (val: any) => JSON.parse(JSON.stringify(val));
}
jest.mock('~/components/lib/notification', () => ({
  notification: { success: jest.fn(), error: jest.fn(), warning: jest.fn() }
}));

const mockNotification = notification as any;

const mockObterInscritosTurma = jest.fn();
jest.mock('../services/codaf-nao-homologado-service', () => ({
  obterInscritosTurma: (...args) => mockObterInscritosTurma(...args),
}));

const mockMapper = jest.fn((item) => ({ id: item.id, nome: item.nome }));
const mockSetPagina = jest.fn();

const renderHookFetch = (turmaId) =>
  renderHook(() => useFetchInscritosCodaf(turmaId, 10, mockSetPagina, mockMapper));

const mkResposta = (items = [], total = 0) => ({
  sucesso: true,
  dados: { items, totalRegistros: total },
});

describe('useFetchInscritosCodaf', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('turmaId indefinido', () => {
    it('DadoTurmaIdUndefined_QuandoInicializar_EntaoNaoChamaApiERetornaVazio', async () => {
      const { result } = renderHookFetch(undefined);
      await waitFor(() => expect(result.current.loadingInscritos).toBe(false));
      expect(mockObterInscritosTurma).not.toHaveBeenCalled();
      expect(result.current.cursistas).toEqual([]);
      expect(result.current.totalRegistros).toBe(0);
      expect(mockSetPagina).toHaveBeenCalledWith(1);
    });
  });

  describe('busca com sucesso', () => {
    it('DadoTurmaIdDefinido_QuandoBuscar_EntaoRetornaCursistasETotal', async () => {
      const items = [{ id: 1, nome: 'João' }, { id: 2, nome: 'Maria' }];
      mockObterInscritosTurma.mockResolvedValue(mkResposta(items, 2));
      const { result } = renderHookFetch(100);
      await waitFor(() => expect(result.current.loadingInscritos).toBe(false));
      expect(mockObterInscritosTurma).toHaveBeenCalledWith(100, 1, 99999);
      expect(result.current.cursistas).toHaveLength(2);
      expect(result.current.totalRegistros).toBe(2);
      expect(mockSetPagina).toHaveBeenCalledWith(1);
    });

    it('DadoMapperDefinido_QuandoBuscar_EntaoChamaMapperParaCadaItem', async () => {
      const items = [{ id: 1, nome: 'A' }];
      mockObterInscritosTurma.mockResolvedValue(mkResposta(items, 1));
      const { result } = renderHookFetch(5);
      await waitFor(() => expect(result.current.loadingInscritos).toBe(false));
      expect(mockMapper).toHaveBeenCalledTimes(1);
      expect(mockMapper).toHaveBeenCalledWith({ id: 1, nome: 'A' }, 0, [{ id: 1, nome: 'A' }]);
    });
  });

  describe('busca sem sucesso', () => {
    it('DadoRespostaSemSucesso_QuandoBuscar_EntaoShowWarningERetornaVazio', async () => {
      mockObterInscritosTurma.mockResolvedValue({ sucesso: false, dados: null });
      const { result } = renderHookFetch(10);
      await waitFor(() => expect(result.current.loadingInscritos).toBe(false));
      expect(result.current.cursistas).toEqual([]);
      expect(result.current.totalRegistros).toBe(0);
      expect(mockNotification.warning).toHaveBeenCalledTimes(1);
    });

    it('DadoExcecaoDeRede_QuandoBuscar_EntaoShowErroERetornaVazio', async () => {
      mockObterInscritosTurma.mockRejectedValue(new Error('network'));
      const { result } = renderHookFetch(10);
      await waitFor(() => expect(result.current.loadingInscritos).toBe(false));
      expect(result.current.cursistas).toEqual([]);
      expect(result.current.totalRegistros).toBe(0);
      expect(mockNotification.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('loading', () => {
    it('DadoTurmaIdDefinido_QuandoIniciarBusca_EntaoLoadingViraVerdadeiroDepoisFalso', async () => {
      let resolver: (v: any) => void;
      const promise = new Promise((res) => { resolver = res; });
      mockObterInscritosTurma.mockReturnValue(promise);
      const { result } = renderHookFetch(7);
      expect(result.current.loadingInscritos).toBe(true);
      await act(async () => { resolver!(mkResposta([], 0)); await promise; });
      expect(result.current.loadingInscritos).toBe(false);
    });
  });

  describe('recarregarInscritos', () => {
    it('DadoChomadaManual_QuandoRecarregar_EntaoBuscaNovamente', async () => {
      mockObterInscritosTurma.mockResolvedValue(mkResposta([{ id: 99, nome: 'Z' }], 1));
      const { result } = renderHookFetch(20);
      await waitFor(() => expect(result.current.loadingInscritos).toBe(false));
      const primeiraCount = mockObterInscritosTurma.mock.calls.length;
      await act(async () => { await result.current.recarregarInscritos(); });
      expect(mockObterInscritosTurma.mock.calls.length).toBeGreaterThan(primeiraCount);
    });
  });
});
