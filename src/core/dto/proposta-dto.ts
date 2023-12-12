import { Dayjs } from 'dayjs';
import { Formato } from '../enum/formato';
import { SituacaoRegistro } from '../enum/situacao-registro';
import { TipoFormacao } from '../enum/tipo-formacao';
import { TipoInscricao } from '../enum/tipo-inscricao';
import { AuditoriaDTO } from './auditoria-dto';
import { PropostaAnoTurmaDTO } from './proposta-ano-turmas-dto';
import { PropostaComponenteCurricularDTO } from './proposta-componente-curriculares-dto';
import { PropostaCriterioValidacaoInscricaoDTO } from './proposta-criterio-validacao-inscricao-dto';
import { PropostaDresDTO } from './proposta-dres-dto';
import { PropostaFuncaoEspecificaDTO } from './proposta-funcao-especifica-dto';
import { PropostaImagemDivulgacaoDTO } from './proposta-imagem-divulgacao-dto';
import { PropostaModalidadeDTO } from './proposta-modalidade-dto';
import { PropostaPublicoAlvoDTO } from './proposta-publico-alvo-dto';
import { PropostaVagaRemanecenteDTO } from './proposta-vaga-remanecente-dto';

export type PropostaDTO = {
  formacaoHomologada?: boolean;
  tipoFormacao?: TipoFormacao;
  formato?: Formato;
  tipoInscricao?: TipoInscricao;
  dreIdPropostas: number | null;
  nomeFormacao?: string;
  quantidadeTurmas?: number | null;
  quantidadeVagasTurma?: number | null;
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
  cargaHorariaPresencial?: string;
  cargaHorariaSincrona?: string;
  cargaHorariaDistancia?: string;
  justificativa?: string;
  objetivos?: string;
  referencia?: string;
  procedimentoMetadologico?: string;
  conteudoProgramatico?: string;
  palavrasChaves: PropostaPalavraChaveDTO[];
  criterioCertificacao: CriterioCertificacaoDTO[];
  cursoComCertificado: boolean;
  acaoInformativa: boolean;
  acaoFormativaTexto?: string;
  acaoFormativaLink?: string;
  descricaoDaAtividade?: string;
  turmas?: PropostaTurmaDTO[];
  dres?: PropostaDresDTO[];
  modalidades?: PropostaModalidadeDTO[];
  anosTurmas?: PropostaAnoTurmaDTO[];
  componentesCurriculares?: PropostaComponenteCurricularDTO[];
};

export type PropostaCompletoDTO = {
  auditoria: AuditoriaDTO;
  arquivoImagemDivulgacao?: PropostaImagemDivulgacaoDTO;
} & PropostaDTO;

export type PropostaFormDTO = {
  formacaoHomologada?: boolean;
  tipoFormacao?: TipoFormacao;
  formato?: Formato;
  tipoInscricao?: TipoInscricao;
  dreIdPropostas?: number | null;
  nomeFormacao?: string;
  quantidadeTurmas?: number | null;
  quantidadeVagasTurma?: number | null;
  publicosAlvo?: number[];
  funcoesEspecificas?: number[];
  funcaoEspecificaOutros?: string;
  vagasRemanecentes?: number[];
  criteriosValidacaoInscricao?: number[];
  criterioValidacaoInscricaoOutros?: string;
  situacao?: SituacaoRegistro;
  nomeSituacao?: string;
  auditoria?: AuditoriaDTO;
  arquivos?: any[];
  periodoRealizacao?: Dayjs[];
  periodoInscricao?: Dayjs[];
  cargaHorariaPresencial?: string;
  cargaHorariaSincrona?: string;
  cargaHorariaDistancia?: string;
  justificativa?: string;
  objetivos?: string;
  referencia?: string;
  procedimentoMetadologico?: string;
  conteudoProgramatico?: string;
  palavrasChaves?: number[];
  criterioCertificacao: number[];
  cursoComCertificado: boolean;
  acaoInformativa: boolean;
  descricaoDaAtividade?: string;
  acaoFormativaTexto?: string;
  acaoFormativaLink?: string;
  turmas?: PropostaTurmaDTO[];
  dres?: number[];
  modalidades?: number[];
  anosTurmas?: number[];
  componentesCurriculares?: number[];
};
export type PropostaPalavraChaveDTO = {
  palavraChaveId: number;
};

export type CriterioCertificacaoDTO = {
  criterioCertificacaoId: number;
};

export type PropostaTurmaDTO = {
  id?: number;
  nome: string;
  dreId: number;
};
