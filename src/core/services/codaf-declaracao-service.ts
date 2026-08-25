import api, { ApiResult, obterRegistro } from './api';

const URL_DEFAULT = 'v1/CodafDeclaracao';

export type CodafDeclaracaoFiltroDTO = {
  NumeroHomologacao?: number | null;
  NomeFormacao?: string | null;
  CodigoFormacao?: number | null;
  CodigoDeclaracao?: number | null;
  TipoDeclaracao?: number | null;
  TipoEmissor?: number | null;
  DocumentoCursista?: string | null;
  DocumentoRegente?: string | null;
  NomeCursista?: string | null;
  DataEmissao?: string | null;
  EmissorId?: number | null;
  TurmaId?: number | null;
  Pagina?: number;
  TamanhoPagina?: number;
};

export type CodafDeclaracaoDTO = {
  id: number;
  numeroHomologacao: number;
  nomeFormacao: string;
  documentoCursista: string;
  documentoRegente: string;
  codigoDeclaracao: number;
  tipoDeclaracao: number;
  dataEmissao: string;
  nomeCursista: string;
  nomeRegente: string;
};

export type CodafDeclaracaoRetornoDTO = {
  items: CodafDeclaracaoDTO[];
  totalPaginas: number;
  totalRegistros: number;
};

export const obterDeclaracoesCodaf = (
  filtros: CodafDeclaracaoFiltroDTO,
): Promise<ApiResult<CodafDeclaracaoRetornoDTO>> => {
  const params: Record<string, unknown> = {
    Pagina: filtros.Pagina || 1,
    TamanhoPagina: filtros.TamanhoPagina || 10,
  };

  if (filtros.NumeroHomologacao) params.NumeroHomologacao = filtros.NumeroHomologacao;
  if (filtros.NomeFormacao) params.NomeFormacao = filtros.NomeFormacao;
  if (filtros.CodigoFormacao) params.CodigoFormacao = filtros.CodigoFormacao;
  if (filtros.CodigoDeclaracao) params.CodigoDeclaracao = filtros.CodigoDeclaracao;
  if (filtros.TipoDeclaracao !== null && filtros.TipoDeclaracao !== undefined)
    params.TipoDeclaracao = filtros.TipoDeclaracao;
  if (filtros.TipoEmissor !== null && filtros.TipoEmissor !== undefined)
    params.TipoEmissor = filtros.TipoEmissor;
  if (filtros.DocumentoCursista) params.DocumentoCursista = filtros.DocumentoCursista;
  if (filtros.DocumentoRegente) params.DocumentoRegente = filtros.DocumentoRegente;
  if (filtros.NomeCursista) params.NomeCursista = filtros.NomeCursista;
  if (filtros.DataEmissao) params.DataEmissao = filtros.DataEmissao;
  if (filtros.EmissorId) params.EmissorId = filtros.EmissorId;
  if (filtros.TurmaId) params.TurmaId = filtros.TurmaId;

  return obterRegistro(URL_DEFAULT, { params });
};

import { downloadDocumentosLote } from './codaf-service-shared';

export const downloadDeclaracoesLote = (ids: number[]) => {
  return downloadDocumentosLote(`${URL_DEFAULT}/download-lote`, ids, 'Erro ao baixar as declarações.');
};
