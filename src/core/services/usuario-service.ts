import { AxiosResponse } from 'axios';
import { CadastroUsuarioDTO } from '../dto/cadastro-usuario-dto';
import { DadosUsuarioDTO } from '../dto/dados-usuario-dto';
import { RecuperacaoSenhaDTO } from '../dto/recuperacao-senha-dto';
import { RetornoPerfilUsuarioDTO } from '../dto/retorno-perfil-usuario-dto';
import { SenhaNovaDTO } from '../dto/senha-nova-dto';
import api, { inserirRegistro, obterRegistro } from './api';

const URL_DEFAULT = 'v1/usuario';

const obterMeusDados = (login: string): Promise<AxiosResponse<DadosUsuarioDTO>> =>
  api.get(`${URL_DEFAULT}/${login}`);

const alterarEmail = (login: string, email: string): Promise<AxiosResponse<boolean>> =>
  api.put(`${URL_DEFAULT}/${login}/email`, { email });

const alterarSenha = (login: string, dados: SenhaNovaDTO): Promise<AxiosResponse<boolean>> =>
  api.put(`${URL_DEFAULT}/${login}/senha`, dados);

const solicitarRecuperacaoSenha = (login: string): Promise<AxiosResponse<string>> =>
  api.post(`${URL_DEFAULT}/${login}/solicitar-recuperacao-senha`);

const alterarSenhaComTokenRecuperacao = (
  params: RecuperacaoSenhaDTO,
): Promise<AxiosResponse<RetornoPerfilUsuarioDTO>> =>
  api.put(`${URL_DEFAULT}/recuperar-senha`, { ...params });

const tokenRecuperacaoSenhaEstaValido = (token: string): Promise<AxiosResponse<boolean>> =>
  api.get(`${URL_DEFAULT}/valida-token-recuperacao-senha/${token}`);

const cadastrarUsuarioExterno = (login: CadastroUsuarioDTO) =>
  inserirRegistro<CadastroUsuarioDTO>(URL_DEFAULT, { ...login });

const validaEmailToken = (token: string) => obterRegistro(`${URL_DEFAULT}/validar-email/${token}`);

export default {
  obterMeusDados,
  alterarEmail,
  alterarSenha,
  validaEmailToken,
  solicitarRecuperacaoSenha,
  alterarSenhaComTokenRecuperacao,
  tokenRecuperacaoSenhaEstaValido,
  cadastrarUsuarioExterno,
};
