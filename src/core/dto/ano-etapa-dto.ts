import { AnoEtapaEnum } from '../enum/ano-etapa-enum';

export type AnoEtapaDTO = {
  id: number;
  nome: string;
  tipo: AnoEtapaEnum;
  todos?: boolean;
};
