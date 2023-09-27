import { TipoEncontro } from '~/core/enum/tipo-encontro';

export type CronogramaEncontrosPaginadoDto = {
  id?: number | 0;
  turmasId: number[];
  turmas: string;
  datas: string;
  hora: string;
  horarios: Array<Date>;
  horaInicio: string;
  horaFim: string;
  tipoEncontro: TipoEncontro | null;
  tipoEncontroDescricao: string | null;
  local: string;
};
