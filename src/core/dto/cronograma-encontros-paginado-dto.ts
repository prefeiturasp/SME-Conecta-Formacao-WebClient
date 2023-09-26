import { TipoEncontro } from '../enum/tipo-encontro';

export type CronogramaEncontrosPaginadoDto = {
  id?: number | 0;
  idProposta: number;
  turmasId: number[] | [];
  datas: EncontroTurmaDatasDto[];
  horaInicio: string;
  horaFim: string;
  tipoEncontro: TipoEncontro | TipoEncontro.Presencial;
  local: string;
};

export type EncontroTurmaDatasDto = {
  dataInicio: Date;
  dataFim?: Date | null;
};
