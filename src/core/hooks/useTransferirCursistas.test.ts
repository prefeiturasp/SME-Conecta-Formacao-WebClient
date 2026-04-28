/**
 * @jest-environment jsdom
 */
import { renderHook, act, cleanup } from '@testing-library/react';
import { useTransferirCursistas } from './useTransferirCursistas';
import api from '~/core/services/api';

jest.mock('~/core/services/api', () => ({
  post: jest.fn(),
}));

const mockDados = {
  idFormacaoOrigem: 1,
  idTurmaOrigem: 2,
  idFormacaoDestino: 3,
  idTurmaDestino: 4,
  cursistas: [{ rf: '123456', idInscricao: '789' }],
};

describe('useTransferirCursistas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    cleanup();
    jest.useRealTimers();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useTransferirCursistas());

    expect(result.current.loading).toBe(false);
    expect(result.current.message).toBeNull();
    expect(typeof result.current.transferir).toBe('function');
  });

  it('should set message on successful transfer', async () => {
    (api.post as jest.Mock).mockResolvedValue({
      data: { mensagem: 'Transferência realizada com sucesso!' },
    });

    const { result } = renderHook(() => useTransferirCursistas());

    await act(async () => {
      await result.current.transferir(mockDados);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.message).toBe('Transferência realizada com sucesso!');
  });

  it('should set error message on failure and rethrow', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('Falha na rede'));

    const { result } = renderHook(() => useTransferirCursistas());

    await act(async () => {
      await expect(result.current.transferir(mockDados)).rejects.toThrow(
        'Falha na rede',
      );
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.message).toBe(
      'Algumas transferências não puderam ser concluídas. Verifique os itens.',
    );
  });

  it('should clear message after 9 seconds on success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ data: { mensagem: 'OK!' } });

    const { result } = renderHook(() => useTransferirCursistas());

    await act(async () => {
      await result.current.transferir(mockDados);
    });

    expect(result.current.message).toBe('OK!');

    act(() => {
      jest.advanceTimersByTime(9000);
    });

    expect(result.current.message).toBeNull();
  });

  it('should clear message after 9 seconds on failure', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('erro'));

    const { result } = renderHook(() => useTransferirCursistas());

    await act(async () => {
      await expect(result.current.transferir(mockDados)).rejects.toThrow();
    });

    expect(result.current.message).not.toBeNull();

    act(() => {
      jest.advanceTimersByTime(9000);
    });

    expect(result.current.message).toBeNull();
  });

  it('should call api.post with correct endpoint and data', async () => {
    (api.post as jest.Mock).mockResolvedValue({ data: {} });

    const { result } = renderHook(() => useTransferirCursistas());

    await act(async () => {
      await result.current.transferir(mockDados);
    });

    expect(api.post).toHaveBeenCalledWith('/v1/inscricao/transferir', mockDados);
  });

  it('should not set message when response has no mensagem field', async () => {
    (api.post as jest.Mock).mockResolvedValue({ data: {} });

    const { result } = renderHook(() => useTransferirCursistas());

    await act(async () => {
      await result.current.transferir(mockDados);
    });

    expect(result.current.message).toBeNull();
  });
});
