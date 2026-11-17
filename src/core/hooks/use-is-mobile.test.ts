/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from './use-is-mobile';

describe('useIsMobile', () => {
  let listeners: Array<(e: any) => void> = [];

  beforeEach(() => {
    listeners = [];
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: jest.fn((_, cb) => listeners.push(cb)),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it('deve retornar false por padrão no desktop', () => {
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('deve retornar true quando a media query casar', () => {
    (window.matchMedia as jest.Mock).mockImplementation((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('deve atualizar quando a media query mudar', () => {
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    act(() => {
      listeners.forEach((listener) => listener({ matches: true }));
    });

    expect(result.current).toBe(true);
  });
});
