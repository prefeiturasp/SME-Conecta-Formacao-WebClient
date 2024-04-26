import { FuncionarioInternoDTO } from '../dto/funcionario-interno-dto';
import { ApiResult, obterRegistro } from './api';

const URL_DEFAULT = 'v1/Funcionario';

const obterUsuariosAdminDf = (): Promise<ApiResult<FuncionarioInternoDTO[]>> =>
  obterRegistro(`${URL_DEFAULT}/obter-usuarios-admin-df`);

const obterPareceristas = (): Promise<ApiResult<FuncionarioInternoDTO[]>> =>
  obterRegistro(`${URL_DEFAULT}/obter-parecerista`);

export { obterPareceristas, obterUsuariosAdminDf };
