import { FuncionarioExternoDTO } from '../dto/funcionario-externo-dto';
import { obterRegistro } from './api';

const URL_DEFAULT = 'v1/FuncionarioExterno';

const obterFuncionarioExterno = (cpf: string) =>
  obterRegistro<FuncionarioExternoDTO>(`${URL_DEFAULT}/${cpf}`);

export default { obterFuncionarioExterno };
