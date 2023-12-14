import { Dayjs } from 'dayjs';

export type FiltroFormacaoFormDTO = {
  publicosAlvosIds?: number[];
  titulo?: string;
  areasPromotorasIds?: number[];
  data?: Dayjs[];
  formatosIds?: number[];
  palavrasChavesIds?: number[];
};
