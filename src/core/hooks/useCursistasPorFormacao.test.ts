/**
 * @jest-environment jsdom
 */
import { renderHook, waitFor } from '@testing-library/react';
import { useCursistasPorFormacao } from './useCursistasPorFormacao';
import api from '~/core/services/api';

jest.mock('~/core/services/api', () => ({
  get: jest.fn(),
}));

describe('useCursistasPorFormacao', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not fetch when idFormacao is null', () => {
    const { result } = renderHook(() =>
      useCursistasPorFormacao({ idFormacao: null }),
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual([]);
    expect(api.get).not.toHaveBeenCalled();
  });

  it('should fetch and return cursistas on success', async () => {
    const mockItems = [
      {
        inscricaoId: 1,
        nomeCursista: 'João Silva',
        registroFuncional: '123456',
        cpf: '000.000.000-00',
        situacao: 'Confirmado',
        nomeTurma: 'Turma A',
      },
    ];

    (api.get as jest.Mock).mockResolvedValue({
      data: { items: mockItems, totalRegistros: 1 },
    });

    const { result } = renderHook(() =>
      useCursistasPorFormacao({ idFormacao: 1 }),
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0].nomeCursista).toBe('João Silva');
    expect(result.current.data[0].registroFuncional).toBe('123456');
    expect(result.current.total).toBe(1);
    expect(result.current.error).toBeNull();
  });

  it('should set error on API failure', async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() =>
      useCursistasPorFormacao({ idFormacao: 1 }),
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Erro ao carregar cursistas');
    expect(result.current.data).toEqual([]);
  });

  it('should pass optional filters to API', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: { items: [] } });

    renderHook(() =>
      useCursistasPorFormacao({
        idFormacao: 5,
        cpf: '111.111.111-11',
        nomeCursista: 'Maria',
        registroFuncional: '999',
        turmasId: 10,
      }),
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        '/v1/Inscricao/5',
        expect.objectContaining({
          params: expect.objectContaining({
            cpf: '111.111.111-11',
            nomeCursista: 'Maria',
            registroFuncional: '999',
            turmasId: 10,
          }),
          headers: expect.objectContaining({
            numeroPagina: 1,
            numeroRegistros: 10,
          }),
        }),
      );
    });
  });

  it('should use default pagination values', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: { items: [] } });

    renderHook(() => useCursistasPorFormacao({ idFormacao: 2 }));

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        '/v1/Inscricao/2',
        expect.objectContaining({
          headers: { numeroPagina: 1, numeroRegistros: 10 },
        }),
      );
    });
  });

  it('should refetch when refreshKey changes', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: { items: [] } });

    const { rerender } = renderHook(
      ({ refreshKey }) =>
        useCursistasPorFormacao({ idFormacao: 1, refreshKey }),
      { initialProps: { refreshKey: 0 } },
    );

    await waitFor(() => expect(api.get).toHaveBeenCalledTimes(1));

    rerender({ refreshKey: 1 });

    await waitFor(() => expect(api.get).toHaveBeenCalledTimes(2));
  });

  it('should handle response with no totalRegistros', async () => {
    (api.get as jest.Mock).mockResolvedValue({
      data: { items: [] },
    });

    const { result } = renderHook(() =>
      useCursistasPorFormacao({ idFormacao: 1 }),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.total).toBe(0);
  });
});
