import { AxiosResponse } from 'axios';
import api from './api';
import { UsuarioAutenticacaoRetornoDTO } from '../dto/usuario-autenticacao-retorno-dto';
import { AutenticacaoDTO } from '../dto/autenticacao-dto';
import { RetornoPerfilUsuarioDTO } from '../dto/retorno-perfil-usuario-dto';

const URL_DEFAULT = 'v1/autenticacao';
export const URL_AUTENTICACAO_REVALIDAR = `${URL_DEFAULT}/revalidar`;

const autenticar = (
  dados: AutenticacaoDTO,
): Promise<AxiosResponse<UsuarioAutenticacaoRetornoDTO>> => api.post(URL_DEFAULT, { ...dados });

const listarPerfisUsuario = (login: string): Promise<AxiosResponse<RetornoPerfilUsuarioDTO>> =>
  api.get(`${URL_DEFAULT}/usuarios/${login}/perfis`);

const autenticarRevalidar = (token: string): Promise<AxiosResponse> =>
  api.post(URL_AUTENTICACAO_REVALIDAR, { token });

export default {
  autenticar,
  listarPerfisUsuario,
  autenticarRevalidar,
};
