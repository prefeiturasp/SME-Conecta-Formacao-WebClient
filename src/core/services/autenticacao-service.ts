import { AxiosResponse } from 'axios';
import api from './api';
import { AutenticacaoDTO } from '../dto/autenticacao-dto';
import { RetornoPerfilUsuarioDTO } from '../dto/retorno-perfil-usuario-dto';

const URL_DEFAULT = 'v1/autenticacao';
export const URL_AUTENTICACAO_REVALIDAR = `${URL_DEFAULT}/revalidar`;

const autenticar = (dados: AutenticacaoDTO): Promise<AxiosResponse<RetornoPerfilUsuarioDTO>> =>
  api.post(URL_DEFAULT, { ...dados });

const autenticarRevalidar = (token: string): Promise<AxiosResponse> =>
  api.post(URL_AUTENTICACAO_REVALIDAR, { token });

export default {
  autenticar,
  autenticarRevalidar,
};
