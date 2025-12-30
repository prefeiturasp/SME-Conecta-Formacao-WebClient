import { RetornoListagemDTO } from '../dto/retorno-listagem-dto';
import { ApiResult, alterarRegistro, inserirRegistro, obterRegistro } from './api';

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
  percentualFrequencia: number;
  conceitoFinal: string;
  atividadeObrigatorio: boolean;
  aprovado: boolean;
};

export type CriarCodafListaPresencaDTO = {
  propostaId: number;
  propostaTurmaId: number;
  dataPublicacao: string;
  dataPublicacaoDom: string;
  numeroComunicado: number;
  paginaComunicadoDom: number;
  codigoCursoEol: number;
  codigoNivel: number;
  observacao: string;
  inscritos: InscritoDTO[];
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
  coidgoCursoEol: number | null;
  codigoNivel: number;
  observacao: string | null;
  status: number;
  alteradoEm: string | null;
  alteradoPor: string | null;
  alteradoLogin: string | null;
  criadoEm: string;
  criadoPor: string;
  criadoLogin: string;
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
