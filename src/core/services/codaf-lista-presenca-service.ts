import { CodafBaseDetalheDTO } from '../dto/codaf-base-detalhe-dto';
import { RetornoListagemDTO } from '../dto/retorno-listagem-dto';
import { TipoCodaf } from '../enum/tipo-codaf';
import api, {
  ApiResult,
  alterarRegistro,
  deletarRegistro,
  inserirRegistro,
  obterRegistro,
} from './api';
import {
  CodafAnexoDTO,
  CodafAnexoTemporarioDTO,
  CodafInscritoDTO,
  CodafListagemBaseDTO,
  CodafListagemFiltroBaseDTO,
  CodafListagemRetornoBaseDTO,
  CodafRetificacaoDTO,
  montarParametrosFiltroCodaf,
} from './codaf-service-shared';

export const URL_API_CODAF_LISTA_PRESENCA = 'v1/CodafListaPresenca';
export const URL_API_CERTIFICADO = 'v1/CodafCertificado';

export type CodafListaPresencaFiltroDTO = CodafListagemFiltroBaseDTO;

export type CodafListaPresencaDTO = CodafListagemBaseDTO;

export type CodafListaPresencaRetornoDTO = CodafListagemRetornoBaseDTO<CodafListaPresencaDTO>;

export const obterListaPresencaCodaf = (
  filtros: CodafListaPresencaFiltroDTO,
): Promise<ApiResult<CodafListaPresencaRetornoDTO>> => {
  const params = montarParametrosFiltroCodaf(filtros, true);

  return obterRegistro(URL_API_CODAF_LISTA_PRESENCA, { params });
};

export const obterSituacoesCodaf = (): Promise<ApiResult<RetornoListagemDTO[]>> =>
  obterRegistro(`${URL_API_CODAF_LISTA_PRESENCA}/situacao`);

export type InscritoDTO = CodafInscritoDTO;

export type AnexoTemporarioDTO = CodafAnexoTemporarioDTO;

export type AnexoCodafDTO = CodafAnexoDTO;

export type RetificacaoDTO = CodafRetificacaoDTO;

export type CriarCodafListaPresencaDTO = {
  propostaId: number;
  propostaTurmaId: number;
  dataPublicacao: string | null;
  dataPublicacaoDom: string | null;
  numeroComunicado: number;
  paginaComunicadoDom: number;
  codigoCursoEol: number | null;
  codigoNivel: number | null;
  observacao: string;
  inscritos: InscritoDTO[];
  retificacoes?: RetificacaoDTO[];
  anexos?: AnexoCodafDTO[];
};

export type ComentarioCodafDTO = {
  id: number;
  codafListaPresencaId: number;
  comentario: string;
  criadoPor: string;
  criadoLogin: string;
  criadoEm: string;
};

export type InscritoRemovidoDTO = {
  id: number;
  nome: string;
  documento: string;
};

export type InscritoNovoDeltaDTO = {
  id: number;
  documento: string;
  nome: string;
  percentualFrequencia: number;
  conceitoFinal: string;
  atividadeObrigatorio: boolean;
  aprovado: boolean;
};

export type DeltaInscritosDTO = {
  totalNovos: number;
  totalRemovidos: number;
  houveAlteracao: boolean;
  inscritosRemovidos: InscritoRemovidoDTO[];
  inscritosNovos: InscritoNovoDeltaDTO[];
};

export interface CodafListaPresencaDetalheDTO extends CodafBaseDetalheDTO {
  comentario?: ComentarioCodafDTO;
  deltaInscritos?: DeltaInscritosDTO;
}

export const criarCodafListaPresenca = (
  dados: CriarCodafListaPresencaDTO,
): Promise<ApiResult<any>> => {
  return inserirRegistro(URL_API_CODAF_LISTA_PRESENCA, dados);
};

export const obterCodafListaPresencaPorId = async (
  id: number,
): Promise<ApiResult<CodafListaPresencaDetalheDTO>> => {
  const response = await obterRegistro<any>(`${URL_API_CODAF_LISTA_PRESENCA}/${id}`);
  const dados = response.dados?.dados !== undefined ? response.dados.dados : response.dados;
  return { ...response, dados };
};

export const obterDeltaInscritosSilencioso = async (
  id: number,
): Promise<ApiResult<CodafListaPresencaDetalheDTO>> => {
  const response = await obterRegistro<any>(
    `${URL_API_CODAF_LISTA_PRESENCA}/${id}`,
    undefined,
    true,
  );
  const dados = response.dados?.dados !== undefined ? response.dados.dados : response.dados;
  return { ...response, dados };
};

export const atualizarCodafListaPresenca = (
  id: number,
  dados: CriarCodafListaPresencaDTO,
): Promise<ApiResult<any>> => {
  return alterarRegistro(`${URL_API_CODAF_LISTA_PRESENCA}/${id}`, dados);
};

export const deletarRetificacao = (id: string | number): Promise<ApiResult<boolean>> =>
  deletarRegistro(`${URL_API_CODAF_LISTA_PRESENCA}/retificacoes/${id}`);

export type InscritoTurmaDTO = {
  id: number;
  documento: string;
  nome: string;
  percentualFrequencia: number;
  conceitoFinal: string;
  atividadeObrigatorio: boolean;
  aprovado: boolean;
};

export type InscritoTurmaRetornoDTO = {
  items: InscritoTurmaDTO[];
  totalPaginas: number;
  totalRegistros: number;
};

export const obterInscritosTurma = (
  turmaId: number,
  numeroPagina = 1,
  numeroRegistros = 9999,
): Promise<ApiResult<InscritoTurmaRetornoDTO>> => {
  const params = {
    numeroPagina,
    numeroRegistros,
  };
  return obterRegistro(`${URL_API_CODAF_LISTA_PRESENCA}/inscritos-turma/${turmaId}`, { params });
};

