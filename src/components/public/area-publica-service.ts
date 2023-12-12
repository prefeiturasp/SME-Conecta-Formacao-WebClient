import { RetornoListagemDTO } from '~/core/dto/retorno-listagem-dto';
import { ApiResult, obterRegistro } from '~/core/services/api';

const URL_DEFAULT = 'v1/dados-publico';

const obterPublicoAlvo = (): Promise<ApiResult<RetornoListagemDTO[]>> =>
  obterRegistro(`${URL_DEFAULT}/publico-alvo`);

const obterPalavraChave = (): Promise<ApiResult<RetornoListagemDTO[]>> =>
  obterRegistro(`${URL_DEFAULT}/palavra-chave`);

const obterAreaPromotora = (): Promise<ApiResult<RetornoListagemDTO[]>> =>
  obterRegistro(`${URL_DEFAULT}/area-promotora`);

const obterFormato = (): Promise<ApiResult<RetornoListagemDTO[]>> =>
  obterRegistro(`${URL_DEFAULT}/formato`);

export { obterPublicoAlvo, obterPalavraChave, obterAreaPromotora, obterFormato };
