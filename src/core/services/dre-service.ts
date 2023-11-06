import { GrupoDTO } from '../dto/grupo-dto';
import { ApiResult, obterRegistro } from './api';

//TODO: Alterar para o endereço da API para DRE quando tiver pronto
const URL_DEFAULT = 'v1/';

const obterDREs = (): Promise<ApiResult<GrupoDTO[]>> => obterRegistro(URL_DEFAULT);

export { obterDREs };
