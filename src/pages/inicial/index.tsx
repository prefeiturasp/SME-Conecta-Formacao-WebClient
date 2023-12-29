import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '~/core/enum/routes-enum';
import { TipoPerfilEnum, TipoPerfilTagDisplay } from '~/core/enum/tipo-perfil';
import { useAppSelector } from '~/core/hooks/use-redux';

const Inicial: React.FC = () => {
  const inscricao = useAppSelector((state) => state.inscricao);
  const perfilSelecionado = useAppSelector((store) => store.perfil.perfilSelecionado?.perfilNome);

  const ehCursista = perfilSelecionado === TipoPerfilTagDisplay[TipoPerfilEnum.Cursista];

  const setarPaginaInicial = () => {
    if (inscricao.id) {
      return <Navigate to={ROUTES.INSCRICAO} />;
    }

    if (ehCursista) {
      return <Navigate to={ROUTES.MINHAS_INSCRICOES} />;
    }

    return <>Página inicial</>;
  };

  useEffect(() => {
    setarPaginaInicial();
  }, [perfilSelecionado]);

  return setarPaginaInicial();
};

export default Inicial;
