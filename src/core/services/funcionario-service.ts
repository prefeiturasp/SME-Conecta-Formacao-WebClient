import { UsuarioAdminDfDTO } from '../dto/usuario-admin-df-dto';
import { ApiResult, obterRegistro } from './api';

const URL_DEFAULT = 'v1/Funcionario';

const obterUsuariosAdminDf = (): Promise<ApiResult<UsuarioAdminDfDTO[]>> =>
  obterRegistro(`${URL_DEFAULT}/obter-usuarios-admin-df`);

export { obterUsuariosAdminDf };
