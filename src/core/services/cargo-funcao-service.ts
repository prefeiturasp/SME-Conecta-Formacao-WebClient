import { CargoFuncaoDTO } from '../dto/cargo-funcao-dto';
import { CargoFuncaoTipo } from '../enum/cargo-funcao-tipo';
import { ApiResult, obterRegistro } from './api';

export const URL_API_CARGO_FUNCAO = 'v1/CargoFuncao';

const obterCargosFuncoes = (): Promise<ApiResult<CargoFuncaoDTO[]>> =>
  obterRegistro(URL_API_CARGO_FUNCAO);

const obterPublicoAlvo = (): Promise<ApiResult<CargoFuncaoDTO[]>> =>
  obterRegistro(`${URL_API_CARGO_FUNCAO}/tipo/${CargoFuncaoTipo.Cargo}`);

const obterFuncaoEspecifica = (exibirOpcaoOutros: boolean): Promise<ApiResult<CargoFuncaoDTO[]>> =>
  obterRegistro(`${URL_API_CARGO_FUNCAO}/tipo/${CargoFuncaoTipo.Funcao}`, {
    params: { exibirOpcaoOutros },
  });

export { obterCargosFuncoes, obterFuncaoEspecifica, obterPublicoAlvo };
