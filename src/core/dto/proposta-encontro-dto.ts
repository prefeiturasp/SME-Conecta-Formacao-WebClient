import { TipoEncontro } from '../enum/tipo-encontro';

export type PropostaEncontroDTO = {
  id: number | 0;
  horaInicio: string | null;
  horaFim: string | null;
  tipo: TipoEncontro | null;
  local: string | null;
  turmas: PropostaEncontroTurmaDTO[];
  datas: PropostaEncontroDataDTO[];
};

export type PropostaEncontroTurmaDTO = {
  turma: number;
};

export type PropostaEncontroDataDTO = {
  dataInicio: Date;
  dataFim?: Date | null;
};
