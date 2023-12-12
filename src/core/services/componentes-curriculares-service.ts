import queryString from 'query-string';
import { RetornoListagemDTO } from '../dto/retorno-listagem-dto';
import { obterRegistro } from './api';

const URL_API_COMPONENTE_CURRICULAR = 'v1/componentes-curriculares';

const obterComponenteCurricular = (anoTurmaId: number[], exibirOpcaoTodos?: boolean) => {
  return obterRegistro<RetornoListagemDTO[]>(URL_API_COMPONENTE_CURRICULAR, {
    params: { exibirOpcaoTodos, anoTurmaId },
    paramsSerializer: {
      serialize: (params: { anoTurmaId: number[]; exibirOpcaoTodos?: boolean }) => {
        return queryString.stringify(params, {
          skipNull: true,
          skipEmptyString: true,
        });
      },
    },
  });
};

export { obterComponenteCurricular };
