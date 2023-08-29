import { AxiosResponse } from 'axios';
import { GrupoDTO } from '../dto/grupo-dto';
import api from './api';

const URL_DEFAULT = 'v1/Grupo';

const obterGrupos = (): Promise<AxiosResponse<GrupoDTO[]>> => api.get(URL_DEFAULT);

export default {
  obterGrupos,
};
