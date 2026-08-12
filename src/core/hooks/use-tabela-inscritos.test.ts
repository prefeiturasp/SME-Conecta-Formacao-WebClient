/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useTabelaInscritos } from './use-tabela-inscritos';

const renderHookTabela = () => renderHook(() => useTabelaInscritos());

describe('useTabelaInscritos', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('Estado inicial', () => {
    it('DadoHookRecemCriado_QuandoVerificarEstado_EntaoRetornaValoresDefault', () => {
      const { result } = renderHookTabela();
      expect(result.current.cursistas).toEqual([]);
      expect(result.current.cursistasSelecionadosIds).toEqual([]);
      expect(result.current.paginaAtualInscritos).toBe(1);
      expect(result.current.registrosPorPaginaInscritos).toBe(10);
      expect(result.current.totalRegistrosInscritos).toBe(0);
    });
  });

  describe('handleTableChangeInscritos', () => {
    it('DadoPageSizeIgualAoAtual_QuandoAlterarTabela_EntaoAtualizaApenasPaginaAtual', () => {
      const { result } = renderHookTabela();
      act(() => { result.current.handleTableChangeInscritos({ pageSize: 10, current: 3 }); });
      expect(result.current.paginaAtualInscritos).toBe(3);
      expect(result.current.registrosPorPaginaInscritos).toBe(10);
    });

    it('DadoPageSizeDiferente_QuandoAlterarTabela_EntaoAtualizaRegistrosPorPaginaEPagina', () => {
      const { result } = renderHookTabela();
      act(() => { result.current.handleTableChangeInscritos({ pageSize: 20, current: 2 }); });
      expect(result.current.registrosPorPaginaInscritos).toBe(20);
      expect(result.current.paginaAtualInscritos).toBe(2);
    });

    it('DadoPageSizeAlterado_QuandoAlterarTabela_EntaoNaoPerdePaginaAtual', () => {
      const { result } = renderHookTabela();
      act(() => { result.current.handleTableChangeInscritos({ pageSize: 50, current: 5 }); });
      expect(result.current.registrosPorPaginaInscritos).toBe(50);
      expect(result.current.paginaAtualInscritos).toBe(5);
    });
  });

  describe('getRowSelection', () => {
    it('DadoDisabledTrue_QuandoObterRowSelection_EntaoCheckboxPropsRetornaDisabledTrue', () => {
      const { result } = renderHookTabela();
      const selection = result.current.getRowSelection(true);
      expect(selection.getCheckboxProps()).toEqual({ disabled: true });
    });

    it('DadoDisabledFalse_QuandoObterRowSelection_EntaoCheckboxPropsRetornaDisabledFalse', () => {
      const { result } = renderHookTabela();
      const selection = result.current.getRowSelection(false);
      expect(selection.getCheckboxProps()).toEqual({ disabled: false });
    });

    it('DadoSelecaoAtual_QuandoObterRowSelection_EntaoRetornaSelectedRowKeysAtual', () => {
      const { result } = renderHookTabela();
      act(() => { result.current.setCursistasSelecionadosIds([1, 2, 3]); });
      const selection = result.current.getRowSelection(false);
      expect(selection.selectedRowKeys).toEqual([1, 2, 3]);
    });

    it('DadoOnChangeChomado_QuandoSelecionarLinhas_EntaoAtualizaIds', () => {
      const { result } = renderHookTabela();
      const selection = result.current.getRowSelection(false);
      act(() => { selection.onChange([10, 20], []); });
      expect(result.current.cursistasSelecionadosIds).toEqual([10, 20]);
    });

    it('DadoPreserveSelectedRowKeys_QuandoObterRowSelection_EntaoVerdadeiro', () => {
      const { result } = renderHookTabela();
      const selection = result.current.getRowSelection(false);
      expect(selection.preserveSelectedRowKeys).toBe(true);
    });
  });

  describe('setters expostos', () => {
    it('DadoCursistas_QuandoSetCursistas_EntaoAtualizaEstado', () => {
      const { result } = renderHookTabela();
      const cursistas = [{ id: 1, nome: 'A' }];
      act(() => { result.current.setCursistas(cursistas as any); });
      expect(result.current.cursistas).toEqual(cursistas);
    });

    it('DadoTotalRegistros_QuandoSetTotalRegistrosInscritos_EntaoAtualizaEstado', () => {
      const { result } = renderHookTabela();
      act(() => { result.current.setTotalRegistrosInscritos(99); });
      expect(result.current.totalRegistrosInscritos).toBe(99);
    });
  });
});
