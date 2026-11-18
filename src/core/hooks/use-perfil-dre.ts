import { useAppSelector } from '~/core/hooks/use-redux';
import { ehPerfilDre } from '~/core/utils/perfil';

export const usePerfilDre = () => {
  const perfilData = useAppSelector((store) => store.perfil?.perfilSelecionado);
  const dresData = useAppSelector((store) => store.perfil?.dres);

  const dres = Array.isArray(dresData) ? dresData : [];
  const ehPerfilDRE = ehPerfilDre(perfilData, dres);

  return {
    ehPerfilDRE,
    dres,
    perfilSelecionado: typeof perfilData === 'object' ? perfilData : undefined,
  };
};
