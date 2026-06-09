/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('does not update value before delay elapses', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'first' },
    });

    rerender({ value: 'second' });
    act(() => jest.advanceTimersByTime(499));

    expect(result.current).toBe('first');
  });

  it('updates value after delay elapses', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'first' },
    });

    rerender({ value: 'second' });
    act(() => jest.advanceTimersByTime(500));

    expect(result.current).toBe('second');
  });

  it('cancels previous timer on rapid value changes', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'b' });
    act(() => jest.advanceTimersByTime(100));
    rerender({ value: 'c' });
    act(() => jest.advanceTimersByTime(300));

    expect(result.current).toBe('c');
  });

  it('works with number values', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 200), {
      initialProps: { value: 0 },
    });

    rerender({ value: 42 });
    act(() => jest.advanceTimersByTime(200));

    expect(result.current).toBe(42);
  });

  it('works with object values', () => {
    const obj = { id: 1 };
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 100), {
      initialProps: { value: {} as any },
    });

    rerender({ value: obj });
    act(() => jest.advanceTimersByTime(100));

    expect(result.current).toBe(obj);
  });

  it('cleans up timeout on unmount', () => {
    const clearSpy = jest.spyOn(global, 'clearTimeout');
    const { rerender, unmount } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'b' });
    unmount();

    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });
});
