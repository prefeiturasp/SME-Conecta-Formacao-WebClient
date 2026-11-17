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

const renderComPerfil = (perfilNome: string | undefined, dres: string[] = []) => {
  mockUseAppSelector.mockImplementation((selector: any) => {
    const dummyStore = {
      perfil: {
        perfilSelecionado: perfilNome ? { perfil: 'guid', perfilNome } : undefined,
        dres,
      },
    };
    return selector ? selector(dummyStore) : undefined;
  });
  return renderHook(() => usePerfilCodaf()).result.current;
};

describe('usePerfilCodaf', () => {
  beforeEach(() => jest.clearAllMocks());

  it('DadoPerfilDF_QuandoObterPerfil_EntaoDfVerdadeiroEAreaPromotoraVerdadeiro', () => {
    const { perfil, ehAreaPromotora, ehAreaPromotoraEAdmin, ehPerfilDRE } = renderComPerfil('DF');
    expect(perfil.df).toBe(true);
    expect(perfil.emforpef).toBe(false);
    expect(perfil.admin).toBe(false);
    expect(perfil.cursista).toBe(false);
    expect(perfil.dre).toBe(false);
    expect(ehPerfilDRE).toBe(false);
    expect(ehAreaPromotora).toBe(true);
    expect(ehAreaPromotoraEAdmin).toBe(true);
  });

  it('DadoPerfilEMFORPEF_QuandoObterPerfil_EntaoEmforpefVerdadeiroEAreaPromotoraVerdadeiro', () => {
    const { perfil, ehAreaPromotora, ehAreaPromotoraEAdmin, ehPerfilDRE } = renderComPerfil('EMFORPEF');
    expect(perfil.emforpef).toBe(true);
    expect(perfil.df).toBe(false);
    expect(perfil.admin).toBe(false);
    expect(perfil.dre).toBe(false);
    expect(ehPerfilDRE).toBe(false);
    expect(ehAreaPromotora).toBe(true);
    expect(ehAreaPromotoraEAdmin).toBe(true);
  });

  it('DadoPerfilAdminDF_QuandoObterPerfil_EntaoAdminVerdadeiroEAreaPromotoraFalso', () => {
    const { perfil, ehAreaPromotora, ehAreaPromotoraEAdmin, ehPerfilDRE } = renderComPerfil('Admin DF');
    expect(perfil.admin).toBe(true);
    expect(perfil.df).toBe(false);
    expect(perfil.cursista).toBe(false);
    expect(perfil.dre).toBe(false);
    expect(ehPerfilDRE).toBe(false);
    expect(ehAreaPromotora).toBe(false);
    expect(ehAreaPromotoraEAdmin).toBe(true);
  });

  it('DadoPerfilCursista_QuandoObterPerfil_EntaoCursistaVerdadeiroEAreaPromotoraFalso', () => {
    const { perfil, ehAreaPromotora, ehAreaPromotoraEAdmin, ehPerfilDRE } = renderComPerfil('Cursista');
    expect(perfil.cursista).toBe(true);
    expect(perfil.df).toBe(false);
    expect(perfil.admin).toBe(false);
    expect(perfil.dre).toBe(false);
    expect(ehPerfilDRE).toBe(false);
    expect(ehAreaPromotora).toBe(false);
    expect(ehAreaPromotoraEAdmin).toBe(false);
  });

  it('DadoPerfilUndefined_QuandoObterPerfil_EntaoTodosPerfisFalso', () => {
    const { perfil, ehAreaPromotora, ehAreaPromotoraEAdmin, ehPerfilDRE } = renderComPerfil(undefined);
    expect(perfil.df).toBe(false);
    expect(perfil.emforpef).toBe(false);
    expect(perfil.admin).toBe(false);
    expect(perfil.cursista).toBe(false);
    expect(perfil.dre).toBe(false);
    expect(ehPerfilDRE).toBe(false);
    expect(ehAreaPromotora).toBe(true);
    expect(ehAreaPromotoraEAdmin).toBe(false);
  });

  it('DadoPerfilParecerista_QuandoObterPerfil_EntaoAreaPromotoraVerdadeiroEAdminFalso', () => {
    const { perfil, ehAreaPromotora, ehAreaPromotoraEAdmin, ehPerfilDRE } = renderComPerfil('Parecerista');
    expect(perfil.df).toBe(false);
    expect(perfil.admin).toBe(false);
    expect(perfil.cursista).toBe(false);
    expect(perfil.dre).toBe(false);
    expect(ehPerfilDRE).toBe(false);
    expect(ehAreaPromotora).toBe(true);
    expect(ehAreaPromotoraEAdmin).toBe(false);
  });

  it('DadoPerfilDRE_QuandoObterPerfil_EntaoDreVerdadeiro', () => {
    const { perfil, ehAreaPromotora, ehPerfilDRE } = renderComPerfil('DICEU (DRE)');
    expect(perfil.dre).toBe(true);
    expect(ehPerfilDRE).toBe(true);
    expect(ehAreaPromotora).toBe(true);
  });

  it('DadoUsuarioComDresNoToken_QuandoObterPerfil_EntaoEhPerfilDREVerdadeiro', () => {
    const { perfil, ehPerfilDRE, dres } = renderComPerfil('Qualquer Perfil', ['108900']);
    expect(perfil.dre).toBe(true);
    expect(ehPerfilDRE).toBe(true);
    expect(dres).toEqual(['108900']);
  });
});
