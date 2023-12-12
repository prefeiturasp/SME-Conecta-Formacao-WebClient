import { RetornoListagemDTO } from '~/core/dto/retorno-listagem-dto';
import { ApiResult, obterRegistro } from '~/core/services/api';
import { CargoFuncaoTipo } from '../enum/cargo-funcao-tipo';
import { CargoFuncaoDTO } from '../dto/cargo-funcao-dto';

const URL_DEFAULT = 'v1/publico';

const obterPublicoAlvoPublico = (): Promise<ApiResult<CargoFuncaoDTO[]>> =>
  obterRegistro(`${URL_DEFAULT}/cargo-funcao/tipo/${CargoFuncaoTipo.Cargo}`);

const obterPalavraChavePublico = (): Promise<ApiResult<RetornoListagemDTO[]>> =>
  obterRegistro(`${URL_DEFAULT}/palavra-chave`);

const obterAreaPromotoraPublico = (): Promise<ApiResult<RetornoListagemDTO[]>> =>
  obterRegistro(`${URL_DEFAULT}/area-promotora`);

const obterFormatoPublico = (): Promise<ApiResult<RetornoListagemDTO[]>> =>
  obterRegistro(`${URL_DEFAULT}/formato`);

export {
  obterPublicoAlvoPublico,
  obterPalavraChavePublico,
  obterAreaPromotoraPublico,
  obterFormatoPublico,
};
