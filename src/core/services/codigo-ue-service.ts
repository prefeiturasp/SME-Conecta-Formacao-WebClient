import { obterRegistro } from './api';

const URL_DEFAULT = 'v1/Ue';

const obterUePorCodigoEOL = (ueCodigo: string) => obterRegistro(`${URL_DEFAULT}/${ueCodigo}`);

export default { obterUePorCodigoEOL };
