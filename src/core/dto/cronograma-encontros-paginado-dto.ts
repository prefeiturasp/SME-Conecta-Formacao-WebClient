import { TipoEncontro } from '~/core/enum/tipo-encontro';
import { PropostaEncontroDataDTO } from './proposta-encontro-dto';

export type CronogramaEncontrosPaginadoDto = {
  id?: number | 0;
  turmasId: number[];
  turmas: string;
  datas: string;
  hora: string;
  datasPeriodos: PropostaEncontroDataDTO[];
  horarios: Array<Date>;
  horaInicio: string;
  horaFim: string;
  tipoEncontro: TipoEncontro | null;
  tipoEncontroDescricao: string | null;
  local: string;
};
