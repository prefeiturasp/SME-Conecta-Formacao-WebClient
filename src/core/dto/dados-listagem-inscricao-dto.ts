import { SituacaoInscricao } from '../enum/situacao-inscricao';
import { DadosAnexosInscricaoDTO } from './dados-anexos-inscricao-dto';
import { DadosListagemInscricaoPermissaoDTO } from './dados-listagem-inscricao-permissao-dto';

export interface DadosListagemInscricaoDTO {
  inscricaoId: number;
  nomeTurma?: string;
  registroFuncional?: string;
  cpf: string;
  nomeCursista?: string;
  cargoFuncao?: string;
  situacaoCodigo: SituacaoInscricao;
  situacao: string;
  podeCancelar?: boolean;
  integrarNoSga: boolean;
  iniciado: boolean;
  permissao: DadosListagemInscricaoPermissaoDTO;
  anexos: DadosAnexosInscricaoDTO[];
}
