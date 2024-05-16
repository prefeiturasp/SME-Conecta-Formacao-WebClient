import { AreaPromotoraDTO } from '../dto/area-promotora-dto';
import { AreaPromotoraTipoDTO } from '../dto/area-promotora-tipo-dto';
import { RetornoListagemDTO } from '../dto/retorno-listagem-dto';
import { ApiResult, alterarRegistro, deletarRegistro, inserirRegistro, obterRegistro } from './api';

const URL_DEFAULT = 'v1/AreaPromotora';

const obterTiposAreaPromotora = (): Promise<ApiResult<AreaPromotoraTipoDTO[]>> =>
  obterRegistro(`${URL_DEFAULT}/tipos`);

const obterAreaPromotoraLista = (): Promise<ApiResult<RetornoListagemDTO[]>> =>
  obterRegistro(`${URL_DEFAULT}/lista`);

const obterAreaPromotoraPorId = (id: string | number): Promise<ApiResult<AreaPromotoraDTO>> =>
  obterRegistro(`${URL_DEFAULT}/${id}`);

const alterarAreaPromotora = (
  id: string | number,
  params: AreaPromotoraDTO,
): Promise<ApiResult<AreaPromotoraDTO>> =>
  alterarRegistro<AreaPromotoraDTO>(`${URL_DEFAULT}/${id}`, params);

const inserirAreaPromotora = (params: AreaPromotoraDTO): Promise<ApiResult<AreaPromotoraDTO>> =>
  inserirRegistro<AreaPromotoraDTO>(URL_DEFAULT, params);

const deletarAreaPromotora = (id: string | number): Promise<ApiResult<boolean>> =>
  deletarRegistro(`${URL_DEFAULT}/${id}`);

const obterUsuarioRedeParceria = () =>
  obterRegistro<RetornoListagemDTO[]>(`${URL_DEFAULT}/lista/rede-parceria`);

export {
  alterarAreaPromotora,
  deletarAreaPromotora,
  inserirAreaPromotora,
  obterAreaPromotoraLista,
  obterAreaPromotoraPorId,
  obterTiposAreaPromotora,
  obterUsuarioRedeParceria,
};
