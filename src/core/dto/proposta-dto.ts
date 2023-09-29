import { Dayjs } from 'dayjs';
import { Modalidade } from '../enum/modalidade';
import { SituacaoRegistro } from '../enum/situacao-registro';
import { TipoFormacao } from '../enum/tipo-formacao';
import { TipoInscricao } from '../enum/tipo-inscricao';
import { AuditoriaDTO } from './auditoria-dto';
import { PropostaCriterioValidacaoInscricaoDTO } from './proposta-criterio-validacao-inscricao-dto';
import { PropostaFuncaoEspecificaDTO } from './proposta-funcao-especifica-dto';
import { PropostaImagemDivulgacaoDTO } from './proposta-imagem-divulgacao-dto';
import { PropostaPublicoAlvoDTO } from './proposta-publico-alvo-dto';
import { PropostaVagaRemanecenteDTO } from './proposta-vaga-remanecente-dto';

export type PropostaDTO = {
  tipoFormacao?: TipoFormacao;
  modalidade?: Modalidade;
  tipoInscricao?: TipoInscricao;
  nomeFormacao?: string;
  quantidadeTurmas?: number;
  quantidadeVagasTurma?: number;
  funcaoEspecificaOutros: string;
  criterioValidacaoInscricaoOutros: string;
  situacao: SituacaoRegistro;
  arquivoImagemDivulgacaoId?: number;
  dataRealizacaoInicio?: Dayjs;
  dataRealizacaoFim?: Dayjs;
  dataInscricaoInicio?: Dayjs;
  dataInscricaoFim?: Dayjs;
  publicosAlvo: PropostaPublicoAlvoDTO[];
  funcoesEspecificas: PropostaFuncaoEspecificaDTO[];
  vagasRemanecentes: PropostaVagaRemanecenteDTO[];
  criteriosValidacaoInscricao: PropostaCriterioValidacaoInscricaoDTO[];
};

export type PropostaCompletoDTO = {
  auditoria: AuditoriaDTO;
  arquivoImagemDivulgacao?: PropostaImagemDivulgacaoDTO;
} & PropostaDTO;

export type PropostaFormDTO = {
  tipoFormacao?: TipoFormacao;
  modalidade?: Modalidade;
  tipoInscricao?: TipoInscricao;
  nomeFormacao?: string;
  quantidadeTurmas?: number;
  quantidadeVagasTurma?: number;
  publicosAlvo?: number[];
  funcoesEspecificas?: number[];
  funcaoEspecificaOutros?: string;
  vagasRemanecentes?: number[];
  criteriosValidacaoInscricao?: number[];
  criterioValidacaoInscricaoOutros?: string;
  situacao?: SituacaoRegistro;
  auditoria?: AuditoriaDTO;
  arquivos?: any[];
  periodoRealizacao?: Dayjs[];
  periodoInscricao?: Dayjs[];
};
