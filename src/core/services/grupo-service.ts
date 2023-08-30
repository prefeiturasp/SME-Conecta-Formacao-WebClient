import { GrupoDTO } from '../dto/grupo-dto';
import { ApiResult, obterRegistro } from './api';

const URL_DEFAULT = 'v1/Grupo';

const obterGruposPerfis = (): Promise<ApiResult<GrupoDTO[]>> => obterRegistro(URL_DEFAULT);

export { obterGruposPerfis };
