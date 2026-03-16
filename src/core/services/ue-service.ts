import { obterRegistro } from './api';

export type UeDTO = {
  id: string;
  nome: string;
};

export type UePaginadoDTO = {
  items: UeDTO[];
  totalPaginas: number;
  totalRegistros: number;
};

const autocompletarUe = (termoBusca: string, dreId?: number) =>
  obterRegistro<UeDTO[]>('ue/autocompletar-nome', {
    params: { termoBusca, dreId, numeroPagina: 1, numeroRegistros: 99999999 },
  });

const carregarUesPorDre = (dreId: number) =>
  obterRegistro<UePaginadoDTO>('v1/Ue/autocompletar-nome', {
    params: { DreId: dreId, NumeroPagina: 1, NumeroRegistros: 99999 },
  });

export { autocompletarUe, carregarUesPorDre };
