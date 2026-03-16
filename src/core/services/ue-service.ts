import { obterRegistro } from './api';

const URL_DEFAULT = 'v1/Ue';

export type UeDTO = {
  id: string;
  descricao: string;
};

const autocompletarUe = (termoBusca: string, dreId?: number) =>
  obterRegistro<UeDTO[]>(`${URL_DEFAULT}/autocompletar-nome`, {
    params: { TermoBusca: termoBusca, DreId: dreId, NumeroPagina: 1, NumeroRegistros: 99999999 },
  });

export { autocompletarUe };
