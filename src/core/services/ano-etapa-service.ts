import queryString from 'query-string';
import { RetornoListagemDTO } from '../dto/retorno-listagem-dto';
import { obterRegistro } from './api';

export const URL_ANO_ETAPA = 'v1/AnoTurma';

const obterAnoEtapa = (AnoLetivo: number, Modalidade: number, ExibirOpcaoTodos?: boolean) => {
  return obterRegistro<RetornoListagemDTO[]>(URL_ANO_ETAPA, {
    params: { AnoLetivo, Modalidade, ExibirOpcaoTodos },
    paramsSerializer: {
      serialize: (params: {
        AnoLetivo: number;
        Modalidade: number;
        ExibirOpcaoTodos?: boolean;
      }) => {
        return queryString.stringify(params, {
          skipNull: true,
          skipEmptyString: true,
        });
      },
    },
  });
};

export { obterAnoEtapa };
