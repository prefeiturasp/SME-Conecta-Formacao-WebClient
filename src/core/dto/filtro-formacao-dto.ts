import { Dayjs } from 'dayjs';

export type FiltroFormacaoDTO = {
  publicosAlvosIds?: number[];
  titulo?: string;
  areasPromotorasIds?: number[];
  dataInicial?: Dayjs;
  dataFinal?: Dayjs;
  formatosIds?: number[];
  palavrasChavesIds?: number[];
};
