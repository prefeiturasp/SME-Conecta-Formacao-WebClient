import { NotificacoDetalheDTO } from '../dto/notificacao-detalhe-dto';
import { PaginacaoResultadoDTO } from '../dto/paginacao-resultado-dto';
import { RetornoListagemDTO } from '../dto/retorno-listagem-dto';
import { obterRegistro } from './api';

const URL_DEFAULT = 'v1/Notificacao';

const obterNotificacoesNaoLida = () => obterRegistro<number>(`${URL_DEFAULT}/nao-lida`);

const obterNotificacoesDetalhe = (id: number) =>
  obterRegistro<NotificacoDetalheDTO>(`${URL_DEFAULT}/${id}`);

const obterNotificacaoCategoria = () =>
  obterRegistro<RetornoListagemDTO[]>(`${URL_DEFAULT}/categoria`);

const obterNotificacaoTipo = () => obterRegistro<RetornoListagemDTO[]>(`${URL_DEFAULT}/tipo`);

const obterNotificacaoSituacao = () =>
  obterRegistro<RetornoListagemDTO[]>(`${URL_DEFAULT}/situacao`);

const obterNotificacao = () => {
  obterRegistro<PaginacaoResultadoDTO<NotificacoDetalheDTO[]>>(`${URL_DEFAULT}`);
  return URL_DEFAULT;
};

export default {
  obterNotificacoesNaoLida,
  obterNotificacoesDetalhe,
  obterNotificacaoCategoria,
  obterNotificacaoTipo,
  obterNotificacaoSituacao,
  obterNotificacao,
};
