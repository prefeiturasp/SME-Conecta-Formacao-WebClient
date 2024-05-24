import { NotificacoDetalheDTO } from '../dto/notificacao-detalhe-dto';
import { obterRegistro } from './api';

const URL_DEFAULT = 'v1/Notificacao';

const obterNotificacoesNaoLida = () => obterRegistro<number>(`${URL_DEFAULT}/nao-lida`);

const obterNotificacoesDetalhe = (id: number) =>
  obterRegistro<NotificacoDetalheDTO>(`${URL_DEFAULT}/${id}`);

export default { obterNotificacoesNaoLida, obterNotificacoesDetalhe };
