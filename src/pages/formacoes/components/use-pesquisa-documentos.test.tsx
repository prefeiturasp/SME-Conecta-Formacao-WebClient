/**
 * @jest-environment jsdom
 */

import { act, renderHook, waitFor } from '@testing-library/react';

import { usePesquisaDocumentos } from './use-pesquisa-documentos';
import { notification } from '../../../components/lib/notification';

jest.mock('~/components/lib/notification', () => ({
  notification: {
    error: jest.fn(),
  },
}));

type Registro = { id: number; nome: string };

describe('usePesquisaDocumentos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('busca os dados ao montar e atualiza os estados', async () => {
    const apiCall = jest.fn().mockResolvedValue({
      sucesso: true,
      dados: { items: [{ id: 1, nome: 'A' }, { id: 2, nome: 'B' }], totalRegistros: 2 },
    });

    const { result } = renderHook(() => usePesquisaDocumentos<Registro>(apiCall, 'Erro ao buscar'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(apiCall).toHaveBeenCalledWith(1, 10);
    expect(result.current.dados).toHaveLength(2);
    expect(result.current.totalRegistros).toBe(2);
    expect(result.current.paginaAtual).toBe(1);
  });

  it('seleciona automaticamente a linha quando há apenas um registro', async () => {
    const apiCall = jest.fn().mockResolvedValue({
      sucesso: true,
      dados: { items: [{ id: 7, nome: 'Único' }], totalRegistros: 1 },
    });

    const { result } = renderHook(() => usePesquisaDocumentos<Registro>(apiCall, 'Erro ao buscar'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.selectedRowKeys).toEqual([7]);
  });

  it('limpa os dados quando a resposta não é bem-sucedida', async () => {
    const apiCall = jest.fn().mockResolvedValue({ sucesso: false });

    const { result } = renderHook(() => usePesquisaDocumentos<Registro>(apiCall, 'Erro ao buscar'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.dados).toEqual([]);
    expect(result.current.totalRegistros).toBe(0);
    expect(result.current.selectedRowKeys).toEqual([]);
  });

  it('exibe notificação de erro e limpa os dados quando a chamada rejeita', async () => {
    const apiCall = jest.fn().mockRejectedValue(new Error('falhou'));

    const { result } = renderHook(() => usePesquisaDocumentos<Registro>(apiCall, 'Erro ao buscar documentos'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(notification.error).toHaveBeenCalledWith({
      message: 'Erro',
      description: 'Erro ao buscar documentos',
    });
    expect(result.current.dados).toEqual([]);
    expect(result.current.totalRegistros).toBe(0);
  });

  it('marca filtroAplicado e reseta a seleção ao clicar em filtrar', async () => {
    const apiCall = jest.fn().mockResolvedValue({
      sucesso: true,
      dados: { items: [{ id: 1, nome: 'A' }, { id: 2, nome: 'B' }], totalRegistros: 2 },
    });

    const { result } = renderHook(() => usePesquisaDocumentos<Registro>(apiCall, 'Erro ao buscar'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setSelectedRowKeys([1]);
    });

    await act(async () => {
      result.current.onClickFiltrar();
    });

    await waitFor(() => {
      expect(result.current.filtroAplicado).toBe(true);
    });

    expect(apiCall).toHaveBeenLastCalledWith(1, 10);
  });

  it('busca a nova página quando handleTableChange mantém o mesmo tamanho de página', async () => {
    const apiCall = jest.fn().mockResolvedValue({
      sucesso: true,
      dados: { items: [{ id: 1, nome: 'A' }], totalRegistros: 1 },
    });

    const { result } = renderHook(() => usePesquisaDocumentos<Registro>(apiCall, 'Erro ao buscar'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      result.current.handleTableChange({ current: 2, pageSize: 10 });
    });

    await waitFor(() => {
      expect(apiCall).toHaveBeenLastCalledWith(2, 10);
    });
  });

  it('atualiza registrosPorPagina e reseta a página quando handleTableChange muda o tamanho da página', async () => {
    const apiCall = jest.fn().mockResolvedValue({
      sucesso: true,
      dados: { items: [{ id: 1, nome: 'A' }], totalRegistros: 1 },
    });

    const { result } = renderHook(() => usePesquisaDocumentos<Registro>(apiCall, 'Erro ao buscar'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.handleTableChange({ current: 2, pageSize: 20 });
    });

    await waitFor(() => {
      expect(result.current.registrosPorPagina).toBe(20);
    });

    expect(apiCall).toHaveBeenLastCalledWith(1, 20);
  });

  it('atualiza a seleção de linhas via rowSelection.onChange', async () => {
    const apiCall = jest.fn().mockResolvedValue({
      sucesso: true,
      dados: { items: [{ id: 1, nome: 'A' }, { id: 2, nome: 'B' }], totalRegistros: 2 },
    });

    const { result } = renderHook(() => usePesquisaDocumentos<Registro>(apiCall, 'Erro ao buscar'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.rowSelection.onChange([2]);
    });

    expect(result.current.selectedRowKeys).toEqual([2]);
  });
});
