import { SituacaoParecerista } from '../enum/situacao-parecerista-enum';

export type PropostaPareceristaSugestaoDTO = {
  parecerista: string;
  justificativa: string;
  situacao: SituacaoParecerista;
};
