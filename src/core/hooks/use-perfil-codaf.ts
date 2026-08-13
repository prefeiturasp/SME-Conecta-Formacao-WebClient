import { useAppSelector } from '~/core/hooks/use-redux';
import { TipoPerfilEnum, TipoPerfilTagDisplay } from '~/core/enum/tipo-perfil';

export const usePerfilCodaf = () => {
  const perfilSelecionado = useAppSelector((store) => store.perfil.perfilSelecionado?.perfilNome);

  const perfil = {
    df: perfilSelecionado === TipoPerfilTagDisplay[TipoPerfilEnum.DF],
    emforpef: perfilSelecionado === 'EMFORPEF',
    admin: perfilSelecionado === TipoPerfilTagDisplay[TipoPerfilEnum.AdminDF],
    cursista: perfilSelecionado === TipoPerfilTagDisplay[TipoPerfilEnum.Cursista],
  };

  const ehAreaPromotora = !perfil.cursista && !perfil.admin;
  const ehAreaPromotoraEAdmin = perfil.df || perfil.emforpef || perfil.admin;

  return { perfil, ehAreaPromotora, ehAreaPromotoraEAdmin };
};