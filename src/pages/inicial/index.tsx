import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '~/core/enum/routes-enum';
import { TipoPerfilEnum, TipoPerfilTagDisplay } from '~/core/enum/tipo-perfil';
import { useAppSelector } from '~/core/hooks/use-redux';
import { store } from '~/core/redux';
import { setPerfilSelecionado } from '~/core/redux/modules/perfil/actions';
import { MinhasInscricoes } from '../formacao-cursista/minhas-inscricoes';

const Inicial: React.FC = () => {
  const inscricao = useAppSelector((state) => state.inscricao);

  const perfilUsuario = useAppSelector((store) => store.perfil).perfilUsuario;
  const perfilSelecionado = useAppSelector((store) => store.perfil.perfilSelecionado?.perfilNome);

  const [podeConsultaInscricao, setPodeConsultaInscricao] = useState<boolean>(false);

  useEffect(() => {
    const ehCursista = perfilSelecionado === TipoPerfilTagDisplay[TipoPerfilEnum.Cursista];

    setPodeConsultaInscricao(ehCursista);
  }, [perfilSelecionado, perfilUsuario]);

  const temPerfilCursista = perfilUsuario.filter((item) =>
    item.perfilNome.includes(TipoPerfilTagDisplay[TipoPerfilEnum.Cursista]),
  );

  if (inscricao?.formacao.id && temPerfilCursista) {
    store.dispatch(setPerfilSelecionado(temPerfilCursista[0]));
    return <Navigate to={ROUTES.INSCRICAO} />;
  }

  if (podeConsultaInscricao) {
    return <MinhasInscricoes />;
  }

  return <>Página inicial</>;
};

export default Inicial;
