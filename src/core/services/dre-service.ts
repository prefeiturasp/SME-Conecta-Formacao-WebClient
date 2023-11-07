import { RetornoListagemDTO } from '../dto/retorno-listagem-dto';
import { ApiResult, obterRegistro } from './api';

const URL_DEFAULT = 'v1/Dre';

const obterDREs = (): Promise<ApiResult<RetornoListagemDTO[]>> => obterRegistro(URL_DEFAULT);

export { obterDREs };
