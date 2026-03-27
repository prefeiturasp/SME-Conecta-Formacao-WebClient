import { Dayjs } from 'dayjs';
import { TipoEncontro } from '../enum/tipo-encontro';

export type DataEncontro = {
  dataInicio: Dayjs;
  dataFim?: Dayjs;
  horarios?: Dayjs[];
};

export type FormularioDrawerEncontro = {
  turmas: number[];
  datas: DataEncontro[];
  tipoEncontro: TipoEncontro;
  local: string;
};
