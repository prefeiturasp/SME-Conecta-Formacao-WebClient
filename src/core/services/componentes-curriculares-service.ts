import { RetornoListagemDTO } from '../dto/retorno-listagem-dto';
import { ApiResult, obterRegistro } from './api';

export const URL_DEFAULT = 'v1';

const obterComponenteCurricular = (
  AnoTurmaId: number[],
  ExibirOpcaoTodos?: boolean,
): Promise<ApiResult<RetornoListagemDTO[]>> => {
  const adicionarAnosTurmaId = AnoTurmaId?.length
    ? `?${AnoTurmaId.map((item) => `AnoTurmaId=${item}`).join('&')}`
    : '';

  return obterRegistro(`${URL_DEFAULT}/componentes-curriculares${adicionarAnosTurmaId}`, {
    params: { ExibirOpcaoTodos },
  });
};

export { obterComponenteCurricular };
