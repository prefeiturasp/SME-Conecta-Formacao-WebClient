import { RetornoListagemDTO } from '../dto/retorno-listagem-dto';
import { ApiResult, alterarRegistro, deletarRegistro, inserirRegistro, obterRegistro } from './api';
import api from './api';

export const URL_API_CODAF_LISTA_PRESENCA = 'v1/CodafListaPresenca';

export type CodafListaPresencaFiltroDTO = {
  NomeFormacao?: string | null;
  CodigoFormacao?: number | null;
  NumeroHomologacao?: number | null;
  PropostaTurmaId?: number | null;
  AreaPromotoraId?: number | null;
  Status?: number | null;
  DataEnvioDf?: string | null;
  NumeroPagina?: number;
  NumeroRegistros?: number;
};

export type CodafListaPresencaDTO = {
  id: number;
  numeroHomologacao: number;
  nomeFormacao: string;
  codigoFormacao: number;
  nomeTurma: string;
  nomeAreaPromotora: string;
  status: number;
  statusCertificacaoTurma: number;
};

export type CodafListaPresencaRetornoDTO = {
  items: CodafListaPresencaDTO[];
  totalRegistros: number;
  totalPaginas: number;
};

export const obterListaPresencaCodaf = (
  filtros: CodafListaPresencaFiltroDTO,
): Promise<ApiResult<CodafListaPresencaRetornoDTO>> => {
  const params: any = {
    NumeroPagina: filtros.NumeroPagina || 1,
    NumeroRegistros: filtros.NumeroRegistros || 10,
  };

  if (filtros.NomeFormacao) params.NomeFormacao = filtros.NomeFormacao;
  if (filtros.CodigoFormacao) params.CodigoFormacao = filtros.CodigoFormacao;
  if (filtros.NumeroHomologacao) params.NumeroHomologacao = filtros.NumeroHomologacao;
  if (filtros.PropostaTurmaId) params.PropostaTurmaId = filtros.PropostaTurmaId;
  if (filtros.AreaPromotoraId) params.AreaPromotoraId = filtros.AreaPromotoraId;
  if (filtros.Status !== null && filtros.Status !== undefined) params.Status = filtros.Status;
  if (filtros.DataEnvioDf) params.DataEnvioDf = filtros.DataEnvioDf;

  return obterRegistro(URL_API_CODAF_LISTA_PRESENCA, { params });
};

export const obterSituacoesCodaf = (): Promise<ApiResult<RetornoListagemDTO[]>> =>
  obterRegistro(`${URL_API_CODAF_LISTA_PRESENCA}/situacao`);

export type InscritoDTO = {
  inscricaoId: number;
  percentualFrequencia: number | null;
  conceitoFinal: string | null;
  atividadeObrigatorio: boolean | null;
  aprovado: boolean | null;
};

export type RetificacaoDTO = {
  id: number;
  dataRetificacao: string | null;
  paginaRetificacaoDom: number;
};

export type AnexoTemporarioDTO = {
  arquivoCodigo: string;
  nomeArquivo: string;
  extensao: string;
  urlDownload: string;
  contentType: string;
  tamanhoBytes: number;
};

export type AnexoCodafDTO = {
  arquivoCodigo: string;
  nomeArquivo: string;
  tipoAnexoId: number;
};

export type AnexoCodafDetalheDTO = {
  id: number;
  codafListaPresencaId: number;
  arquivoCodigo: string;
  nomeArquivo: string;
  extensao: string;
  tipoAnexoId: number;
  urlDownload: string;
  alteradoEm: string | null;
  alteradoPor: string | null;
  alteradoLogin: string | null;
  criadoEm: string;
  criadoPor: string;
  criadoLogin: string;
};

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

export type CodafListaPresencaDetalheDTO = {
  id: number;
  propostaId: number;
  propostaTurmaId: number;
  numeroHomologacao: number;
  nomeFormacao: string;
  codigoFormacao: number;
  numeroComunicado: number;
  dataPublicacao: string | null;
  paginaComunicadoDom: number;
  dataPublicacaoDom: string | null;
  codigoCursoEol: number | null;
  codigoNivel: number;
  observacao: string | null;
  status: number;
  alteradoEm: string | null;
  alteradoPor: string | null;
  alteradoLogin: string | null;
  criadoEm: string;
  criadoPor: string;
  criadoLogin: string;
  retificacoes?: RetificacaoDTO[];
  anexos?: AnexoCodafDetalheDTO[];
  comentario?: ComentarioCodafDTO;
};

export const criarCodafListaPresenca = (
  dados: CriarCodafListaPresencaDTO,
): Promise<ApiResult<any>> => {
  return inserirRegistro(URL_API_CODAF_LISTA_PRESENCA, dados);
};

export const obterCodafListaPresencaPorId = (
  id: number,
): Promise<ApiResult<CodafListaPresencaDetalheDTO>> => {
  return obterRegistro(`${URL_API_CODAF_LISTA_PRESENCA}/${id}`);
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
  cpf: string;
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
