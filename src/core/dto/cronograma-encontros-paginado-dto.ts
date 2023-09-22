import { TipoEncontro } from '../enum/tipo-encontro';
import { TurmaEncontrosDto } from './turma-encontros-dto';

export type CronogramaEncontrosPaginadoDto = {
  turma: TurmaEncontrosDto[] | [];
  data: EncontroTurmaDatasDto[];
  hora: string;
  tipoEncontro: TipoEncontro | TipoEncontro.Presencial;
  local: string;
};

export type EncontroTurmaDatasDto = {
  dataEncontro: Date;
};
