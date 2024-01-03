import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '~/core/enum/routes-enum';
import { TipoPerfilEnum, TipoPerfilTagDisplay } from '~/core/enum/tipo-perfil';
import { useAppSelector } from '~/core/hooks/use-redux';
import { MinhasInscricoes } from '../formacao/minhas-inscricoes';

const Inicial: React.FC = () => {
  const inscricao = useAppSelector((state) => state.inscricao);

  const perfilUsuario = useAppSelector((store) => store.perfil).perfilUsuario;
  const perfilSelecionado = useAppSelector((store) => store.perfil.perfilSelecionado?.perfilNome);

  const [podeConsultaInscricao, setPodeConsultaInscricao] = useState<boolean>(false);

  useEffect(() => {
    // TODO - Alinhar com PO como verificar o perfil!
    const perfis = perfilUsuario.map((perfil) => {
      return perfil.perfilNome;
    });

    const possuiPerfilCursista = perfis.includes(TipoPerfilTagDisplay[TipoPerfilEnum.Cursista]);

    setPodeConsultaInscricao(possuiPerfilCursista);
  }, [perfilSelecionado, perfilUsuario]);

  if (inscricao?.formacao.id) {
    return <Navigate to={ROUTES.INSCRICAO} />;
  }

  if (podeConsultaInscricao) {
    return <MinhasInscricoes />;
  }

  return <>Página inicial</>;
};

export default Inicial;
