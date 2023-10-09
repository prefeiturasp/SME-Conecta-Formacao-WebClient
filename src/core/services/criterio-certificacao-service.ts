import { RetornoListagemDTO } from '../dto/retorno-listagem-dto';
import { ApiResult, obterRegistro } from './api';

export const URL_API_PALAVRA_CHAVE = 'v1/CriterioCertificacao';

const obterCriterioCertificacao = (): Promise<ApiResult<RetornoListagemDTO[]>> =>
  obterRegistro(URL_API_PALAVRA_CHAVE);

export { obterCriterioCertificacao };
