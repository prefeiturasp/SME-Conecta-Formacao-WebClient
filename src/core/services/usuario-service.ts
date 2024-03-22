import { AxiosResponse } from 'axios';
import { CadastroUsuarioDTO, RetornoCadastroUsuarioDTO } from '../dto/cadastro-usuario-dto';
import { DadosUsuarioDTO } from '../dto/dados-usuario-dto';
import { RecuperacaoSenhaDTO } from '../dto/recuperacao-senha-dto';
import { RetornoPerfilUsuarioDTO } from '../dto/retorno-perfil-usuario-dto';
import { SenhaNovaDTO } from '../dto/senha-nova-dto';
import api, { inserirRegistro, obterRegistro } from './api';

const URL_DEFAULT = 'v1/usuario';

const obterMeusDados = (login: string): Promise<AxiosResponse<DadosUsuarioDTO>> =>
  api.get(`${URL_DEFAULT}/${login}`);

const alterarNome = (login: string, nome: string): Promise<AxiosResponse<boolean>> =>
  api.put(`${URL_DEFAULT}/${login}/nome`, { nome });

const alterarEmail = (login: string, email: string): Promise<AxiosResponse<boolean>> =>
  api.put(`${URL_DEFAULT}/${login}/email`, { email });

const alterarEmailDeValidacao = (
    dados: AlterarEmailValidacaoDto,
  ): Promise<AxiosResponse<boolean>> => api.put(`${URL_DEFAULT}/alterar-email`, { ...dados });
  
const alterarUnidade = (login: string, codigoEolUnidade: string): Promise<AxiosResponse<boolean>> =>
    api.put(`${URL_DEFAULT}/${login}/unidade-eol`, { codigoEolUnidade });

const alterarEmailEducacional = (login: string, email: string): Promise<AxiosResponse<boolean>> =>
  api.put(`${URL_DEFAULT}/${login}/email-educacional`, { email });

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
  inserirRegistro<RetornoCadastroUsuarioDTO>(URL_DEFAULT, { ...login });

const validaEmailToken = (token: string) =>
  obterRegistro<RetornoPerfilUsuarioDTO>(`${URL_DEFAULT}/validar-email/${token}`);

const reenviarEmail = (login: string) => obterRegistro(`${URL_DEFAULT}/${login}/reenviar-email`);

export default {
  obterMeusDados,
  alterarEmail,
  alterarSenha,
  alterarNome,
  validaEmailToken,
  reenviarEmail,
  solicitarRecuperacaoSenha,
  alterarSenhaComTokenRecuperacao,
  tokenRecuperacaoSenhaEstaValido,
  cadastrarUsuarioExterno,
  alterarUnidade,
  alterarEmailDeValidacao,
  alterarEmailEducacional,
};
