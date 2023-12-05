import { Modalidade } from '../enum/modalidade';

export type AnoEtapaDTO = {
  codigoEOL: string;
  descricao: string;
  codigoSerieEnsino: number;
  modalidade: Modalidade;
};
