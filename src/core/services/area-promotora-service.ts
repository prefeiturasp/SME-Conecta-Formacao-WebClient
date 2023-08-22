import { AxiosResponse } from 'axios';
import { AreaPromotoraTipoDTO } from '../dto/area-promotora-tipo-dto';
import api from './api';

const URL_DEFAULT = 'v1/areapromotora';

const obterTipo = (): Promise<AxiosResponse<AreaPromotoraTipoDTO[]>> =>
  api.get(`${URL_DEFAULT}/tipos`);

export default {
  obterTipo,
};
