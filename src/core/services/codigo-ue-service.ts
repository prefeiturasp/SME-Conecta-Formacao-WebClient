import { UnidadeEolDTO } from '../dto/unidade-eol-dto';
import { obterRegistro } from './api';

const URL_DEFAULT = 'v1/UnidadeEol';

const obterUePorCodigoEOL = (ueCodigo: string) =>
  obterRegistro<UnidadeEolDTO>(`${URL_DEFAULT}/${ueCodigo}`);

export default { obterUePorCodigoEOL };
