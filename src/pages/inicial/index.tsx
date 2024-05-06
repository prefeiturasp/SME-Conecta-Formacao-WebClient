import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '~/core/enum/routes-enum';
import { TipoPerfilEnum, TipoPerfilTagDisplay } from '~/core/enum/tipo-perfil';
import { useAppSelector } from '~/core/hooks/use-redux';
import autenticacaoService from '~/core/services/autenticacao-service';
import { validarAutenticacao } from '~/core/utils/perfil';
import { MinhasInscricoes } from '../formacao-cursista/minhas-inscricoes';
import { FiltroPaginaInicial } from './components/filtro';

const Inicial: React.FC = () => {
  const inscricao = useAppSelector((state) => state.inscricao);
  const perfilUsuario = useAppSelector((store) => store.perfil).perfilUsuario;
  const perfilSelecionado = useAppSelector((store) => store.perfil.perfilSelecionado?.perfilNome);
  const [podeConsultaInscricao, setPodeConsultaInscricao] = useState<boolean>(false);

  useEffect(() => {
    const ehCursista = perfilSelecionado === TipoPerfilTagDisplay[TipoPerfilEnum.Cursista];
    setPodeConsultaInscricao(ehCursista);
  }, [perfilSelecionado, perfilUsuario, podeConsultaInscricao]);

  const temPerfilCursista = perfilUsuario.filter((item) =>
    item.perfilNome.includes(TipoPerfilTagDisplay[TipoPerfilEnum.Cursista]),
  );

  if (inscricao?.formacao.id && temPerfilCursista) {
    const perfilUsuarioId = temPerfilCursista[0].perfil;

    autenticacaoService.alterarPerfilSelecionado(perfilUsuarioId).then((response) => {
      validarAutenticacao(response.data);
    });

    return <Navigate to={ROUTES.INSCRICAO} />;
  }

  if (podeConsultaInscricao) {
    return <MinhasInscricoes />;
  } else {
    return <FiltroPaginaInicial />;
  }
};

export default Inicial;
