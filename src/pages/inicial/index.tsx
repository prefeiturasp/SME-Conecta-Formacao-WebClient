import React from 'react';
import { Navigate } from 'react-router-dom';
import { PermissaoEnum } from '~/core/enum/permissao-enum';
import { ROUTES } from '~/core/enum/routes-enum';
import { TipoPerfilEnum, TipoPerfilTagDisplay } from '~/core/enum/tipo-perfil';
import { useAppSelector } from '~/core/hooks/use-redux';
import { verificaSeTemPermissao } from '~/core/utils/perfil';
import { MinhasInscricoes } from '../formacao/minhas-inscricoes';

const Inicial: React.FC = () => {
  const inscricao = useAppSelector((state) => state.inscricao);
  const perfilSelecionado = useAppSelector((store) => store.perfil.perfilSelecionado?.perfilNome);

  const [first, setfirst] = useState(second);

  const ehCursista = perfilSelecionado === TipoPerfilTagDisplay[TipoPerfilEnum.Cursista];

  const podeConsultaInscricao = ehCursista && verificaSeTemPermissao(PermissaoEnum.Inscricao_C);

  if (inscricao?.formacao?.id) {
    return <Navigate to={ROUTES.INSCRICAO} />;
  }

  const ehCursista = perfilSelecionado === TipoPerfilTagDisplay[TipoPerfilEnum.Cursista];

  if (podeConsultaInscricao) {
    return <MinhasInscricoes />;
  }

  return <>Página inicial</>;
};

export default Inicial;
