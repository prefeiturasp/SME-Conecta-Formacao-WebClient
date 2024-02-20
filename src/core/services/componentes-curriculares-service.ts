import { RetornoListagemDTO } from '../dto/retorno-listagem-dto';
import { obterRegistro } from './api';

const URL_API_COMPONENTE_CURRICULAR = 'v1/componentes-curriculares';

const obterComponenteCurricular = (anoTurmaId: number[], exibirOpcaoTodos?: boolean) => {
  return obterRegistro<RetornoListagemDTO[]>(URL_API_COMPONENTE_CURRICULAR, {
    params: {
      exibirOpcaoTodos,
      anoTurmaId,
    },
  });
};

export { obterComponenteCurricular };
