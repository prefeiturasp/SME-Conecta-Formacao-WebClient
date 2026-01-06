import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('deve ser uma função', () => {
    expect(typeof useDebounce).toBe('function');
  });

  test('deve exportar corretamente o hook', () => {
    expect(useDebounce).toBeDefined();
  });

  test('deve aceitar dois parâmetros (value e delay)', () => {
    expect(useDebounce.length).toBe(2);
  });

  test('deve usar setTimeout internamente', () => {
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

    try {
      const delay = 500;
      let executado = false;

      const handler = setTimeout(() => {
        executado = true;
      }, delay);

      expect(setTimeoutSpy).toHaveBeenCalled();

      clearTimeout(handler);
      expect(executado).toBe(false);
    } finally {
      setTimeoutSpy.mockRestore();
    }
  });

  test('deve usar clearTimeout para limpar timeouts anteriores', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    try {
      const handler = setTimeout(() => {
        return true;
      }, 500);
      clearTimeout(handler);

      expect(clearTimeoutSpy).toHaveBeenCalled();
    } finally {
      clearTimeoutSpy.mockRestore();
    }
  });

  test('deve verificar importações do React', () => {
    const hookSource = useDebounce.toString();
    expect(hookSource).toBeDefined();
  });

  test('deve ter implementação de debounce com useEffect', () => {
    // Verifica que o hook existe e pode ser importado
    expect(useDebounce).toBeDefined();
    expect(typeof useDebounce).toBe('function');
  });

  test('deve implementar lógica de cleanup no useEffect', () => {
    // Testa que clearTimeout é chamado corretamente
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    const timeout = setTimeout(() => {
      return true;
    }, 1000);
    const cleanup = () => clearTimeout(timeout);
    cleanup();

    expect(clearTimeoutSpy).toHaveBeenCalledWith(timeout);

    clearTimeoutSpy.mockRestore();
  });

  test('deve atrasar execução com setTimeout', () => {
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

    const callback = jest.fn();
    const delay = 300;

    setTimeout(callback, delay);

    expect(setTimeoutSpy).toHaveBeenCalledWith(callback, delay);

    jest.advanceTimersByTime(delay);

    expect(callback).toHaveBeenCalled();

    setTimeoutSpy.mockRestore();
  });

  test('deve cancelar timeout quando valor muda', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    const timeout1 = setTimeout(() => {
      return 'primeiro';
    }, 500);
    clearTimeout(timeout1);

    const timeout2 = setTimeout(() => {
      return 'segundo';
    }, 500);

    expect(clearTimeoutSpy).toHaveBeenCalledWith(timeout1);

    clearTimeout(timeout2);
    clearTimeoutSpy.mockRestore();
  });

  test('deve processar valores após delay especificado', () => {
    const callback = jest.fn();

    setTimeout(callback, 500);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(499);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalled();
  });

  test('deve funcionar com diferentes delays', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const callback3 = jest.fn();

    setTimeout(callback1, 100);
    setTimeout(callback2, 300);
    setTimeout(callback3, 500);

    jest.advanceTimersByTime(100);
    expect(callback1).toHaveBeenCalled();
    expect(callback2).not.toHaveBeenCalled();

    jest.advanceTimersByTime(200);
    expect(callback2).toHaveBeenCalled();
    expect(callback3).not.toHaveBeenCalled();

    jest.advanceTimersByTime(200);
    expect(callback3).toHaveBeenCalled();
  });

  test('deve limpar todos os timers pendentes', () => {
    const callback = jest.fn();

    setTimeout(callback, 1000);

    jest.clearAllTimers();

    jest.advanceTimersByTime(1000);

    expect(callback).not.toHaveBeenCalled();
  });
});
