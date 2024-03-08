import { AxiosError, AxiosResponse } from 'axios';
import { AutenticacaoDTO } from '../dto/autenticacao-dto';
import { RetornoPerfilUsuarioDTO } from '../dto/retorno-perfil-usuario-dto';
import api, { ApiResult } from './api';
import { RetornoBaseDTO } from '../dto/retorno-base-dto';
import { store } from '../redux';
import { setSpinning } from '../redux/modules/spin/actions';
import { SERVICO_INDISPONIVEL_AO_AUTENTICAR } from '../constants/mensagens';

const URL_DEFAULT = 'v1/autenticacao';
export const URL_AUTENTICACAO_REVALIDAR = `${URL_DEFAULT}/revalidar`;

const autenticar = (dados: AutenticacaoDTO) => {
  return api
    .post(URL_DEFAULT, { ...dados })
    .then(
      (response: AxiosResponse<RetornoPerfilUsuarioDTO>): ApiResult<RetornoPerfilUsuarioDTO> => {
        return { sucesso: true, dados: response?.data, mensagens: [] };
      },
    )
    .catch((error: AxiosError<RetornoBaseDTO>): ApiResult<any> => {
      const mensagens = error?.response?.data?.mensagens?.length
        ? error?.response?.data?.mensagens
        : [SERVICO_INDISPONIVEL_AO_AUTENTICAR];

      return { sucesso: false, mensagens, dados: null };
    })
    .finally(() => store.dispatch(setSpinning(false)));
};

const autenticarRevalidar = (token: string): Promise<AxiosResponse> =>
  api.post(URL_AUTENTICACAO_REVALIDAR, { token });

const alterarPerfilSelecionado = (
  perfilUsuarioId: string | undefined,
): Promise<AxiosResponse<RetornoPerfilUsuarioDTO>> =>
  api.put(`${URL_DEFAULT}/perfis/${perfilUsuarioId}`);

export default {
  autenticar,
  autenticarRevalidar,
  alterarPerfilSelecionado,
};