export const verificarTurmaPossuiLista = (
  propostaTurmaId: number,
  listaPresencaId?: number,
): Promise<ApiResult<boolean>> => {
  const body = listaPresencaId ? { listaPresencaId } : {};
  return obterRegistro(`${URL_API_CODAF_LISTA_PRESENCA}/turmas/${propostaTurmaId}/possui-lista`, {
    data: body,
  });
};

export const baixarModeloTermoResponsabilidade = () => {
  return api.get(`${URL_API_CODAF_LISTA_PRESENCA}/termo-responsabilidade/modelo`, {
    responseType: 'arraybuffer',
  });
};

export const fazerUploadAnexoCodaf = (
  formData: FormData,
  configuracaoHeader: any,
): Promise<ApiResult<AnexoTemporarioDTO>> =>
  inserirRegistro(
    `${URL_API_CODAF_LISTA_PRESENCA}/anexos/temporarios`,
    formData,
    configuracaoHeader,
  );

export const obterAnexoCodafParaDownload = (arquivoCodigo: string) => {
  return api.get(`${URL_API_CODAF_LISTA_PRESENCA}/anexos/${arquivoCodigo}`, {
    responseType: 'arraybuffer',
  });
};

export const enviarCodafParaDF = (codafListaPresencaId: number): Promise<ApiResult<any>> => {
  return api.patch(`${URL_API_CODAF_LISTA_PRESENCA}/${codafListaPresencaId}/enviar-para-df`);
};

export const devolverCodafParaCorrecao = (
  codafListaPresencaId: number,
  justificativa: string,
): Promise<ApiResult<any>> => {
  return api.patch(
    `${URL_API_CODAF_LISTA_PRESENCA}/${codafListaPresencaId}/devolver-para-correcao`,
    justificativa,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};

export const excluirCodafListaPresenca = (
  codafListaPresencaId: number,
): Promise<ApiResult<any>> => {
  return deletarRegistro(`${URL_API_CODAF_LISTA_PRESENCA}/${codafListaPresencaId}`);
};

export const baixarRelatorioCodaf = (codafListaPresencaId: number): Promise<ApiResult<string>> => {
  return inserirRegistro(
    `${URL_API_CODAF_LISTA_PRESENCA}/${codafListaPresencaId}/gerar-remessa-conclusao`,
    {},
  );
};

export const imprimirRelatorioCodaf = (codafId: number) => {
  return api.post(
    `${URL_API_CODAF_LISTA_PRESENCA}/${codafId}/imprimir`,
    {},
    {
      responseType: 'blob',
    },
  );
};

export const emitirCertificadosCodaf = (codafListaPresencaId: number, tipoCodaf: TipoCodaf): Promise<ApiResult<any>> => {  
  return inserirRegistro(`v1/CodafCertificado/${codafListaPresencaId}/emitir?tipoCodaf=${tipoCodaf}`, {});
};

export type CertificadoUsuarioFiltroDTO = {
  NumeroHomologacao?: number;
  NomeFormacao?: string;
  CodigoCertificado?: number;
  TipoParticipacao?: number;
  DataEmissaoInicio?: string;
  DataEmissaoFim?: string;
  NumeroPagina?: number;
  NumeroRegistros?: number;
};

export type CertificadoUsuarioDTO = {
  id: number;
  numeroHomologacao: number;
  nomeFormacao: string;
  codigoCertificado: number;
  temRf: boolean;
  tipoParticipacao: number;
  dataEmissao: string;
};

export type CertificadoUsuarioRetornoDTO = {
  items: CertificadoUsuarioDTO[];
  totalPaginas: number;
  totalRegistros: number;
};

export const obterCertificadosUsuario = (
  filtros: CertificadoUsuarioFiltroDTO,
): Promise<ApiResult<CertificadoUsuarioRetornoDTO>> => {
  const params: any = {
    NumeroPagina: filtros.NumeroPagina || 1,
    NumeroRegistros: filtros.NumeroRegistros || 10,
  };

  if (filtros.NumeroHomologacao) params.NumeroHomologacao = filtros.NumeroHomologacao;

  if (filtros.NomeFormacao) params.NomeFormacao = filtros.NomeFormacao;

  if (filtros.CodigoCertificado) params.CodigoCertificado = filtros.CodigoCertificado;

  if (filtros.TipoParticipacao) params.TipoParticipacao = filtros.TipoParticipacao;

  if (filtros.DataEmissaoInicio) params.DataEmissaoInicio = filtros.DataEmissaoInicio;

  if (filtros.DataEmissaoFim) params.DataEmissaoFim = filtros.DataEmissaoFim;

  return obterRegistro(`${URL_API_CERTIFICADO}/meus`, { params });
};

export type CertificadoDownloadDTO = {
  id: number;
  codigoCertificado: number;
  urlDownload: string;
  nomeCompleto: string;
  nomeFormacao: string;
};

export const downloadCertificado = (
  certificadoCodafId: number,
): Promise<ApiResult<CertificadoDownloadDTO>> => {
  return obterRegistro(`${URL_API_CERTIFICADO}/${certificadoCodafId}/download`);
};

export type PropostaTurmaComCodafDTO = {
  id: number;
  codafId: number;
  descricao: string;
};

export const obterPropostasTurmasComCodaf = (propostaId: number): Promise<ApiResult<PropostaTurmaComCodafDTO[]>> => {
  return obterRegistro(`${URL_API_CODAF_LISTA_PRESENCA}/propostas/${propostaId}/turmas`);
}