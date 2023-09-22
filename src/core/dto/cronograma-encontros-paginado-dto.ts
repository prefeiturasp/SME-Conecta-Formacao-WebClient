import { TipoEncontro } from '../enum/tipo-encontro';
import { TurmaEncontrosDto } from './turma-encontros-dto';

export type CronogramaEncontrosPaginadoDto = {
  turma: TurmaEncontrosDto[] | [];
  data: string;
  hora: string;
  tipoEncontro: TipoEncontro | TipoEncontro.Presencial;
  local: string;
};
