export interface CodafBaseDetalheDTO {
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
}

export type RetificacaoDTO = {
  id: number;
  dataRetificacao: string | null;
  paginaRetificacaoDom: number;
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