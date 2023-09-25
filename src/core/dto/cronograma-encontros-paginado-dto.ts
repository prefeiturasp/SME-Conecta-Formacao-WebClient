import { TipoEncontro } from '../enum/tipo-encontro';

export type CronogramaEncontrosPaginadoDto = {
  turma: number[] | [];
  data: EncontroTurmaDatasDto[];
  horaInicio: string;
  horaFim: string;
  tipoEncontro: TipoEncontro | TipoEncontro.Presencial;
  local: string;
};

export type EncontroTurmaDatasDto = {
  dataInicio: Date;
  dataFim?: Date | null;
};
