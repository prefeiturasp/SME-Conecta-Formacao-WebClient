/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react';
import { usePerfilCodaf } from './use-perfil-codaf';

const mockUseAppSelector = jest.fn();
jest.mock('~/core/hooks/use-redux', () => ({
  useAppSelector: (selector: any) => mockUseAppSelector(selector),
}));

jest.mock('~/core/enum/tipo-perfil', () => ({
  TipoPerfilEnum: { DF: 1, AdminDF: 2, Cursista: 3, Parecerista: 4 },
  TipoPerfilTagDisplay: { 1: 'DF', 2: 'Admin DF', 3: 'Cursista', 4: 'Parecerista' },
}));

const renderComPerfil = (perfilNome: string | undefined) => {
  mockUseAppSelector.mockReturnValue(perfilNome);
  return renderHook(() => usePerfilCodaf()).result.current;
};

describe('usePerfilCodaf', () => {
  beforeEach(() => jest.clearAllMocks());

  it('DadoPerfilDF_QuandoObterPerfil_EntaoDfVerdadeiroEAreaPromotoraVerdadeiro', () => {
    const { perfil, ehAreaPromotora, ehAreaPromotoraEAdmin } = renderComPerfil('DF');
    expect(perfil.df).toBe(true);
    expect(perfil.emforpef).toBe(false);
    expect(perfil.admin).toBe(false);
    expect(perfil.cursista).toBe(false);
    expect(ehAreaPromotora).toBe(true);
    expect(ehAreaPromotoraEAdmin).toBe(true);
  });

  it('DadoPerfilEMFORPEF_QuandoObterPerfil_EntaoEmforpefVerdadeiroEAreaPromotoraVerdadeiro', () => {
    const { perfil, ehAreaPromotora, ehAreaPromotoraEAdmin } = renderComPerfil('EMFORPEF');
    expect(perfil.emforpef).toBe(true);
    expect(perfil.df).toBe(false);
    expect(perfil.admin).toBe(false);
    expect(ehAreaPromotora).toBe(true);
    expect(ehAreaPromotoraEAdmin).toBe(true);
  });

  it('DadoPerfilAdminDF_QuandoObterPerfil_EntaoAdminVerdadeiroEAreaPromotoraFalso', () => {
    const { perfil, ehAreaPromotora, ehAreaPromotoraEAdmin } = renderComPerfil('Admin DF');
    expect(perfil.admin).toBe(true);
    expect(perfil.df).toBe(false);
    expect(perfil.cursista).toBe(false);
    expect(ehAreaPromotora).toBe(false);
    expect(ehAreaPromotoraEAdmin).toBe(true);
  });

  it('DadoPerfilCursista_QuandoObterPerfil_EntaoCursistaVerdadeiroEAreaPromotoraFalso', () => {
    const { perfil, ehAreaPromotora, ehAreaPromotoraEAdmin } = renderComPerfil('Cursista');
    expect(perfil.cursista).toBe(true);
    expect(perfil.df).toBe(false);
    expect(perfil.admin).toBe(false);
    expect(ehAreaPromotora).toBe(false);
    expect(ehAreaPromotoraEAdmin).toBe(false);
  });

  it('DadoPerfilUndefined_QuandoObterPerfil_EntaoTodosPerfisFalso', () => {
    const { perfil, ehAreaPromotora, ehAreaPromotoraEAdmin } = renderComPerfil(undefined);
    expect(perfil.df).toBe(false);
    expect(perfil.emforpef).toBe(false);
    expect(perfil.admin).toBe(false);
    expect(perfil.cursista).toBe(false);
    expect(ehAreaPromotora).toBe(true);
    expect(ehAreaPromotoraEAdmin).toBe(false);
  });

  it('DadoPerfilParecerista_QuandoObterPerfil_EntaoAreaPromotoraVerdadeiroEAdminFalso', () => {
    const { perfil, ehAreaPromotora, ehAreaPromotoraEAdmin } = renderComPerfil('Parecerista');
    expect(perfil.df).toBe(false);
    expect(perfil.admin).toBe(false);
    expect(perfil.cursista).toBe(false);
    expect(ehAreaPromotora).toBe(true);
    expect(ehAreaPromotoraEAdmin).toBe(false);
  });
});
