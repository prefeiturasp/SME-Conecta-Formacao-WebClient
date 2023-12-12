import { RetornoListagemDTO } from '../dto/retorno-listagem-dto';
import { ApiResult, obterRegistro } from './api';

export const URL_DEFAULT = 'v1';

const obterAnoEtapa = (
  anoLetivo: string,
  AnoLetivo: number,
  Modalidade: number,
  ExibirOpcaoTodos?: boolean,
): Promise<ApiResult<RetornoListagemDTO[]>> => {
  const adicionarModalidade = AnoLetivo ? `?${`Modalidade=${Modalidade}`}` : '';

  return obterRegistro(`${URL_DEFAULT}/Ano/ano-letivo/${anoLetivo}${adicionarModalidade}`, {
    params: { AnoLetivo, ExibirOpcaoTodos },
  });
};

export { obterAnoEtapa };
