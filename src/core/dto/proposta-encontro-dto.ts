import { TipoEncontro } from '../enum/tipo-encontro';
import { DataEncontro } from './formulario-drawer-encontro-dto';

export type PropostaEncontroDTO = {
  id?: number;
  propostaId: string | number;
  horaInicio: string | null;
  horaFim: string | null;
  tipo: TipoEncontro | null;
  local: string | null;
  turmas: PropostaEncontroTurmaDTO[];
  datas: DataEncontro[];
};

export type PropostaEncontroPaginadoDTO = {
  datas: PropostaEncontroDataDTO[];
} & PropostaEncontroDTO;

export type PropostaEncontroTurmaDTO = {
  turma: number;
};

export type PropostaEncontroDataDTO = {
  dataInicio: string;
  dataFim?: string;
};
