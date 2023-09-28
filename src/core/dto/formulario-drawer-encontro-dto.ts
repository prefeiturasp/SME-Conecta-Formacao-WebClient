import { Dayjs } from 'dayjs';
import { TipoEncontro } from '../enum/tipo-encontro';

export type DataEncontro = {
  dataInicial: Dayjs;
  dataFinal: Dayjs;
};

export type FormularioDrawerEncontro = {
  turmas: number[];
  datas: DataEncontro[];
  horarios: Dayjs[];
  tipoEncontro: TipoEncontro;
  local: string;
};
