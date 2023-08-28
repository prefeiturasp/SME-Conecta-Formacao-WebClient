import { AxiosResponse } from 'axios';
import { AreaPromotoraDTO } from '../dto/area-promotora-dto';
import { AreaPromotoraTipoDTO } from '../dto/area-promotora-tipo-dto';
import api from './api';

const URL_DEFAULT = 'v1/AreaPromotora';

const obterTipo = (): Promise<AxiosResponse<AreaPromotoraTipoDTO[]>> =>
  api.get(`${URL_DEFAULT}/tipos`);

const obterAreaPromotoraPorId = (id: any): Promise<AxiosResponse<AreaPromotoraDTO>> =>
  api.get(`${URL_DEFAULT}/${id}`);

export default {
  obterTipo,
  obterAreaPromotoraPorId,
};
