export type CodafListagemFiltroBaseDTO = {
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

export type CodafListagemBaseDTO = {
  id: number;
  numeroHomologacao: number;
  nomeFormacao: string;
  codigoFormacao: number;
  nomeTurma: string;
  nomeAreaPromotora: string;
  status: number;
  statusCertificacaoTurma: number;
  codigoCursoEol: number | null;
  codigoNivel: number | null;
};

export type CodafListagemRetornoBaseDTO<TItem extends CodafListagemBaseDTO> = {
  items: TItem[];
  totalRegistros: number;
  totalPaginas: number;
};

export type CodafInscritoDTO = {
  inscricaoId: number;
  percentualFrequencia: number | null;
  conceitoFinal: string | null;
  atividadeObrigatorio: boolean | null;
  aprovado: boolean | null;
};

export type CodafAnexoDTO = {
  arquivoCodigo: string;
  nomeArquivo: string;
  tipoAnexoId: number;
};

export type CodafRetificacaoDTO = {
  id: number;
  dataRetificacao: string | null;
  paginaRetificacaoDom: number;
};

export type CodafAnexoTemporarioDTO = {
  arquivoCodigo: string;
  nomeArquivo: string;
  extensao: string;
  urlDownload: string;
  contentType: string;
  tamanhoBytes: number;
};

export const montarParametrosFiltroCodaf = (
  filtros: CodafListagemFiltroBaseDTO,
  incluirDataEnvioDf = false,
) => {
  const params: Record<string, string | number> = {
    NumeroPagina: filtros.NumeroPagina || 1,
    NumeroRegistros: filtros.NumeroRegistros || 10,
  };

  if (filtros.NomeFormacao) params.NomeFormacao = filtros.NomeFormacao;
  if (filtros.CodigoFormacao) params.CodigoFormacao = filtros.CodigoFormacao;
  if (filtros.NumeroHomologacao) params.NumeroHomologacao = filtros.NumeroHomologacao;
  if (filtros.PropostaTurmaId) params.PropostaTurmaId = filtros.PropostaTurmaId;
  if (filtros.AreaPromotoraId) params.AreaPromotoraId = filtros.AreaPromotoraId;
  if (filtros.Status !== null && filtros.Status !== undefined) params.Status = filtros.Status;
  if (incluirDataEnvioDf && filtros.DataEnvioDf) params.DataEnvioDf = filtros.DataEnvioDf;

  return params;
};