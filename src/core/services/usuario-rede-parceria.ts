import { PaginacaoResultadoDTO } from '../dto/paginacao-resultado-dto';
import { RetornoListagemDTO } from '../dto/retorno-listagem-dto';
import {
  UsuarioRedeParceriaDTO,
  UsuarioRedeParceriaPaginadoDTO,
} from '../dto/usuario-rede-parceria-dto';
import { alterarRegistro, deletarRegistro, inserirRegistro, obterRegistro } from './api';

const URL_DEFAULT = 'v1/UsuarioRedeParceria';

const obterUsuarioRedeParceriaSituacao = () =>
  obterRegistro<RetornoListagemDTO[]>(`${URL_DEFAULT}/situacao`);

const obterUsuarioRedeParceria = () => {
  obterRegistro<PaginacaoResultadoDTO<UsuarioRedeParceriaDTO[]>>(URL_DEFAULT);
  return URL_DEFAULT;
};

const inserirUsuarioRedeParceria = (params: UsuarioRedeParceriaDTO) =>
  inserirRegistro<boolean>(`${URL_DEFAULT}`, params);

const obterUsuarioRedeParceriaId = (id: string | number) =>
  obterRegistro<UsuarioRedeParceriaDTO>(`${URL_DEFAULT}/${id}`);

const alterarUsuarioRedeParceria = (id: string | number, params: UsuarioRedeParceriaPaginadoDTO) =>
  alterarRegistro<boolean>(`${URL_DEFAULT}/${id}`, params);

const excluirUsuarioRedeParceria = (id: string | number) =>
  deletarRegistro<boolean>(`${URL_DEFAULT}/${id}`);

export default {
  excluirUsuarioRedeParceria,
  alterarUsuarioRedeParceria,
  obterUsuarioRedeParceria,
  inserirUsuarioRedeParceria,
  obterUsuarioRedeParceriaId,
  obterUsuarioRedeParceriaSituacao,
};
