import { RetornoListagemDTO } from '../dto/retorno-listagem-dto';
import { ApiResult, obterRegistro } from './api';

export const URL_DEFAULT = 'v1';

const obterModalidades = (): Promise<ApiResult<RetornoListagemDTO[]>> =>
  obterRegistro(`${URL_DEFAULT}/Modalidade`);

export { obterModalidades };
