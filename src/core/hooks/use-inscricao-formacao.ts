import { useNavigate } from 'react-router-dom';
import { RetornoDetalheFormacaoDto } from '~/core/dto/dados-formacao-area-publica-dto';
import { ROUTES } from '~/core/enum/routes-enum';
import { TipoPerfilEnum, TipoPerfilTagDisplay } from '~/core/enum/tipo-perfil';
import { useAppDispatch, useAppSelector } from '~/core/hooks/use-redux';
import { setDadosFormacao } from '~/core/redux/modules/area-publica-inscricao/actions';
import autenticacaoService from '~/core/services/autenticacao-service';
import { validarAutenticacao } from '~/core/utils/perfil';

export const useInscricaoFormacao = (
  dadosFormacao?: RetornoDetalheFormacaoDto,
  propostaId?: number,
) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const autenticado = useAppSelector((state) => state.auth.autenticado);
  const perfilUsuario = useAppSelector((store) => store.perfil).perfilUsuario;

  const enviarInscricao = () => {
    if (!dadosFormacao) return;

    dispatch(setDadosFormacao(dadosFormacao));

    if (!autenticado) {
      navigate(ROUTES.LOGIN, { replace: true });
      return;
    }

    const perfilCursista = perfilUsuario.find((item) =>
      item.perfilNome.includes(TipoPerfilTagDisplay[TipoPerfilEnum.Cursista]),
    );

    autenticacaoService.alterarPerfilSelecionado(perfilCursista?.perfil).then((response) => {
      validarAutenticacao(response.data);
    });

    navigate(`${ROUTES.INSCRICAO}/${propostaId}`, { replace: true });
  };

  return {
    enviarInscricao,
    inscricaoDesabilitada: !dadosFormacao || dadosFormacao.inscricaoEncerrada,
    linkInscricaoExterna: dadosFormacao?.linkParaInscricoesExterna,
  };
};
