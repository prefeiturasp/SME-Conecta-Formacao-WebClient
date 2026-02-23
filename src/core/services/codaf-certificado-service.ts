import { ApiResult, obterRegistro } from './api';

const URL_DEFAULT = 'v1/CodafCertificado';

export type CodafCertificadoFiltroDTO = {
  NumeroHomologacao?: number | null;
  NomeFormacao?: string | null;
  CodigoCertificado?: string | null;
  TipoCertificado?: number | null;
  DocumentoCursista?: string | null;
  DocumentoRegente?: string | null;
  NomeCursista?: string | null;
  DataEmissao?: string | null;
  DreId?: number | null;
  NumeroPagina?: number;
  NumeroRegistros?: number;
};

export type CodafCertificadoDTO = {
  id: number;
  numeroHomologacao: number;
  nomeFormacao: string;
  documento: string;
  codigoCertificado: number;
  tipoCertificado: number;
  dataEmissao: string;
  nomeParticipante: string;
};

export type CodafCertificadoRetornoDTO = {
  items: CodafCertificadoDTO[];
  totalPaginas: number;
  totalRegistros: number;
};

export const obterCertificadosCodaf = (
  filtros: CodafCertificadoFiltroDTO,
): Promise<ApiResult<CodafCertificadoRetornoDTO>> => {
  const params: Record<string, unknown> = {
    NumeroPagina: filtros.NumeroPagina || 1,
    NumeroRegistros: filtros.NumeroRegistros || 10,
  };

  if (filtros.NumeroHomologacao) params.NumeroHomologacao = filtros.NumeroHomologacao;
  if (filtros.NomeFormacao) params.NomeFormacao = filtros.NomeFormacao;
  if (filtros.CodigoCertificado) params.CodigoCertificado = filtros.CodigoCertificado;
  if (filtros.TipoCertificado !== null && filtros.TipoCertificado !== undefined)
    params.TipoCertificado = filtros.TipoCertificado;
  if (filtros.DocumentoCursista) params.DocumentoCursista = filtros.DocumentoCursista;
  if (filtros.DocumentoRegente) params.DocumentoRegente = filtros.DocumentoRegente;
  if (filtros.NomeCursista) params.NomeCursista = filtros.NomeCursista;
  if (filtros.DataEmissao) params.DataEmissao = filtros.DataEmissao;
  if (filtros.DreId) params.DreId = filtros.DreId;

  return obterRegistro(URL_DEFAULT, { params });
};
