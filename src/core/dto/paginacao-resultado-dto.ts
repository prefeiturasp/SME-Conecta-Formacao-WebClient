export type PaginacaoResultadoDTO<T> = {
  sucesso: boolean;
  items: T;
  totalPaginas: number;
  totalRegistros: number;
};
