/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react';
import { usePerfilDre } from './use-perfil-dre';

const mockUseAppSelector = jest.fn();
jest.mock('~/core/hooks/use-redux', () => ({
  useAppSelector: (selector: any) => mockUseAppSelector(selector),
}));

describe('usePerfilDre', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deve retornar ehPerfilDRE falso quando nao for DRE nem tiver dres', () => {
    mockUseAppSelector.mockImplementation((selector: any) => {
      const state = {
        perfil: {
          perfilSelecionado: { perfil: '1', perfilNome: 'Admin DF' },
          dres: [],
        },
      };
      return selector(state);
    });

    const { result } = renderHook(() => usePerfilDre());
    expect(result.current.ehPerfilDRE).toBe(false);
    expect(result.current.dres).toEqual([]);
    expect(result.current.perfilSelecionado?.perfilNome).toBe('Admin DF');
  });

  it('deve retornar ehPerfilDRE verdadeiro quando perfil contiver (DRE)', () => {
    mockUseAppSelector.mockImplementation((selector: any) => {
      const state = {
        perfil: {
          perfilSelecionado: { perfil: '2', perfilNome: 'DICEU (DRE)' },
          dres: [],
        },
      };
      return selector(state);
    });

    const { result } = renderHook(() => usePerfilDre());
    expect(result.current.ehPerfilDRE).toBe(true);
  });

  it('deve retornar ehPerfilDRE verdadeiro quando houver dres na lista', () => {
    mockUseAppSelector.mockImplementation((selector: any) => {
      const state = {
        perfil: {
          perfilSelecionado: { perfil: '3', perfilNome: 'DIPED' },
          dres: ['108900'],
        },
      };
      return selector(state);
    });

    const { result } = renderHook(() => usePerfilDre());
    expect(result.current.ehPerfilDRE).toBe(true);
    expect(result.current.dres).toEqual(['108900']);
  });
});
