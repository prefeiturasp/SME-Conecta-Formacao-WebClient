import { RetornoListagemDTO } from '~/core/dto/retorno-listagem-dto';
import { ApiResult, obterRegistro } from '~/core/services/api';
import { CargoFuncaoTipo } from '../enum/cargo-funcao-tipo';
import { CargoFuncaoDTO } from '../dto/cargo-funcao-dto';
import { FormacaoDTO } from '../dto/formacao-dto';
import { PaginacaoResultadoDTO } from '../dto/paginacao-resultado-dto';
import { FiltroFormacaoDTO } from '../dto/filtro-formacao-dto';
import { RetornoDetalheFormacaoDTO } from '../dto/dados-formacao-area-publica-dto';

const URL_DEFAULT = 'v1/publico';

const obterPublicoAlvoPublico = (): Promise<ApiResult<CargoFuncaoDTO[]>> =>
  obterRegistro(`${URL_DEFAULT}/cargo-funcao/tipo/${CargoFuncaoTipo.Cargo}`);

const obterPalavraChavePublico = (): Promise<ApiResult<RetornoListagemDTO[]>> =>
  obterRegistro(`${URL_DEFAULT}/palavra-chave`);

const obterAreaPromotoraPublico = (): Promise<ApiResult<RetornoListagemDTO[]>> =>
  obterRegistro(`${URL_DEFAULT}/area-promotora`);

const obterFormatoPublico = (): Promise<ApiResult<RetornoListagemDTO[]>> =>
  obterRegistro(`${URL_DEFAULT}/formato`);

const obterFormacaoPaginada = (
  filtro: FiltroFormacaoDTO,
  numeroPagina?: number,
  numeroRegistros?: number,
) =>
  obterRegistro<PaginacaoResultadoDTO<FormacaoDTO[]>>(`${URL_DEFAULT}/formacao-listagem`, filtro, {
    numeroPagina,
    numeroRegistros,
  });

const obterDadosFormacao = (propostaId: number) =>
  obterRegistro<RetornoDetalheFormacaoDTO>(`${URL_DEFAULT}/formacao-detalhada/${propostaId}`);

export {
  obterPublicoAlvoPublico,
  obterPalavraChavePublico,
  obterAreaPromotoraPublico,
  obterFormatoPublico,
  obterFormacaoPaginada,
  obterDadosFormacao,
};
