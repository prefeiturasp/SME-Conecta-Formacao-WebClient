import { useAppSelector } from '~/core/hooks/use-redux';
import { TipoPerfilEnum, TipoPerfilTagDisplay } from '~/core/enum/tipo-perfil';
import { ehPerfilDre } from '~/core/utils/perfil';

export const usePerfilCodaf = () => {
  const perfilData = useAppSelector((store) => store.perfil?.perfilSelecionado);
  const dresData = useAppSelector((store) => store.perfil?.dres);

  const perfilNome = typeof perfilData === 'string' ? perfilData : perfilData?.perfilNome;
  const dres = Array.isArray(dresData) ? dresData : [];
  const ehDRE = ehPerfilDre(perfilData, dres);

  const perfil = {
    df: perfilNome === TipoPerfilTagDisplay[TipoPerfilEnum.DF],
    emforpef: perfilNome === 'EMFORPEF',
    admin: perfilNome === TipoPerfilTagDisplay[TipoPerfilEnum.AdminDF],
    cursista: perfilNome === TipoPerfilTagDisplay[TipoPerfilEnum.Cursista],
    dre: ehDRE,
  };

  const ehAreaPromotora = !perfil.cursista && !perfil.admin;
  const ehAreaPromotoraEAdmin = perfil.df || perfil.emforpef || perfil.admin;

  return { perfil, ehAreaPromotora, ehAreaPromotoraEAdmin, ehPerfilDRE: ehDRE, dres };
};
