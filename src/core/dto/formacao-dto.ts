import { Modalidade } from '../enum/modalidade';
import { TipoFormacao } from '../enum/tipo-formacao';

export type FormacaoDTO = {
  id?: number;
  titulo?: string;
  periodo?: string;
  areaPromotora?: string;
  tipoFormacao?: TipoFormacao;
  tipoFormacaoDescricao?: string;
  formato?: Modalidade;
  formatoDescricao?: string;
  inscricaoEncerrada?: boolean;
  imagemUrl?: string;
};
