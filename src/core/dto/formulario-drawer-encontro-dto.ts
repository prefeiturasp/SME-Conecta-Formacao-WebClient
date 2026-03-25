import { Dayjs } from 'dayjs';
import { TipoEncontro } from '../enum/tipo-encontro';

export type DataEncontro = {
  dataInicio: Dayjs;
  dataFim?: Dayjs | any;
  horarios?: Dayjs[];
};

export type FormularioDrawerEncontro = {
  turmas: number[];
  datas: DataEncontro[];
  tipoEncontro: TipoEncontro;
  local: string;
};
